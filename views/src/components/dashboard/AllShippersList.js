import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllShippers } from "../../redux/actions/shippers-actions/fetchAllShippers";
import { changeShipperPermission } from "../../redux/actions/permissions-actions/shipperPermissionActions";
import { Container, Table, Col, Row } from "react-bootstrap";
import { toast, Slide } from "react-toastify";
import EditShipperForm from "./EditShipperForm";
import DashboardSidebar from "./DashboardSidebar";
import DashboardSpinner from "./DashboardSpinner";

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
    <Container fluid className='users-permissions'>
      <Row>
        <Col md='3'>
          <DashboardSidebar />
        </Col>
        <Col>
          <h1 className='dashboard-headline'>Shippers</h1>
          {loading && <DashboardSpinner />}
          {!loading && (
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

                {shippers &&
                  shippers.map(shipper => {
                    return (
                      <tr key={shipper._id}>
                        <td>{shipper.user.username}</td>

                        <td>{shipper.user.email}</td>

                        <td>
                          <select
                            className='custom-select'
                            onChange={e => {
                              giveShipperPermission(shipper.user._id, e.target.value);
                            }}>
                            <option value=''>Change</option>
                            <option value='false'>Disable</option>
                            <option value='true'>Enable</option>
                          </select>
                          {shipper.isActiveShipper && (
                            <i class='fa fa-truck' aria-hidden='true'></i>
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
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default AllShippersList;
