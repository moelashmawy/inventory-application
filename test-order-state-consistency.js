/**
 * 订单状态一致性验证脚本
 * 用于验证原子条件更新是否正确实现
 * 
 * 测试场景：
 * 1. 重复发货 - 尝试对同一个订单项多次发货
 * 2. 未发货直接送达 - 尝试对未发货的订单项直接送达
 * 3. 重复送达 - 尝试对同一个订单项多次送达
 * 
 * 使用方法：
 * 1. 确保数据库连接正常
 * 2. 运行此脚本：node test-order-state-consistency.js
 * 
 * 注意：此脚本需要在有实际数据的环境中运行，或者修改为使用模拟数据
 */

const mongoose = require('mongoose');
require('dotenv').config();

// 连接数据库
const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/inventory';

// 模拟订单数据结构
const createTestOrderItem = (state) => ({
  _id: mongoose.Types.ObjectId(),
  product: {
    _id: mongoose.Types.ObjectId(),
    name: 'Test Product',
    price: 100,
    seller: mongoose.Types.ObjectId()
  },
  quantity: 1,
  orderState: state
});

// 测试场景说明
console.log('=== 订单状态一致性验证 ===\n');
console.log('本脚本用于说明原子条件更新的实现原理和测试场景。\n');

console.log('--- 原实现的问题 ---');
console.log('原代码的问题在于：先查询判断状态，再按订单项ID更新。');
console.log('这种方式存在并发问题：两个并发请求可能都查询到相同的状态，然后都执行更新，导致状态覆盖。\n');

console.log('--- 修复方案 ---');
console.log('修复方案：将状态检查移到数据库更新条件中，使用MongoDB的原子条件更新。');
console.log('这样，即使有并发请求，只有满足条件的第一个请求会成功，后续请求会失败。\n');

console.log('--- 修复后的查询条件 ---');
console.log('1. 发货操作 (markAsShipped)：');
console.log('   查询条件：pending=true AND shipped=false');
console.log('   更新操作：shipped=true, pending=false\n');

console.log('2. 送达操作 (markAsDelivered)：');
console.log('   查询条件：shipped=true AND delivered=false');
console.log('   更新操作：delivered=true (不再将shipped改为false)\n');

console.log('--- 测试场景验证 ---');

// 场景1：重复发货测试
console.log('\n【场景1：重复发货测试】');
console.log('初始状态：pending=true, shipped=false, delivered=false');
console.log('预期行为：第一次发货成功，第二次及以后发货失败');
console.log('修复前问题：如果两个请求同时到达，都查询到pending=true, shipped=false，然后都执行更新，导致重复发货');
console.log('修复后保障：更新条件中包含pending=true AND shipped=false，只有第一个请求会匹配成功，后续请求无法匹配');
console.log('验证方法：');
console.log('  1. 找到一个待发货的订单项（pending=true, shipped=false）');
console.log('  2. 连续两次调用发货接口：GET /api/order/ordersToShip/markAsShipped?orderId=xxx');
console.log('  3. 第一次应该返回成功，第二次应该返回"Order is already shipped"或类似错误');

// 场景2：未发货直接送达测试
console.log('\n【场景2：未发货直接送达测试】');
console.log('初始状态：pending=true, shipped=false, delivered=false');
console.log('预期行为：送达操作失败，提示需要先发货');
console.log('修复前问题：如果代码逻辑有漏洞，可能允许未发货直接送达');
console.log('修复后保障：更新条件中包含shipped=true AND delivered=false，未发货的订单项无法匹配');
console.log('验证方法：');
console.log('  1. 找到一个待发货的订单项（pending=true, shipped=false）');
console.log('  2. 直接调用送达接口：GET /api/order/ordersToDeliver/markAsDelivered?orderId=xxx');
console.log('  3. 应该返回"Order must be shipped before it can be delivered"错误');

// 场景3：重复送达测试
console.log('\n【场景3：重复送达测试】');
console.log('初始状态：pending=false, shipped=true, delivered=false');
console.log('预期行为：第一次送达成功，第二次及以后送达失败');
console.log('修复前问题：如果两个请求同时到达，都查询到shipped=true, delivered=false，然后都执行更新，导致重复送达');
console.log('修复后保障：更新条件中包含shipped=true AND delivered=false，只有第一个请求会匹配成功');
console.log('验证方法：');
console.log('  1. 找到一个待送达的订单项（shipped=true, delivered=false）');
console.log('  2. 连续两次调用送达接口：GET /api/order/ordersToDeliver/markAsDelivered?orderId=xxx');
console.log('  3. 第一次应该返回成功，第二次应该返回"Order is already delivered"或类似错误');

// 场景4：历史状态保留测试
console.log('\n【场景4：历史状态保留测试】');
console.log('初始状态：pending=false, shipped=true, delivered=false');
console.log('预期行为：送达后，shipped=true, delivered=true（shipped不改为false）');
console.log('修复前问题：原代码在送达时会将shipped改为false，无法追溯订单是否经历过发货状态');
console.log('修复后保障：送达时只设置delivered=true，保留shipped=true的状态');
console.log('验证方法：');
console.log('  1. 找到一个待送达的订单项（shipped=true, delivered=false）');
console.log('  2. 调用送达接口：GET /api/order/ordersToDeliver/markAsDelivered?orderId=xxx');
console.log('  3. 检查数据库，确认该订单项的orderState为：shipped=true, delivered=true');

console.log('\n--- 并发测试说明 ---');
console.log('对于真正的并发测试，可以使用以下方法：');
console.log('1. 使用Postman的Runner或类似工具，同时发送多个相同的请求');
console.log('2. 使用Node.js编写并发脚本，使用Promise.all同时发送多个请求');
console.log('3. 验证只有一个请求成功，其他请求都失败');

console.log('\n--- 示例并发测试代码 ---');
console.log(`
const axios = require('axios');

// 假设已经获取了有效的JWT token
const token = 'your-jwt-token-here';
const orderId = 'test-order-item-id';

// 同时发送5个发货请求
const requests = Array(5).fill(null).map(() => 
  axios.get('/api/order/ordersToShip/markAsShipped', {
    params: { orderId },
    headers: { 'Authorization': \`Bearer \${token}\` }
  })
);

Promise.allSettled(requests).then(results => {
  const successCount = results.filter(r => r.status === 'fulfilled').length;
  const failureCount = results.filter(r => r.status === 'rejected').length;
  
  console.log(\`成功请求数: \${successCount}\`);
  console.log(\`失败请求数: \${failureCount}\`);
  console.log(\`预期结果: 成功=1, 失败=4 (只有第一个请求成功)\`);
});
`);

console.log('\n=== 验证完成 ===');
console.log('请按照上述场景手动或使用自动化工具进行验证。');
console.log('修复后的代码应该能够正确处理所有这些场景。\n');

// 简单的数据库连接测试（可选）
async function testDatabaseConnection() {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('✅ 数据库连接成功');
    console.log('⚠️  注意：此脚本未执行实际的数据库操作，仅用于说明验证方法');
    await mongoose.disconnect();
  } catch (err) {
    console.log('⚠️  数据库连接失败，跳过数据库测试');
    console.log('错误信息:', err.message);
  }
}

// 如果提供了数据库连接字符串，尝试连接
if (process.env.DB_URI) {
  testDatabaseConnection();
}
