import React from "react";

const Search = () => {
  return (
    <div className='col-lg-6  col-sm-4 navbar-search'>
      <div className='input-group'>
        <input type='text' className='form-control' placeholder='Search ......' />
        <div className='input-group-append'>
          <span className='input-group-text'>
            <i className='fa fa-search'></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Search;
