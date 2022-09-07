import React from 'react'
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap'
// import { Card } from 'antd'

import { AuthConsumer, } from '../../../contexts/authContext'

const Login = () => {
  const [state, setState] = React.useState({
    user_username: '',
    user_password: '',
  })

  return (
    <AuthConsumer>
      {({ _handleLogin }) => (
        <div className="c-app c-default-layout flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md={6}>
                <CardGroup>
                  <Card className="p-4 w-100">
                    <CardBody>
                      <Form onSubmit={(e) => { e.preventDefault(); _handleLogin(state); }}>
                        {/* <img src={"https://sv1.picz.in.th/images/2022/02/18/rwcKO0.png"} className="my-2" alt="logo" /> */}
                        <h1>เข้าสู่ระบบ</h1>
                        <p className="text-muted">Sign In to your account</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-user" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="Username"
                            value={state.user_username}
                            onChange={(e) => setState({ ...state, user_username: e.target.value })}
                            autoComplete="username"
                            required
                          />
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-lock" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="password"
                            placeholder="Password"
                            value={state.user_password}
                            onChange={(e) => setState({ ...state, user_password: e.target.value })}
                            autoComplete="current-password"
                            required
                          />
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button color="primary" className="px-4">Login</Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </AuthConsumer>
  )
}

export default Login