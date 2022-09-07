import React from "react"
import {
  Button,
  Card,
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

import GLOBAL from '../../../GLOBAL'

import { Loading, Select, } from "../../../components/heaven-strap"


import { UserModel, } from "../../../models"
import md5 from "md5";


const user_model = new UserModel()

class Insert extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
      user_zipcode: '',

    }
  }

  componentDidMount() {
    this._fetchData()
  }

  _fetchData = async () => {
    this.setState({
      loading: false,
    })
  }

  _handleSubmit = (event) => {
    event.preventDefault()

    this._checkSubmit() && this.setState({ loading: true, }, async () => {
      const res = await user_model.insertUser({
        firstname: this.state.firstname.trim(),
        lastname: this.state.lastname.trim(),
        phone: this.state.phone.trim(),
        address: this.state.address.trim(),
        username: this.state.username.trim(),
        role: this.state.role.trim(),
        lineUserId: this.state.lineUserId.trim(),
        password: md5(this.state.password.trim()),
      })
      console.log(res)
      if (res.code === 200) {

        Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
        this.props.history.push(`/setting/user`)
      } else {
        this.setState({
          loading: false,
        }, () => {
          Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ ! " + res.message, icon: "error", })
        })
      }
    })
  }

  _checkSubmit() {
    const password = this.state.password.trim()

    // if (this.state.username_validate.status !== 'VALID') {
    //   Swal.fire({ text: this.state.username_validate.text, icon: "warning", })
    //   return false
    // } else 
    if (!this.state.role) {
      Swal.fire({ text: "ระบุตำแหน่ง", icon: "warning", })
      return false
    }
    else if (password.length < 6 || password.length > 20) {
      Swal.fire({ text: "รหัสผ่านควรมีขนาด 6-20 ตัวอักษร / Password should be 6-20 characters", icon: "warning", })
      return false
    } else {
      return true
    }
  }

  // _checkCode = async () => {
  //   const code = this.state.user_code.replace(/\//g, "-").trim()

  //   if (code.length) {
  //     if (this.state.code_validate.value !== code) {
  //       const duplicate = await user_model.getUserByCode({ user_code: code })

  //       this.setState({
  //         user_code: code,
  //         code_validate: duplicate.data.length ? {
  //           value: code, status: 'INVALID', class: 'is-invalid', text: 'This code already exists.',
  //         } : {
  //           value: code, status: 'VALID', class: 'is-valid', text: '',
  //         }
  //       })
  //     }
  //   } else {
  //     this.setState({ code_validate: { value: code, status: '', class: '', text: '', } })
  //   }
  // }

  // _checkUsername = async () => {
  //   const username = this.state.username.trim()

  //   if (this.state.username_validate.value !== username) {
  //     if (username.length === 0) {
  //       this.setState({ username_validate: { value: username, status: "INVALID", class: '', text: "Please input Username", }, })
  //     } else if (username.length < 5 || username.length > 20) {
  //       this.setState({ username_validate: { value: username, status: "INVALID", class: "is-invalid", text: "Username should be 5-20 characters", }, })
  //     } else {
  //       const duplicate = await user_model.checkUsernameBy({ username: username, })

  //       this.setState({
  //         username_validate: duplicate.data.length ? {
  //           value: username, status: 'INVALID', class: 'is-invalid', text: 'This user already exists.',
  //         } : {
  //           value: username, status: 'VALID', class: 'is-valid', text: '',
  //         }
  //       })
  //     }
  //   }
  // }


  render() {

    const role_options = [
      { value: "admin", label: "admin" },
      { value: "superadmin", label: "superadmin" },
      { value: "user", label: "user" },

    ];



    return (
      <div>
        <Loading show={this.state.loading} />
        <Card>
          <CardHeader style={{ backgroundColor: '#634ae2' }}>
            <h3 className="mb-0 text-white ">เพิ่มผู้ใช้ / Add User</h3>
          </CardHeader>
          <Form onSubmit={this._handleSubmit}>
            <CardBody>
              <Row>
                <Col md={12}>
                  <Row>
                    <Col md={3}>
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
                    <Col md={3}>
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
                    <Col md={3}>
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
                    <Col md={3}>
                      <FormGroup>
                        <label>Username <font color="#F00"><b>*</b></font></label>
                        <Input
                          type="text"
                          value={this.state.username}
                          className={this.state.username_validate.class}
                          onChange={(e) => this.setState({ username: e.target.value })}
                          onBlur={this._checkUsername}
                          required
                        />
                        <p className="text-muted">Example : admin.</p>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
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
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <label>Line UserID <font color="#F00"><b>*</b></font></label>
                        <Input
                          type="text"
                          value={this.state.lineUserId}
                          onChange={(e) => this.setState({ lineUserId: e.target.value })}
                          required
                        />
                      </FormGroup>
                    </Col>
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
                    <Col md={4}>
                      <FormGroup>
                        <label>ตำแหน่ง <font color="#F00"><b>*</b></font></label>
                        <Select
                          options={role_options}
                          value={this.state.role}
                          onChange={(e) => this.setState({ role: e })}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
            <CardFooter className="text-right">
              <Button type="submit" color="success">Save</Button>
              <Link to={`/setting/user`}><Button type="button">Back</Button></Link>
            </CardFooter>
          </Form>
        </Card>
      </div>
    )
  }
}

export default Insert