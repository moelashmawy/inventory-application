import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardSidebar = props => {
  const { auth } = useSelector(state => state.userrr);

  return (
    <ul className='dashboard-settings'>
      {/* Only show admin dashboard to admins */}
      {auth.isAdmin && (
        <li className='category'>
          <i class='fa fa-user' aria-hidden='true'></i>
          <h1>Admin</h1>
          <ul>
            <li>
              <Link to='/addCategory'>Add Category</Link>
            </li>
            <li>
              <Link to='/editCategories'>Edit Categories</Link>
            </li>
            <li>
              <Link to='/permissions'>Users permissions</Link>
            </li>
            <li>
              <Link to='/dashboard/admin/admins_permissions'>All Admins</Link>
            </li>
            <li>
              <Link to='/dashboard/admin/shippers_permissions'>All Shippers</Link>
            </li>
          </ul>
        </li>
      )}

      {/* Only show sellers dashboard to admins */}

      {auth.isSeller && (
        <li className='category'>
          <i class='fa fa-exchange' aria-hidden='true'></i>
          <h1>Seller</h1>
          <ul>
            <li>
              <Link to='/addProduct'>Add Product</Link>
            </li>
            <li>
              <Link to='/editProducts'>Edit Products</Link>
            </li>
            <li>
              <Link to='/dashboard/seller/orders_to_ship'>
                Orders to ship
                <br />
              </Link>
            </li>
            <li>
              <Link to='/dashboard/seller/shipped_orders'>Shipped Orders</Link>
            </li>
          </ul>
        </li>
      )}

      <li className='category'>
        <i class='fa fa-truck' aria-hidden='true'></i>
        <h1>Shipper</h1>
        <ul>
          <li>
            <Link to='/dashboard/shipper/orders_to_deliver'>
              Orders to Deliver
              <br />
            </Link>
          </li>
          <li>
            <Link to='/dashboard/shipper/delivered_orders'>Delivered Orders</Link>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default DashboardSidebar;
