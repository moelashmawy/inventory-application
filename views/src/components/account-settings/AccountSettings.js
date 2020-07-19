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
    <Container fluid className='account-settings'>
      <Row>
        <Col lg={4}>
          <SettingsSidebar />
        </Col>
        {user && (
          <Col lg={8}>
            <Row className='header'>
              <Col>
                <h1>Account Settings</h1>
              </Col>
              <Col>
                <Link to='/settings/edit_account'>
                  <Button variant='secondary'>Edit</Button>
                </Link>
              </Col>
            </Row>
            <Row className='account-iformation'>
              <h3>Account Information</h3>
              <p>
                Name:{" "}
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </p>
              <p>
                Email: <span>{user.email}</span>
              </p>
              <p>Password: ********</p>
            </Row>
            <Row className='personal-iformation'>
              <h3>Personal Information</h3>
              <p>
                Gender: <span>{gender}</span>
              </p>
              <p>
                Nationality: <span>{nationality}</span>
              </p>
              <p>
                Birthdate: <span>{birthDate}</span>
              </p>
            </Row>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default AccountSettings;
