/**
 * 订单状态一致性原子更新验证脚本
 * 直接测试数据库层面的原子更新逻辑
 * 
 * 测试场景：
 * 1. 重复发货 - 尝试对同一个订单项多次发货
 * 2. 未发货直接送达 - 尝试对未发货的订单项直接送达
 * 3. 重复送达 - 尝试对同一个订单项多次送达
 * 4. 无权限卖家发货 - 非商品卖家尝试发货
 * 5. 无权限配送员送达 - 非配送区域的配送员尝试送达
 * 6. 并发发货测试 - 模拟并发请求
 */

const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/inventory_test';

const ObjectId = mongoose.Types.ObjectId;

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId },
  orderDate: { type: Date, default: Date.now },
  products: [{
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    product: { type: mongoose.Schema.Types.ObjectId },
    quantity: { type: Number },
    sellerId: { type: mongoose.Schema.Types.ObjectId },
    orderState: {
      pending: { type: Boolean, default: true },
      shipped: { type: Boolean, default: false },
      delivered: { type: Boolean, default: false }
    }
  }],
  address: { type: mongoose.Schema.Types.ObjectId },
  addressState: { type: String }
});

const TestOrder = mongoose.model('TestOrder', OrderSchema);

const testResults = [];

function logTest(name, passed, message) {
  const result = { name, passed, message };
  testResults.push(result);
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}`);
  if (message) {
    console.log(`   ${message}`);
  }
}

async function createTestOrder(data) {
  return await TestOrder.create({
    user: data.user || ObjectId(),
    products: [{
      _id: data.orderItemId || ObjectId(),
      product: data.product || ObjectId(),
      quantity: 1,
      sellerId: data.sellerId,
      orderState: {
        pending: data.pending !== undefined ? data.pending : true,
        shipped: data.shipped !== undefined ? data.shipped : false,
        delivered: data.delivered !== undefined ? data.delivered : false
      }
    }],
    address: data.address || ObjectId(),
    addressState: data.addressState || 'California'
  });
}

async function simulateMarkAsShipped(orderItemId, sellerId) {
  return await TestOrder.findOneAndUpdate(
    {
      products: {
        $elemMatch: {
          _id: mongoose.Types.ObjectId(orderItemId),
          sellerId: mongoose.Types.ObjectId(sellerId),
          'orderState.pending': true,
          'orderState.shipped': false
        }
      }
    },
    {
      $set: {
        'products.$.orderState.shipped': true,
        'products.$.orderState.pending': false,
        shippedDate: Date.now()
      }
    },
    { new: true, useFindAndModify: false }
  );
}

async function simulateMarkAsDelivered(orderItemId, shipperArea) {
  return await TestOrder.findOneAndUpdate(
    {
      addressState: shipperArea,
      products: {
        $elemMatch: {
          _id: mongoose.Types.ObjectId(orderItemId),
          'orderState.shipped': true,
          'orderState.delivered': false
        }
      }
    },
    {
      $set: {
        'products.$.orderState.delivered': true,
        deliveredDate: Date.now()
      }
    },
    { new: true, useFindAndModify: false }
  );
}

async function runTests() {
  console.log('========================================');
  console.log('  订单状态一致性原子更新验证测试');
  console.log('========================================\n');

  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('✅ 数据库连接成功\n');

    await TestOrder.deleteMany({});
    console.log('✅ 清理测试数据\n');

    console.log('--- 测试场景1：重复发货 ---\n');
    {
      const sellerId = ObjectId();
      const orderItemId = ObjectId();
      
      await createTestOrder({
        orderItemId,
        sellerId,
        pending: true,
        shipped: false,
        delivered: false
      });

      const result1 = await simulateMarkAsShipped(orderItemId, sellerId);
      const test1Passed = result1 !== null && 
        result1.products[0].orderState.shipped === true &&
        result1.products[0].orderState.pending === false;
      logTest('第一次发货成功', test1Passed, 
        test1Passed ? '状态更新为：shipped=true, pending=false' : '发货失败');

      const result2 = await simulateMarkAsShipped(orderItemId, sellerId);
      const test2Passed = result2 === null;
      logTest('第二次发货失败（重复发货）', test2Passed,
        test2Passed ? '原子更新条件阻止了重复发货' : '重复发货成功，这是错误的！');
    }

    console.log('\n--- 测试场景2：未发货直接送达 ---\n');
    {
      const sellerId = ObjectId();
      const orderItemId = ObjectId();
      
      await createTestOrder({
        orderItemId,
        sellerId,
        pending: true,
        shipped: false,
        delivered: false,
        addressState: 'NewYork'
      });

      const result = await simulateMarkAsDelivered(orderItemId, 'NewYork');
      const testPassed = result === null;
      logTest('未发货直接送达失败', testPassed,
        testPassed ? '原子更新条件阻止了未发货直接送达（shipped必须为true）' : '未发货直接送达成功，这是错误的！');
    }

    console.log('\n--- 测试场景3：重复送达 ---\n');
    {
      const sellerId = ObjectId();
      const orderItemId = ObjectId();
      
      await createTestOrder({
        orderItemId,
        sellerId,
        pending: false,
        shipped: true,
        delivered: false,
        addressState: 'Texas'
      });

      const result1 = await simulateMarkAsDelivered(orderItemId, 'Texas');
      const test1Passed = result1 !== null && 
        result1.products[0].orderState.delivered === true;
      logTest('第一次送达成功', test1Passed,
        test1Passed ? '状态更新为：delivered=true' : '送达失败');

      const result2 = await simulateMarkAsDelivered(orderItemId, 'Texas');
      const test2Passed = result2 === null;
      logTest('第二次送达失败（重复送达）', test2Passed,
        test2Passed ? '原子更新条件阻止了重复送达' : '重复送达成功，这是错误的！');
    }

    console.log('\n--- 测试场景4：无权限卖家发货 ---\n');
    {
      const correctSellerId = ObjectId();
      const wrongSellerId = ObjectId();
      const orderItemId = ObjectId();
      
      await createTestOrder({
        orderItemId,
        sellerId: correctSellerId,
        pending: true,
        shipped: false,
        delivered: false
      });

      const result = await simulateMarkAsShipped(orderItemId, wrongSellerId);
      const testPassed = result === null;
      logTest('无权限卖家发货失败', testPassed,
        testPassed ? '原子更新条件包含了sellerId检查，阻止了无权限操作' : '无权限卖家发货成功，这是错误的！');

      const verifyResult = await TestOrder.findOne({ 'products._id': orderItemId });
      const stateUnchanged = verifyResult.products[0].orderState.shipped === false;
      logTest('订单状态未被修改', stateUnchanged,
        stateUnchanged ? 'shipped仍为false' : '状态被意外修改');
    }

    console.log('\n--- 测试场景5：无权限配送员送达 ---\n');
    {
      const sellerId = ObjectId();
      const orderItemId = ObjectId();
      const correctArea = 'Florida';
      const wrongArea = 'Alaska';
      
      await createTestOrder({
        orderItemId,
        sellerId,
        pending: false,
        shipped: true,
        delivered: false,
        addressState: correctArea
      });

      const result = await simulateMarkAsDelivered(orderItemId, wrongArea);
      const testPassed = result === null;
      logTest('非配送区域配送员送达失败', testPassed,
        testPassed ? `原子更新条件包含了addressState检查（订单区域:${correctArea}, 配送员区域:${wrongArea}）` : '非配送区域配送员送达成功，这是错误的！');

      const verifyResult = await TestOrder.findOne({ 'products._id': orderItemId });
      const stateUnchanged = verifyResult.products[0].orderState.delivered === false;
      logTest('订单状态未被修改', stateUnchanged,
        stateUnchanged ? 'delivered仍为false' : '状态被意外修改');
    }

    console.log('\n--- 测试场景6：并发发货测试 ---\n');
    {
      const sellerId = ObjectId();
      const orderItemId = ObjectId();
      
      await createTestOrder({
        orderItemId,
        sellerId,
        pending: true,
        shipped: false,
        delivered: false
      });

      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(simulateMarkAsShipped(orderItemId, sellerId));
      }

      const results = await Promise.all(promises);
      
      const successCount = results.filter(r => r !== null).length;
      const failureCount = results.filter(r => r === null).length;

      const testPassed = successCount === 1 && failureCount === 4;
      logTest('并发发货测试', testPassed,
        testPassed 
          ? `成功: ${successCount}, 失败: ${failureCount} (预期：成功=1, 失败=4)`
          : `成功: ${successCount}, 失败: ${failureCount} (预期：成功=1, 失败=4) - 存在并发问题！`);
    }

    console.log('\n--- 测试场景7：正确权限验证 ---\n');
    {
      const sellerId = ObjectId();
      const orderItemId = ObjectId();
      const area = 'Washington';
      
      const order = await createTestOrder({
        orderItemId,
        sellerId,
        pending: true,
        shipped: false,
        delivered: false,
        addressState: area
      });

      const shipResult = await simulateMarkAsShipped(orderItemId, sellerId);
      const shipTest = shipResult !== null && 
        shipResult.products[0].orderState.shipped === true;
      logTest('正确卖家发货成功', shipTest,
        shipTest ? 'sellerId匹配，发货成功' : '发货失败');

      const deliverResult = await simulateMarkAsDelivered(orderItemId, area);
      const deliverTest = deliverResult !== null && 
        deliverResult.products[0].orderState.delivered === true;
      logTest('正确区域配送员送达成功', deliverTest,
        deliverTest ? `addressState匹配（${area}），送达成功` : '送达失败');

      const finalOrder = await TestOrder.findOne({ 'products._id': orderItemId });
      const finalState = finalOrder.products[0].orderState;
      const finalTest = finalState.pending === false && 
        finalState.shipped === true && 
        finalState.delivered === true;
      logTest('最终状态验证', finalTest,
        finalTest 
          ? `pending: ${finalState.pending}, shipped: ${finalState.shipped}, delivered: ${finalState.delivered}`
          : `状态异常: pending=${finalState.pending}, shipped=${finalState.shipped}, delivered=${finalState.delivered}`);
    }

    console.log('\n========================================');
    console.log('  测试结果汇总');
    console.log('========================================\n');

    const passedCount = testResults.filter(r => r.passed).length;
    const failedCount = testResults.filter(r => !r.passed).length;
    const totalCount = testResults.length;

    console.log(`总计: ${totalCount} 个测试`);
    console.log(`✅ 通过: ${passedCount}`);
    console.log(`❌ 失败: ${failedCount}`);

    if (failedCount > 0) {
      console.log('\n失败的测试:');
      testResults.filter(r => !r.passed).forEach(r => {
        console.log(`  - ${r.name}: ${r.message}`);
      });
    } else {
      console.log('\n🎉 所有测试通过！原子更新条件正确实现了权限边界和状态保护。');
    }

    await TestOrder.deleteMany({});
    await mongoose.disconnect();
    
    process.exit(failedCount > 0 ? 1 : 0);

  } catch (err) {
    console.error('\n❌ 测试执行错误:', err.message);
    console.error(err.stack);
    try {
      await mongoose.disconnect();
    } catch (e) {}
    process.exit(1);
  }
}

runTests();
