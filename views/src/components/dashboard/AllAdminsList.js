import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "../../redux/actions/permissions-actions/fetchAllUsers";
import { changeAdminPermission } from "../../redux/actions/permissions-actions/adminPermissionActions";
import { Container, Table, Col, Row } from "react-bootstrap";
import { toast, Slide } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import DashboardSidebar from "./DashboardSidebar";
import DashboardSpinner from "./DashboardSpinner";

function AllAdminsList() {
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

  let allAdmins = allUsers.filter(user => user.isAdmin === true);

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
        <Col>
          <h1 className='dashboard-headline'>Admins</h1>
          {loading && <DashboardSpinner />}
          {!loading && (
            <Table striped bordered hover variant='dark'>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Admin</th>
                </tr>
              </thead>
              <tbody>
                {emptyMessage}
                {allAdmins &&
                  allAdmins.map(user => {
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
                          {user.isAdmin && (
                            <FontAwesomeIcon className='ml-2' icon={faCheck} />
                          )}
                        </td>
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

export default AllAdminsList;
