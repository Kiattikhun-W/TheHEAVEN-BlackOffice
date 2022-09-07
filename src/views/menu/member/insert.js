import React from 'react'
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
} from 'reactstrap'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'


import { Loading, Select } from '../../../components/heaven-strap'

import { MemberModel } from '../../../models'

const member_model = new MemberModel()

class Insert extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            code_validate: {
                value: '',
                status: '',
                class: '',
                text: '',
            },
            member_name: '',
            member_lastname: '',
            member_code: '',
            members: [],
        }
    }

    componentDidMount() {
        this._fetchData()
    }

    _fetchData = async () => {
        const now = new Date()
        const last_code = await member_model.generateMemberLastCode({
            code: `MEM${now.getFullYear()}`,
            digit: 3,
        })

        this.setState({
            loading: false,
            code_validate: { value: last_code.data, status: 'VALID', class: '', text: '', },
            member_code: last_code.data,
        })
    }

    _handleSubmit = (event) => {
        const idproperty = localStorage.getItem("propertyid");
        event.preventDefault()


        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await member_model.insertMember({
                member_code: this.state.member_code.trim(),
                member_name: this.state.member_name.trim(),
                member_lastname: this.state.member_lastname.trim(),
                properties_code: idproperty,

            })

            if (res.require) {
                Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                this.props.history.push(`/properties/${idproperty}/member`)
            } else {
                this.setState({ loading: false, }, () => {
                    Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                })
            }
        })
    }

    _checkSubmit() {
        if (this.state.code_validate.status !== 'VALID') {
            Swal.fire({ text: this.state.code_validate.text, icon: "warning", })
            return false
        } else {
            return true
        }
    }

    _checkCode = async () => {
        const code = this.state.member_code.replace(/\//g, "-").trim()

        if (code.length) {
            if (this.state.code_validate.value !== code) {
                const duplicate = await member_model.getMemberByCode({ member_code: code })

                this.setState({
                    member_code: code,
                    code_validate: duplicate.data.length ? {
                        value: code, status: 'INVALID', class: 'is-invalid', text: 'This code already exists.',
                    } : {
                        value: code, status: 'VALID', class: 'is-valid', text: '',
                    }
                })
            }
        } else {
            this.setState({ code_validate: { value: code, status: '', class: '', text: '', } })
        }
    }

    render() {
        const idproperty = localStorage.getItem("propertyid");

        return (
            <div>
                <Loading show={this.state.loading} />
                <Card>
                    <CardHeader style={{ backgroundColor: '#634ae2' }}>
                        <h3 className="mb-0 text-white">เพิ่มลูกบ้าน / Add Member </h3>
                    </CardHeader>
                    <Form onSubmit={this._handleSubmit}>
                        <CardBody>
                            <Row>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>รหัสลูกบ้าน <font color="#F00"><b>*</b></font></label>
                                        <Input
                                            type="text"
                                            value={this.state.member_code}
                                            className={this.state.code_validate.class}
                                            onChange={(e) => this.setState({ member_code: e.target.value })}
                                            onBlur={this._checkCode}
                                            required
                                        />
                                        <p className="text-muted">Example : MEM00001.</p>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>ชื่อ <font color="#F00"><b>*</b></font></label>
                                        <Input
                                            type="text"
                                            value={this.state.member_name}
                                            className={this.state.code_validate.class}
                                            onChange={(e) => this.setState({ member_name: e.target.value })}
                                            onBlur={this._checkCode}
                                            required
                                        />
                                        <p className="text-muted">Example : สมชาย.</p>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>นามสกุล <font color="#F00"><b>*</b></font></label>
                                        <Input
                                            type="text"
                                            value={this.state.member_lastname}
                                            className={this.state.code_validate.class}
                                            onChange={(e) => this.setState({ member_lastname: e.target.value })}
                                            onBlur={this._checkCode}
                                            required
                                        />
                                        <p className="text-muted">Example : มาดี.</p>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter className="text-right">
                            <Button type="submit" color="success">Save</Button>
                            <Link to={`/properties/${idproperty}/member`}><Button type="button">Back</Button></Link>
                        </CardFooter>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Insert