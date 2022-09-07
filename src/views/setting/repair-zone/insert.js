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

import { RepairZoneModel } from '../../../models'
import { Switch } from 'antd';

const repair_zone_model = new RepairZoneModel()

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
            repair_zone_code: '',
            zoneName: '',
            useInCommonArea: false,
            useInPrivateArea: false,

        }
    }

    componentDidMount() {
        this._fetchData()
    }

    _fetchData = async () => {
        const now = new Date()
        const last_code = await repair_zone_model.generateRepairZoneLastCode({
            code: `RZ${now.getFullYear()}`,
            digit: 3,
        })

        this.setState({
            loading: false,
            code_validate: { value: last_code.data, status: 'VALID', class: '', text: '', },
            repair_zone_code: last_code.data,
        })
    }

    _handleSubmit = (event) => {
        event.preventDefault()

        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await repair_zone_model.insertRepairZone({
                zoneName: this.state.zoneName.trim(),
                useInCommonArea: this.state.useInCommonArea,
                useInPrivateArea: this.state.useInPrivateArea,
            })

            if (res.code === 200) {
                Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                this.props.history.push(`/setting/repair-zone`)
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
        // else if (!this.state.repair_zone_status) {
        //     Swal.fire({ text: "กรุณาระบุสถานะพื้นที่ / Please input Repair Status", icon: "warning", })
        //     return false
        // }
        else {
            return true
        }
    }

    _checkCode = async () => {
        const code = this.state.repair_zone_code.replace(/\//g, "-").trim()

        if (code.length) {
            if (this.state.code_validate.value !== code) {
                const duplicate = await repair_zone_model.getRepairZoneByCode({ repair_zone_code: code })

                this.setState({
                    repair_zone_code: code,
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
        // const repair_zone_status_options = [
        //     { value: "Active", label: "ใช้งาน" },
        //     { value: "Inactive", label: "ปิดการใช้งาน" },
        // ];
        return (
            <div>
                <Loading show={this.state.loading} />
                <Card>
                    <CardHeader style={{ backgroundColor: '#634ae2' }}>
                        <h3 className="mb-0 text-white">เพิ่มพื้นที่ซ่อม / Add Repair Zone </h3>
                    </CardHeader>
                    <Form onSubmit={this._handleSubmit}>
                        <CardBody>
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <label>ชื่อพื้นที่ <font color="#F00"><b>*</b></font></label>
                                        <Input
                                            type="text"
                                            value={this.state.zoneName}
                                            onChange={(e) => this.setState({ zoneName: e.target.value })}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>เปิดใช้งานพื้นที่ส่วนตัว  <font color="#F00"><b>*</b></font></label>
                                        <div>
                                            <Switch onChange={(e) => this.setState({ useInPrivateArea: e })} />
                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>เปิดใช้งานพื้นที่ส่วนกลาง  <font color="#F00"><b>*</b></font></label>
                                        <div><Switch onChange={(e) => this.setState({ useInCommonArea: e })} /></div>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter className="text-right">
                            <Button type="submit" color="success">Save</Button>
                            <Link to={`setting/repair-zone`}><Button type="button">Back</Button></Link>
                        </CardFooter>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Insert