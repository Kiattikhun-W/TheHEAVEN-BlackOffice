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

import { RepairZoneModel, } from '../../../models'
import { Switch } from 'antd';

const repair_zone_model = new RepairZoneModel()

class Update extends React.Component {
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
            id: 0,
            zoneName: '',
            useInCommonArea: false,
            useInPrivateArea: false,

        }
    }

    componentDidMount() {
        this._fetchData()
    }

    _fetchData = async () => {
        const { code } = this.props.match.params

        const repair_zones = await repair_zone_model.getRepairZoneByCode({ id: code })
        console.log("22", repair_zones.result[0])
        if (repair_zones.code !== 200) {
            Swal.fire({ title: "ข้อผิดพลาด !", text: 'ไม่สามารถโหลดข้อมูล', icon: "error", })
            this.props.history.push(`/setting/repair-zone`)
        } else if (repair_zones.result.length === 0) {
            Swal.fire({ title: "ไม่พบรายการนี้ในระบบ !", text: code, icon: "warning", })
            this.props.history.push(`/setting/repair-zone`)
        } else {
            const {
                id,
                zoneName,
                useInCommonArea,
                useInPrivateArea,
            } = repair_zones.result[0]

            this.setState({
                id,
                loading: false,
                zoneName,
                useInCommonArea,
                useInPrivateArea,
            })
        }
    }

    _handleSubmit = (event) => {
        event.preventDefault()

        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await repair_zone_model.updateRepairZoneBy(
                Number(this.state.id), {
                zoneName: this.state.zoneName.trim(),
                useInCommonArea: this.state.useInCommonArea,
                useInPrivateArea: this.state.useInPrivateArea,
                updateby: this.props.USER.user_code
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
        if (!this.state.repair_zone_status) {
            // Swal.fire({ text: "กรุณาระบุสถานะพื้นที่ / Please input Repair Status", icon: "warning", })
            // return false
            return true

        } else {
            return true
        }
    }

    render() {
        const repair_zone_status_options = [
            { value: "Active", label: "ใช้งาน" },
            { value: "Inactive", label: "ปิดการใช้งาน" },
        ];
        return (
            <div>
                <Loading show={this.state.loading} />
                <Card>
                    <CardHeader style={{ backgroundColor: '#634ae2' }}>
                        <h3 className="mb-0 text-white">แก้ไขพื้นที่ซ่อม / Add Repair Zone </h3>
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
                                            <Switch
                                                checked={this.state.useInPrivateArea}
                                                onChange={(e) => this.setState({ useInPrivateArea: e === true })} />

                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>เปิดใช้งานพื้นที่ส่วนกลาง <font color="#F00"><b>*</b></font></label>
                                        <div>
                                            <Switch
                                                checked={this.state.useInCommonArea}
                                                onChange={(e) => this.setState({ useInCommonArea: e })} />
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter className="text-right">
                            <Button type="submit" color="success">Save</Button>
                            <Link to={`/setting/repair-zone`}><Button type="button">Back</Button></Link>
                        </CardFooter>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Update