import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "../../redux/actions/permissions-actions/fetchAllUsers";
import { changeShipperPermission } from "../../redux/actions/permissions-actions/shipperPermissionActions";
import { changeAdminPermission } from "../../redux/actions/permissions-actions/adminPermissionActions";
import { restrictUserPermission } from "../../redux/actions/permissions-actions/restrictUserActions";
import { Container, Table, Spinner, Button, Col, Row } from "react-bootstrap";
import { toast, Slide } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DashboardSidebar from "./DashboardSidebar";
import { faCheck, faSkullCrossbones } from "@fortawesome/free-solid-svg-icons";

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
    <Container fluid>
      <Row>
        <Col md='3'>
          <DashboardSidebar />
        </Col>
        <Col>
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
                          //value={user.isShipper}
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
                        {user.isAdmin && (
                          <FontAwesomeIcon className='ml-2' icon={faCheck} />
                        )}
                      </td>

                      <td>
                        <select
                          //value={user.isShipper}
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
                          <FontAwesomeIcon className='ml-2' icon={faCheck} />
                        )}
                      </td>

                      {!user.isRestricted && (
                        <td>
                          <Button
                            onClick={() => {
                              givePermission(restrictUserPermission(user._id, "true"));
                            }}
                            variant='danger'>
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
                            Un Restrict
                          </Button>
                          <FontAwesomeIcon className='ml-2' icon={faSkullCrossbones} />
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default AllUsersPermissions;
