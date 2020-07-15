import React from "react";
import { Link } from "react-router-dom";

function SettingsSidebar() {
  return (
    <ul className='settings-sidebar'>
      <li>
        <i class='fa fa-user' aria-hidden='true'></i>
        <Link to='/settings'>Account Settings</Link>
      </li>
      <li>
        <i class='fa fa-folder' aria-hidden='true'></i>
        <Link to='/my_orders'>My Orders</Link>
      </li>
      <li>
        <i class='fa fa-address-book-o' aria-hidden='true' />
        <Link to='/my_addresses'>Shipping Addresses</Link>
      </li>
      <li>
        <i class='fa fa-heart' aria-hidden='true' />
        <Link to='/wish_list'>Wish List</Link>
      </li>
    </ul>
  );
}

export default SettingsSidebar;
