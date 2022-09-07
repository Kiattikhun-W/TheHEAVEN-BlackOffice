import React from "react"
import {

  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Row,
} from "reactstrap"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import {
  Button,
  Card,
} from 'antd'

import GLOBAL from '../../../GLOBAL'

import { Loading, Select, } from "../../../components/heaven-strap"
import CardUnit from "./components/CardUnit"

import { UserModel, UnitModel, UnitMemberModel } from "../../../models"

const user_model = new UserModel()
const unit_user_model = new UnitMemberModel()

class Update extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: 0,
      loading: true,
      username_validate: {
        value: '',
        status: '',
        class: '',
        text: '',
      },
      lineUserId: '',
      firstname: '',
      lastname: '',
      phone: '',
      user_email: '',
      username: '',
      password: '',
      address: '',
      role: '',
      lineUnitID: '',
      unit_users: [],

    }
  }

  componentDidMount() {
    this._fetchData()
  }

  _fetchData = async () => {
    const { code } = this.props.match.params
    const idproperty = Number(localStorage.getItem("propertyid"));

    const user = await user_model.getUserByCode({ id: code })
    const unit_users = await unit_user_model.getUnitMemberBy({
      user: code,
      propertyId: idproperty
    })
    console.log("unit_users", unit_users)
    if (user.code !== 200) {
      Swal.fire({ title: "ข้อผิดพลาด !", text: 'ไม่สามารถโหลดข้อมูล', icon: "error", })
      this.props.history.push(`/properties/${idproperty}/member`)
    } else if (user.result.length === 0) {
      Swal.fire({ title: "ไม่พบรายการนี้ในระบบ !", text: code, icon: "warning", })
      this.props.history.push(`/properties/${idproperty}/member`)
    } else {
      const {
        id,
        role,
        firstname,
        lastname,
        username,
        password,
        lineUserId,
        phone,
        lineUnitID,

      } = user.result[0]



      this.setState({
        loading: false,
        id,
        role,
        firstname,
        lastname,
        username,
        password,
        lineUserId,
        phone,
        lineUnitID,
        unit_users: unit_users.result[0]
      })
    }
  }

  _handleSubmit = (event) => {
    event.preventDefault()
    const idproperty = Number(localStorage.getItem("propertyid"));

    this._checkSubmit() && this.setState({ loading: true, }, async () => {
      const res = await user_model.updateUserBy(Number(this.state.id), {
        firstname: this.state.firstname.trim(),
        lastname: this.state.lastname.trim(),
        phone: this.state.phone.trim(),
        address: this.state.address.trim(),
        username: this.state.username.trim(),
        role: this.state.role.trim(),
        lineUserId: this.state.lineUserId.trim(),
      })

      if (res.code === 200) {
        Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
        this.props.history.push(`/properties/${idproperty}/member`)
      } else if (res.message === 'Username นี้มีผู้ใช้แล้ว') {
        this.setState({
          loading: false,
        }, () => {
          Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "Username นี้มีผู้ใช้แล้ว !", icon: "error", })
        })
      } else {
        this.setState({
          loading: false,
        }, () => {
          Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
        })
      }
    })
  }

  _checkSubmit() {
    // const password = this.state.password.trim()

    //  if (password.length < 6 || password.length > 20) {
    //   Swal.fire({ text: "รหัสผ่านควรมีขนาด 6-20 ตัวอักษร / Password should be 6-20 characters", icon: "warning", })
    //   return false
    // } else {
    return true
    // }
  }

  _checkUsername = async () => {
    const user_code = this.state.user_code.trim()
    const username = this.state.user_username.trim()

    if (this.state.username_validate.value !== username) {
      if (username.length === 0) {
        this.setState({ username_validate: { value: username, status: "INVALID", class: '', text: "Please input Username", }, })
      } else if (username.length < 5 || username.length > 20) {
        this.setState({ username_validate: { value: username, status: "INVALID", class: "is-invalid", text: "Username should be 5-20 characters", }, })
      } else {
        const duplicate = await user_model.checkUsernameBy({ user_username: username, user_code: user_code, })

        this.setState({
          username_validate: duplicate.data.length ? {
            value: username, status: 'INVALID', class: 'is-invalid', text: 'This user already exists.',
          } : {
            value: username, status: 'VALID', class: 'is-valid', text: '',
          }
        })
      }
    }
  }


  render() {

    const role_options = [
      { value: "admin", label: "admin" },
      { value: "superadmin", label: "superadmin" },
      { value: "user", label: "user" },

    ];
    const idproperty = Number(localStorage.getItem("propertyid"));



    return (
      <div>
        <Loading show={this.state.loading} />
        <Row>
          <Col md={8}>
            <Card className="cardTable">
              <CardHeader style={{ backgroundColor: '#634ae2' }}>
                <h3 className="mb-0 text-white ">แก้ไขข้อมูลลูกบ้าน</h3>
              </CardHeader>
              <Form onSubmit={this._handleSubmit}>
                <CardBody>
                  <Row>
                    <Col md={12}>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <label>ชื่อ <font color="#F00"><b>*</b></font></label>
                            <Input
                              type="text"
                              value={this.state.firstname}
                              onChange={(e) => this.setState({ firstname: e.target.value })}
                              required
                            />
                            <p className="text-muted">Example : วินัย.</p>
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <label>นามสกุล <font color="#F00"><b>*</b></font></label>
                            <Input
                              type="text"
                              value={this.state.lastname}
                              onChange={(e) => this.setState({ lastname: e.target.value })}
                              required
                            />
                            <p className="text-muted">Example : ชาญชัย.</p>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <label>โทรศัพท์ </label>
                            <Input
                              type="text"
                              value={this.state.phone}
                              onChange={(e) => this.setState({ phone: e.target.value })}
                            />
                            <p className="text-muted">Example : 0610243003.</p>
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <label>Username <font color="#F00"><b>*</b></font></label>
                            <Input
                              type="text"
                              value={this.state.username}
                              // className={this.state.username_validate.class}
                              onChange={(e) => this.setState({ username: e.target.value })}
                              // onBlur={this._checkUsername}
                              required
                            />
                            <p className="text-muted">Example : admin.</p>
                          </FormGroup>
                        </Col>
                        {/* <Col md={3}>
                      <FormGroup>
                        <label>Password <font color="#F00"><b>*</b></font></label>
                        <Input
                          type="password"
                          value={this.state.password}
                          onChange={(e) => this.setState({ password: e.target.value })}
                          required
                        />
                        <p className="text-muted">Example : admin654d.</p>
                      </FormGroup>
                    </Col> */}
                        {/* <Col md={3}>
                          <FormGroup>
                            <label>Line UserID <font color="#F00"><b>*</b></font></label>
                            <Input
                              type="text"
                              value={this.state.lineUserId}
                              onChange={(e) => this.setState({ lineUserId: e.target.value })}
                              required
                            />
                          </FormGroup>
                        </Col> */}
                        {/* <Col md={3}>
                      <FormGroup>
                        <label>lineUnit<font color="#F00"><b>*</b></font></label>
                        <Input
                          type="text"
                          value={this.state.lineUserId}
                          onChange={(e) => this.setState({ lineUserId: e.target.value })}
                          required
                        />
                        <p className="text-muted">Example : admin654d.</p>
                      </FormGroup>
                    </Col> */}
                      </Row>
                      <Row>
                        {/* <Col md={8}>
                      <FormGroup>
                        <label>ที่อยู่ <font color="#F00"><b>*</b></font></label>
                        <Input
                          type="textarea"
                          row={3}
                          value={this.state.address}
                          onChange={(e) => this.setState({ address: e.target.value })}
                        />
                        <p className="text-muted">Example : 271/55.</p>
                      </FormGroup>
                    </Col>   */}
                        {/* <Col md={4}>
                          <FormGroup>
                            <label>ตำแหน่ง <font color="#F00"><b>*</b></font></label>
                            <Select
                              options={role_options}
                              value={this.state.role}
                              onChange={(e) => this.setState({ role: e })}
                            />
                          </FormGroup>
                        </Col> */}
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter className="text-right">
                  {/* <Button type="submit" color="success">Save</Button>
                  <Link to={`/properties/${idproperty}/member`}><Button type="button">Back</Button></Link> */}
                  <Button
                    type="primary"
                    className="mr-2"
                    onClick={this._handleSubmit}
                    size="large"
                  >
                    Save
                  </Button>
                  <Link to={`/properties/${idproperty}/member`}>
                    <Button size="large">Back</Button>
                  </Link>
                </CardFooter>
              </Form>
            </Card>
          </Col>
          <Col md={4}>
            <CardUnit title={'ยูนิต'} data={this.state.unit_users.item} />
          </Col>
        </Row>

      </div>
    )
  }
}

export default Update