import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SettingsSidebar from "./SettingsSidebar";

function AccountSettings() {
  const { user } = useSelector(state => state.userrr);

  let gender;
  if (user && user.gender) {
    gender = user.gender;
  } else {
    gender = "-";
  }

  let nationality;
  if (user && user.nationality) {
    nationality = user.nationality;
  } else {
    nationality = "-";
  }

  let birthDate;
  if (user && user.birthDate) {
    birthDate = user.birthDate;
  } else {
    birthDate = "-";
  }
  return (
    <Container>
      <Row>
        <Col lg={4}>
          <SettingsSidebar />
        </Col>
        {user && (
          <Col lg={8}>
            <Row>
              <Col>
                <h3>Account Settings</h3>
              </Col>
              <Col>
                <Link to='/settings/edit_account'>
                  <Button>Edit</Button>
                </Link>
              </Col>
            </Row>
            <div>
              <h3>Account Information</h3>
              <h5>
                Name: {user.firstName} {user.lastName}
              </h5>
              <h5>Email: {user.email}</h5>
              <h5>Password: ********</h5>
            </div>
            <div>
              <h3>Personal Information</h3>
              <h5>Gender: {gender}</h5>
              <h5>Nationality: {nationality}</h5>
              <h5>Birthdate: {birthDate}</h5>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default AccountSettings;
