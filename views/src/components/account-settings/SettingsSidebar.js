import React from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

function SettingsSidebar() {
  return (
    <Table striped bordered hover>
      <tbody>
        <tr>
          <Link to='/settings'>Account Settings</Link>
        </tr>
        <tr>
          <Link to='/my_orders'>My Orders</Link>
        </tr>
        <tr>
          <Link to='/my_addresses'>Shipping Addresses</Link>
        </tr>
        <tr>
          <Link to='/wish_list'>Wish List</Link>
        </tr>
      </tbody>
    </Table>
  );
}

export default SettingsSidebar;
