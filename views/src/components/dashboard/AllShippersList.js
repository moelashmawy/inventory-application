import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllShippers } from "../../redux/actions/shippers-actions/fetchAllShippers";
import { changeShipperPermission } from "../../redux/actions/permissions-actions/shipperPermissionActions";
import { Container, Table, Spinner, Col, Row } from "react-bootstrap";
import { toast, Slide } from "react-toastify";
import EditShipperForm from "./EditShipperForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import DashboardSidebar from "./DashboardSidebar";

function AllShippersList() {
  const { shippers, loading } = useSelector(state => state.shippersss);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllShippers());
  }, [dispatch]);

  let emptyMessage;
  if (!loading && shippers.length === 0) {
    emptyMessage = (
      <tr>
        <td>There are no shippers yet</td>
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
    <Container fluid>
      <Row>
        <Col md='3'>
          <DashboardSidebar />
        </Col>
        <Col>
          {" "}
          <Table striped bordered hover variant='dark'>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Disable</th>
                <th>Company</th>
                <th>Area</th>
                <th>Shipper info</th>
              </tr>
            </thead>
            <tbody>
              {emptyMessage}
              {loading && (
                <tr>
                  <td colSpan='6'>
                    <Spinner animation='border' /> loading...{" "}
                  </td>
                </tr>
              )}
              {shippers &&
                shippers.map(shipper => {
                  return (
                    <tr key={shipper._id}>
                      <td>{shipper.user.username}</td>

                      <td>{shipper.user.email}</td>

                      <td>
                        <select
                          onChange={e => {
                            giveShipperPermission(shipper.user._id, e.target.value);
                          }}>
                          <option value=''>Change</option>
                          <option value='false'>Disable</option>
                          <option value='true'>Enable</option>
                        </select>
                        {shipper.isActiveShipper && (
                          <FontAwesomeIcon className='ml-2' icon={faCheck} />
                        )}
                      </td>

                      <td>{shipper.company && <span>{shipper.company}</span>}</td>

                      <td>{shipper.area && <span>{shipper.area}</span>}</td>

                      <td>{<EditShipperForm shipper={shipper} />}</td>
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

export default AllShippersList;
