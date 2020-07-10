import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "../../redux/actions/permissions-actions/fetchAllUsers";
import { changeShipperPermission } from "../../redux/actions/permissions-actions/shipperPermissionActions";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import { toast, Slide } from "react-toastify";

function AllAdminsList() {
  const [isShipper, setIsShipper] = useState(false);

  const { allUsers, loading } = useSelector(state => state.permissionsss);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  let emptyMessage;
  if (!loading && allUsers.length === 0) {
    emptyMessage = (
      <tr>
        <td>There are no orders yet</td>
      </tr>
    );
  }

  // handle change shipper permission
  const giveShipperPermission = (shipperId, isShipper) => {
    dispatch(changeShipperPermission(shipperId, isShipper))
      .then(res => {
        toast.success(res, {
          position: toast.POSITION.BOTTOM_LEFT,
          transition: Slide
        });
      })
      .catch(err => {
        toast.error(err, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: false
        });
      });
  };

  return (
    <Container>
      <Table striped bordered hover variant='dark'>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Shipper</th>
            <th>Restrict</th>
          </tr>
        </thead>
        <tbody>
          {emptyMessage}
          {loading && (
            <tr>
              <td colSpan='3'>
                <Spinner animation='border' /> loading...{" "}
              </td>
            </tr>
          )}
          {allUsers &&
            allUsers.map(user => {
              return (
                <tr key={user._id}>
                  <td>{user.username}</td>

                  <td>{user.email}</td>

                  <td>
                    <select
                      value={user.isAdmin}
                      onChange={e => {
                        console.log(e.target.value);
                      }}>
                      <option value='false'>No</option>
                      <option value='true'>Yes</option>
                    </select>
                  </td>

                  <td>
                    <select
                      //value={user.isShipper}
                      onChange={e => {
                        setIsShipper(e.target.value);
                        giveShipperPermission(user._id, e.target.value);
                      }}>
                      <option value=''>Change</option>
                      <option value='false'>Disable</option>
                      <option value='true'>Enable</option>
                    </select>
                    {user.isShipper && <span>Yes</span>}
                  </td>

                  <td>
                    <Button variant='danger'>Restrict</Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Container>
  );
}

export default AllAdminsList;
