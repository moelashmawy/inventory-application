import React from "react";

const OrderProgress = props => {
  let { pending, shipped, delivered, returned } = props.state;

  let activePending;
  let activeShipped;
  let activeDelivered;
  let activeReturned;

  if (pending) activePending = "active";
  if (shipped) activeShipped = "active";
  if (delivered) activeDelivered = "active";
  if (returned) activeReturned = "active";

  return (
    <div class='container1'>
      <ul class='progressbar'>
        <li class={activePending}>
          <i class='fa fa-hourglass-end' aria-hidden='true'></i>
        </li>
        <li class={activeShipped}>
          <i class='fa fa-truck' aria-hidden='true'></i>
        </li>
        <li class={activeDelivered}>
          <i class='fa fa-home' aria-hidden='true'></i>
        </li>
        <li class={activeReturned}>
          <i class='fa fa-undo' aria-hidden='true'></i>
        </li>
      </ul>
    </div>
  );

  /* let orderState;
  if (delivered) {
    orderState = (
      <div class='container1'>
        <ul class='progressbar'>
          <li class='active'>
            <i class='fa fa-hourglass-end' aria-hidden='true'></i>
          </li>
          <li class='active'>
            <i class='fa fa-truck' aria-hidden='true'></i>
          </li>
          <li class='active'>
            <i class='fa fa-home' aria-hidden='true'></i>
          </li>
          <li>
            <i class='fa fa-undo' aria-hidden='true'></i>
          </li>
        </ul>
      </div>
    );
  }
  if (shipped && !delivered) {
    orderState = (
      <div class='container1'>
        <ul class='progressbar'>
          <li class='active'>
            <i class='fa fa-hourglass-end' aria-hidden='true'></i>
          </li>
          <li class='active'>
            <i class='fa fa-truck' aria-hidden='true'></i>
          </li>
          <li>
            <i class='fa fa-home' aria-hidden='true'></i>
          </li>
          <li>
            <i class='fa fa-undo' aria-hidden='true'></i>
          </li>
        </ul>
      </div>
    );
  }

  if (pending && !shipped && !delivered) {
    orderState = (
      <div class='container1'>
        <ul class='progressbar'>
          <li class='active'>
            <i class='fa fa-hourglass-end' aria-hidden='true'></i>
          </li>
          <li>
            <i class='fa fa-truck' aria-hidden='true'></i>
          </li>
          <li>
            <i class='fa fa-home' aria-hidden='true'></i>
          </li>
          <li>
            <i class='fa fa-undo' aria-hidden='true'></i>
          </li>
        </ul>
      </div>
    );
  } */
};

export default OrderProgress;
