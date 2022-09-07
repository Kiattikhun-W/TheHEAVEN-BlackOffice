import React from 'react'
import moment from 'moment';

import {
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
import { Button } from 'antd'


import { Loading, Select, DataTable } from '../../../components/heaven-strap'
import QRCode from "react-qr-code";
import { FacilityBookModel, FacilityZoneModel, UnitModel, UnitMemberModel } from '../../../models'
import { timeFormat, lineUniversalLink } from '../../../utils'
const facility_book_model = new FacilityBookModel()
const facility_zone_model = new FacilityZoneModel()
const unit_model = new UnitModel()
const unit_member_model = new UnitMemberModel()
const idproperty = localStorage.getItem("propertyid");

class Update extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            code_validate: {
                value: '',
                bookStatus: '',
                class: '',
                text: '',
            },
            bookingNo: "",
            facility_zones: [],
            unit_members: [],
            units: [],
            index_buffers: [],
            time_lists: [],
            facilityZone: '',
            facility_book_name: '',
            bookParticipant: '',
            facility_book_code: '',
            facility_book_type: '',
            bookStatus: '',
            id: 0,
            isCancel: false,
            isCheckIn: false,
            bookDate: moment(new Date()).format("YYYY-MM-DD"),
            time_selected: []
        }
    }

    componentDidMount() {
        this._fetchData()
        // this._getTimeForBooking()
    }


    _fetchData = async () => {
        const { code } = this.props.match.params

        const facility_books = await facility_book_model.getFacilityBookByCode({ id: code })

        if (facility_books.code !== 200) {
            Swal.fire({ title: "ข้อผิดพลาด !", text: 'ไม่สามารถโหลดข้อมูล', icon: "error", })
            this.props.history.push(`/properties/${idproperty}/facilitybook`)
        } else if (facility_books.result.length === 0) {
            Swal.fire({ title: "ไม่พบรายการนี้ในระบบ !", text: code, icon: "warning", })
            this.props.history.push(`/properties/${idproperty}/facilitybook`)
        } else {

            const {
                id,
                facilityZone,
                unitUser,
                bookParticipant,
                bookStarttime,
                bookEndtime,
                bookDate,
                bookStatus,
                bookingNo,
                checkIn,
                cancel,
            } = facility_books.result[0]

            const facility_zones = await facility_zone_model.getFacilityZoneBy({ propertyId: idproperty, limit: 500 })
            const unit_members = await unit_member_model.getUnitMemberBy({ unit: unitUser.unit.id, limit: 500 })

            const units = await unit_model.getUnitBy({ propertyId: idproperty, limit: 500 })

            this.setState({
                loading: false,
                bookingNo,
                isCheckIn: checkIn,
                isCancel: cancel,
                facilityZone: facilityZone.id,
                unit_code: unitUser.unit.id,
                units: units.result[0].item,
                unitUser: unitUser.id,
                bookParticipant,
                bookStarttime,
                bookEndtime,
                bookDate: timeFormat.validateDate(bookDate),
                bookStatus,
                bookDate_fixed: timeFormat.dateToStr(bookDate),
                unit_members: unit_members.result[0].item,
                facility_zones: facility_zones.result[0].item,
                // facility_zone_capacity:facility_zones.data[0].facility_zone_capacity

            })
        }
    }

    _handleSubmit = (event) => {
        event.preventDefault()

        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await facility_zone_model.updateFacilityZoneBy({
                facilityZone: this.state.facilityZone.trim(),
                facility_zone_name: this.state.facility_zone_name.trim(),
                facility_zone_capacity: this.state.facility_zone_capacity,
                properties_code: idproperty,
            })

            if (res.code === 200) {
                Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                this.props.history.push(`/properties/${idproperty}/facilitybook`)
            } else {
                this.setState({ loading: false, }, () => {
                    Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                })
            }
        })
    }

    _checkSubmit() {
        if (!this.state.unitUser) {
            Swal.fire({ text: "กรุณาระบุสมาชิก", icon: "warning", })
            return false
        }
        else if (!this.state.unit_code) {
            Swal.fire({ text: "กรุณาระบุยูนิต", icon: "warning", })
            return false
        }
        else if (!this.state.facilityZone) {
            Swal.fire({ text: "กรุณาระบุพื้นที่ส่วนกลาง", icon: "warning", })
            return false
        }
        else if (!this.state.facilityZone) {
            Swal.fire({ text: "กรุณาระบุพื้นที่ส่วนกลาง", icon: "warning", })
            return false
        }
        else if (this.state.bookParticipant > this.state.index_buffers[0]?.capacity) {
            Swal.fire({ text: "จำนวนคนมากกว่าความจุ", icon: "warning", })
            return false
        }
        else {
            return true
        }
    }
    _unitSelected = async (e) => {
        if (e !== "") {
            const unit_members = await unit_member_model.getUnitMemberBy({
                unit: Number(e),
                limit: 500,

            });
            console.log("unit_members", unit_members)
            this.setState({
                unitUser: "",
                unit_code: e,
                unit_members: unit_members.result[0].item,
            });
        } else if (e === "") {
            this.setState({
                unit_code: e,
                unit_members: [],
                unitUser: "",
                user_phone: "",
            });
        }
    };
    _contactSelected = async (e) => {
        if (e !== "") {
            const unit_members = await unit_member_model.getUnitMemberBy({
                id: Number(e),
                limit: 500

            });
            console.log(unit_members.result[0].item);
            const { user_phone } = unit_members.result[0].item[0];
            this.setState({
                unitUser: e,
                user_phone,
            });
        } else if (e === "" || this.state.unitUser === "") {
            this.setState({
                unitUser: e,
                user_phone: "",
            });
        }
    };

    _handleDatetimeBooking = async (date) => {
        const time_lists = await facility_book_model.checkDateTimeBooking({
            facilityId: this.state.facilityZone,
            bookDate: this.state.bookDate
        })
        console.log(time_lists)
        this.setState({
            time_lists: time_lists.result,
            time_selected: []
        })

    }
    _handleCheckIn = async () => {
        this.setState({ loading: true, }, async () => {
            const res = await facility_book_model.checkInFacilityBook({
                bookingNo: this.state.bookingNo
            })

            if (res.code === 200) {
                Swal.fire({ title: "เช็คอินเรียบร้อย !", icon: "success", })
                this.props.history.push(`/properties/${idproperty}/facilitybook`)
            } else {
                this.setState({ loading: false, }, () => {
                    Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                })
            }
        })
    }
    _handleCancel = async () => {
        this.setState({ loading: true, }, async () => {
            const res = await facility_book_model.cancelFacilityBook({
                bookingNo: this.state.bookingNo
            })

            if (res.code === 200) {
                Swal.fire({ title: "ยกเลิกการจองเรียบร้อย !", icon: "success", })
                this.props.history.push(`/properties/${idproperty}/facilitybook`)
            } else {
                this.setState({ loading: false, }, () => {
                    Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                })
            }
        })
    }

    render() {
        const idproperty = localStorage.getItem("propertyid");
        const starttime = String(this.state.bookStarttime).length === 1
            ? `0${this.state.bookStarttime}:00`
            : `${this.state.bookStarttime}:00`
        const endttime = String(this.state.bookEndtime).length === 1
            ? `0${this.state.bookEndtime}:00`
            : `${this.state.bookEndtime}:00`

        const facility_zone_options = [{ label: '- ระบุพื้นที่ส่วนกลาง -', value: '', }, ...this.state.facility_zones.map(item => ({
            label: item.facilityName, value: item.id,
        }))]
        const unit_options = [
            { label: "- ระบุยูนิต -", value: "" },
            ...this.state.units.map((item) => ({
                label: item.unitName,
                value: item.id,
            })),
        ];
        const unit_member_options = [
            { label: "- ระบุผู้ติดต่อ -", value: "" },
            ...this.state.unit_members.map((item) => ({
                label: item.user_fullname,
                value: item.id,
            })),
        ];
        const status_options = [
            { label: '- ระบุสถานะ -', value: '', },
            { value: 'Wait', label: 'รอเช็คอิน', },
            { value: 'Checkin', label: 'เช็คอิน', },
            { value: 'Cancel', label: 'ยกเลิก', }
        ]

        return (
            <div>
                <Loading show={this.state.loading} />
                <Card>
                    <CardHeader style={{ backgroundColor: '#634ae2' }}>
                        <h3 className="mb-0 text-white">รายการจองพื้นที่ส่วนกลาง / View FacilityBook </h3>
                    </CardHeader>
                    <Form onSubmit={this._handleSubmit}>
                        <CardBody>
                            <Row>
                                <Col md={8} >
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <label>ยูนิต </label>
                                                <Select
                                                    options={unit_options}
                                                    value={this.state.unit_code}
                                                    onChange={(e) => this._unitSelected(e)}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <label>ผู้ติดต่อ </label>
                                                <Select
                                                    options={unit_member_options}
                                                    value={this.state.unitUser}
                                                    onChange={(e) => this._contactSelected(e)}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <label>ผู้เข้าร่วม </label>
                                                <Input
                                                    type="number"
                                                    value={this.state.bookParticipant}
                                                    onChange={(e) => this.setState({ bookParticipant: e.target.value })}
                                                    readOnly
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <label>พื้นที่ส่วนกลาง </label>
                                                <Select
                                                    options={facility_zone_options}
                                                    value={this.state.facilityZone}
                                                    onChange={(e) => this._handleDatetimeBooking(e)}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <label>วันที่จอง</label>
                                            <Input
                                                className='text-center'
                                                type="text"
                                                value={timeFormat.showFullDateTH(moment(this.state.bookDate))}
                                                readOnly
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <label>เวลาที่จอง</label>
                                            <Input
                                                className='text-center'
                                                type="text"
                                                value={starttime + "-" + endttime}
                                                readOnly
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <label>สถานะ </label>
                                                <Select
                                                    options={status_options}
                                                    value={this.state.bookStatus}
                                                    onChange={(e) => this.setState({ bookStatus: e })}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={4}>
                                    <Row>
                                        <Col md={12}>
                                            <h4>หมายเลขการจอง {this.state.bookingNo}</h4>
                                            <div
                                                style={{
                                                    borderRadius: 0,
                                                    border: "solid 2px rgba(0, 0, 0, 0.1)",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <div style={{ margin: 30, display: "inline-block" }}>
                                                    <QRCode
                                                        value={`${lineUniversalLink}/booking/booking-checkin/?booking-no=${this.state.bookingNo}`}
                                                        size={180}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter className="text-right">
                            <Button
                                type="primary"
                                disabled={this.state.isCancel || this.state.isCheckIn}
                                className="mr-2"
                                onClick={this._handleCheckIn}
                                size="large"
                            >
                                Check-In
                            </Button>
                            <Button
                                type="primary"
                                disabled={this.state.isCancel || this.state.isCheckIn}
                                danger
                                className="mr-2"
                                onClick={this._handleCancel}
                                size="large"
                            >
                                Cancel
                            </Button>
                            <Link to={`/properties/${idproperty}/facilitybook`}>
                                <Button size="large">Back</Button>
                            </Link>
                        </CardFooter>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Update
