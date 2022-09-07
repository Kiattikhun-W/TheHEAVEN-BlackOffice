import React from 'react'
import moment from 'moment';

import {
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
import { DatePicker, TimePicker, Button, Card, } from 'antd'

const facility_zone_model = new FacilityZoneModel()

class Insert extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            facilityName: '',
            facilityCapacity: '',
            facilityStart: moment(new Date()).format("HH:00"),
            facilityEnd: moment(new Date()).format("HH:00"),
            facility_image: {
                src: `https://cdn.discordapp.com/attachments/914042035802112061/931939477503508610/254337478_571291797460516_304746305366841547_n.png`,
                file: null,
                old: "",
            },
        }
    }

    componentDidMount() {
        this._fetchData()
    }

    _fetchData = async () => {
        const now = new Date()

        this.setState({
            loading: false,

        })
    }

    _handleSubmit = (event) => {
        const idproperty = localStorage.getItem("propertyid");
        event.preventDefault()


        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await facility_zone_model.insertFacilityZone({
                facilityName: this.state.facilityName.trim(),
                capacity: Number(this.state.facilityCapacity),
                openTime: this.state.facilityStart.trim(),
                closeTime: this.state.facilityEnd.trim(),
                property: Number(idproperty),
                image: await facility_zone_model.insertFacilityZoneImage({
                    facility_image: this.state.facility_image,
                })
            })
            if (res.code === 200) {
                // const resImg = await facility_zone_model.insertFacilityZoneImage({
                //     facility_image: this.state.facility_image,
                //     id: res.result[0].id
                // })
                Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                this.props.history.push(`/properties/${idproperty}/facilityzone`)
            } else {
                this.setState({ loading: false, }, () => {
                    Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                })
            }
        })
    }
    _handleImageChange(img_name, e) {
        if (e.target.files.length) {
            let file = new File([e.target.files[0]], e.target.files[0].name, {
                type: e.target.files[0].type,
            });

            if (file) {
                let reader = new FileReader();

                reader.onloadend = () => {
                    this.setState((state) => {
                        if (img_name === "facility_image") {

                            return {
                                facility_image: {
                                    src: reader.result,
                                    file: file,
                                    old: state.facility_image.old,
                                },
                            };
                        }
                    }, () => {
                    });
                };
                reader.readAsDataURL(file);
            }
        }
    }

    _checkSubmit() {
        const openTime = Number(this.state.facilityStart.split(':')[0]);
        console.log(openTime)
        const closeTime =
            Number(this.state.facilityEnd.split(':')[0])
        if (this.state.facility_image?.file?.size > 2097152) {
            Swal.fire({ text: 'ขนาดรูปภาพไม่เกิน 2MB', icon: "warning", })
            return false
        } else if (this.state.facilityName === '') {
            Swal.fire({ text: 'โปรดระบุชื่อ', icon: "warning", })
            return false
        } else if (this.state.capacity === '') {
            Swal.fire({ text: 'โปรดระบุความจุ', icon: "warning", })
            return false
        }
        else if (this.state.facilityStart === '') {
            Swal.fire({ text: 'โปรดเลือกเวลาเปิด', icon: "warning", })
            return false
        } else if (this.state.facilityEnd === '') {
            Swal.fire({ text: 'โปรดเลือกเวลาปิด', icon: "warning", })
            return false
        }
        else if (openTime > closeTime) {
            Swal.fire({ text: 'เวลาเปิดต้องน้อยกว่าเวลาปิด', icon: "warning", })
            return false
        }
        else if (openTime === closeTime) {
            Swal.fire({ text: 'เวลาเปิด-ปิด ต้องไม่เท่ากัน', icon: "warning", })
            return false
        }
        else {
            return true
        }
    }
    render() {
        const idproperty = localStorage.getItem("propertyid");

        return (
            <div>
                <Loading show={this.state.loading} />
                <Row>
                    <Col md={8}>
                        <Card className='cardTable'>
                            <CardHeader style={{ backgroundColor: '#634ae2' }}>
                                <h3 className="mb-0 text-white">เพิ่มพื้นที่ส่วนกลาง / Add FacilityZone </h3>
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
                                                            value={this.state.facilityName}
                                                            onChange={(e) => this.setState({ facilityName: e.target.value })}
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
                                                            value={this.state.facilityCapacity}
                                                            onChange={(e) => this.setState({ facilityCapacity: e.target.value })}
                                                            required
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <label>เวลาเปิด<font color="#F00"><b>*</b></font></label>
                                                        <TimePicker
                                                            value={moment(this.state.facilityStart, 'HH:00')}
                                                            format={"HH:00"}
                                                            minuteStep={60}
                                                            onChange={(e, t) => this.setState({ facilityStart: t })}
                                                            allowClear={false}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <label>เวลาปิด<font color="#F00"><b>*</b></font></label>
                                                        <TimePicker
                                                            value={moment(this.state.facilityEnd, 'HH:00')}
                                                            format={"HH:00"}
                                                            minuteStep={60}
                                                            onChange={(e, t) => this.setState({ facilityEnd: t })}
                                                            allowClear={false}

                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter className="text-right">
                                    <Button
                                        type="primary"
                                        className="mr-2"
                                        onClick={this._handleSubmit}
                                        size="large"
                                    >
                                        Save
                                    </Button>
                                    <Link to={`/properties/${idproperty}/facilityzone`}>
                                        <Button size="large">Back</Button>
                                    </Link>
                                </CardFooter>
                            </Form>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card
                            className="p-0"
                            title="รูปภาพ"
                            cover={
                                <img
                                    className="image-upload"
                                    style={{}}
                                    src={this.state.facility_image.src}
                                    alt="profile"
                                />
                            }
                            actions={[
                                <label>
                                    เลือกรูปภาพ
                                    <Input
                                        style={{ display: "none" }}
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        onChange={(e) =>
                                            this._handleImageChange("facility_image", e)
                                        }
                                    />
                                </label>,
                            ]}
                        ></Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Insert