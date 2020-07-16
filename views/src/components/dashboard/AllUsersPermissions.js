import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "../../redux/actions/permissions-actions/fetchAllUsers";
import { changeShipperPermission } from "../../redux/actions/permissions-actions/shipperPermissionActions";
import { changeAdminPermission } from "../../redux/actions/permissions-actions/adminPermissionActions";
import { restrictUserPermission } from "../../redux/actions/permissions-actions/restrictUserActions";
import { Container, Table, Button, Col, Row } from "react-bootstrap";
import { toast, Slide } from "react-toastify";
import DashboardSidebar from "./DashboardSidebar";
import DashboardSpinner from "./DashboardSpinner";

function AllUsersPermissions() {
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

  const givePermission = permissionFunction => {
    dispatch(permissionFunction)
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
    <Container fluid className='users-permissions'>
      <Row>
        <Col md='3'>
          <DashboardSidebar />
        </Col>
        <Col sm='12' md='9'>
          <h1 className='dashboard-headline'>Permissions</h1>
          {loading && <DashboardSpinner />}
          {!loading && (
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

                {allUsers &&
                  allUsers.map(user => {
                    return (
                      <tr key={user._id}>
                        <td>{user.username}</td>

                        <td>{user.email}</td>

                        <td>
                          <select
                            className='custom-select'
                            onChange={e => {
                              givePermission(
                                changeAdminPermission(user._id, e.target.value)
                              );
                            }}>
                            <option disabled selected value=''>
                              Change
                            </option>
                            <option value='false'>Disable</option>
                            <option value='true'>Enable</option>
                          </select>
                          {user.isAdmin && <i class='fa fa-check' aria-hidden='true'></i>}
                        </td>

                        <td>
                          <select
                            className='custom-select'
                            onChange={e => {
                              givePermission(
                                changeShipperPermission(user._id, e.target.value)
                              );
                            }}>
                            <option disabled selected value=''>
                              Change
                            </option>
                            <option value='false'>Disable</option>
                            <option value='true'>Enable</option>
                          </select>
                          {user.isShipper && (
                            <i class='fa fa-truck' aria-hidden='true'></i>
                          )}
                        </td>

                        {!user.isRestricted && (
                          <td>
                            <Button
                              onClick={() => {
                                givePermission(restrictUserPermission(user._id, "true"));
                              }}
                              variant='secondary'>
                              Restrict
                            </Button>
                          </td>
                        )}
                        {user.isRestricted && (
                          <td>
                            <Button
                              variant='success'
                              onClick={() => {
                                givePermission(restrictUserPermission(user._id, "false"));
                              }}>
                              Undo
                            </Button>
                            <i class='fa fa-ban' aria-hidden='true'></i>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default AllUsersPermissions;
