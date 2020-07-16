import React from "react";
import Loader from "react-loader-spinner";

const DashboardSpinner = () => {
  return (
    <Loader
      type='Circles'
      color='#123'
      height={100}
      width={100}
      className='dashboard-spinner'
    />
  );
};

export default DashboardSpinner;
