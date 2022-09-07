import React from 'react'
import moment from 'moment';

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

import { FacilityZoneModel } from '../../../models'
import { DatePicker, TimePicker } from 'antd'

const facility_zone_model = new FacilityZoneModel()

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
            title: '',
            user: 0,
            unit: 0,



        }
    }

    componentDidMount() {
        this._fetchData()
    }

    _fetchData = async () => {
        const now = new Date()
        const last_code = await facility_zone_model.generateFacilityZoneLastCode({
            code: `FCL${now.getFullYear()}`,
            digit: 3,
        })

        this.setState({
            loading: false,
            code_validate: { value: last_code.data, status: 'VALID', class: '', text: '', },
            facility_zone_code: last_code.data,
        })
    }

    _handleSubmit = (event) => {
        const idproperty = localStorage.getItem("propertyid");
        event.preventDefault()


        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await facility_zone_model.insertFacilityZone({
                // facility_zone_code: this.state.facility_zone_code.trim(),
                title: this.state.title.trim(),
                user: Number(this.props.USER.id),
                unit: Number(this.state.unit)
                // properties_code:idproperty,
            })

            if (res.require) {
                Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                this.props.history.push(`/properties/${idproperty}/facilityzone`)
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
        }
        else {
            return true
        }
    }

    _checkCode = async () => {
        const code = this.state.facility_zone_code.replace(/\//g, "-").trim()

        if (code.length) {
            if (this.state.code_validate.value !== code) {
                const duplicate = await facility_zone_model.getFacilityZoneByCode({ facility_zone_code: code })

                this.setState({
                    facility_zone_code: code,
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
                        <h3 className="mb-0 text-white">เพิ่มกระทู้ / Add FacilityZone </h3>
                    </CardHeader>
                    <Form onSubmit={this._handleSubmit}>
                        <CardBody>
                            <Row>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>หัวข้อกระทู้ <font color="#F00"><b>*</b></font></label>
                                        <Input
                                            type="text"
                                            value={this.state.title}
                                            onChange={(e) => this.setState({ title: e.target.value })}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>ความจุ <font color="#F00"><b>*</b></font></label>
                                        <Input
                                            type="number"
                                            value={this.state.facility_zone_capacity}
                                            onChange={(e) => this.setState({ facility_zone_capacity: e.target.value })}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>เวลาเปิด<font color="#F00"><b>*</b></font></label>
                                        <TimePicker
                                            format={"HH:mm"}
                                            minuteStep={60}
                                            onChange={(e, t) => this.setState({ facility_zone_starttime: t })}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>เวลาปิด<font color="#F00"><b>*</b></font></label>
                                        <TimePicker
                                            format={"HH:mm"}
                                            minuteStep={60}
                                            onChange={(e, t) => this.setState({ facility_zone_endtime: t })}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter className="text-right">
                            <Button type="submit" color="success">Save</Button>
                            <Link to={`/properties/${idproperty}/facilityzone`}><Button type="button">Back</Button></Link>
                        </CardFooter>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Insert