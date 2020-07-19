import React from "react";
import { Route } from "react-router";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";

// I used material UI here cause i found that its pagination component is
// the best thing to use for my needs
const MainPagination = props => {
  let { path, pagesCount } = props;

  return (
    <div className='general-pagination'>
      <Route>
        {({ location }) => {
          const query = new URLSearchParams(location.search);
          const page = parseInt(query.get("page") || "1", 10);

          return (
            <Pagination
              variant='outlined'
              page={page}
              count={pagesCount}
              renderItem={item => (
                <PaginationItem
                  component={Link}
                  to={`${path + item.page === 1 ? "" : `?page=${item.page}`}`}
                  {...item}
                />
              )}
            />
          );
        }}
      </Route>
    </div>
  );
};

export default MainPagination;
