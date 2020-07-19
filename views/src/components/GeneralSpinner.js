import React from "react";
import Loader from "react-loader-spinner";

const GeneralSpinner = () => {
  return (
    <Loader
      type='Bars'
      color='#123'
      height={100}
      width={100}
      className='general-spinner'
    />
  );
};

export default GeneralSpinner;
