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
import GLOBAL from '../../../GLOBAL'


import { Loading, Select } from '../../../components/heaven-strap'

import { FacilityZoneModel, MediaModel } from '../../../models'
import { DatePicker, TimePicker, Button, Card, } from 'antd'

const facility_zone_model = new FacilityZoneModel()
const idproperty = localStorage.getItem("propertyid");
const media_model = new MediaModel()

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
            facilities: [],
            facilityName: '',
            capacity: '',
            id: '',
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
        const { code } = this.props.match.params

        const facilities = await facility_zone_model.getFacilityZoneByCode({ id: code })


        if (facilities.code !== 200) {
            Swal.fire({ title: "ข้อผิดพลาด !", text: 'ไม่สามารถโหลดข้อมูล', icon: "error", })
            this.props.history.push(`/properties/${idproperty}/facilityzone`)
        } else if (facilities.result.length === 0) {
            Swal.fire({ title: "ไม่พบรายการนี้ในระบบ !", text: code, icon: "warning", })
            this.props.history.push(`/properties/${idproperty}/facilityzone`)
        } else {
            console.log("facilities.result", facilities.result)
            const {
                id,
                facilityName,
                capacity,
                openTime,
                closeTime,
                image
            } = facilities.result[0]
            const medias = await media_model.getMediaBy({ title: "default" })
            let imagePath = image?.path

            let media_default = medias.result[0].item[0]?.path

            this.setState({
                id,
                loading: false,
                facilityName,
                capacity,
                openTime,
                closeTime,
                facility_image: {
                    src: `${GLOBAL.BASE_SERVER.URL_IMG}${(imagePath || media_default || '')}`
                }
            })
        }
    }

    _handleSubmit = (event) => {
        event.preventDefault()

        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await facility_zone_model.updateFacilityZoneBy(Number(this.state.id), {
                facilityName: this.state.facilityName.trim(),
                capacity: Number(this.state.capacity),
                openTime: this.state.openTime,
                closeTime: this.state.closeTime,
                // property: Number(idproperty),
                // image: await facility_zone_model.insertFacilityZoneImage({
                //     facility_image: this.state.facility_image,
                // })
            })

            if (res.code === 200) {
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
        // if(!this.state.phone_directory_type) {
        //     Swal.fire({ text: 'กรุณกรอกประเภทเบอร์โทร', icon: "warning", })
        //     return false
        // } else {
        //     return true
        // }
        return true
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
                                <h3 className="mb-0 text-white">แก้ไขพื้นที่ส่วนกลาง / Update FacilityZone </h3>
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
                                                            value={this.state.capacity}
                                                            onChange={(e) => this.setState({ capacity: e.target.value })}
                                                            required
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <label>เวลาเปิด<font color="#F00"><b>*</b></font></label>
                                                        <TimePicker
                                                            value={moment(this.state.openTime, 'HH:mm')}
                                                            format={"HH:mm"}
                                                            minuteStep={60}
                                                            onChange={(e, t) => this.setState({ openTime: t })}
                                                            required
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <label>เวลาปิด<font color="#F00"><b>*</b></font></label>
                                                        <TimePicker
                                                            value={moment(this.state.closeTime, 'HH:mm')}
                                                            format={"HH:mm"}
                                                            minuteStep={60}
                                                            onChange={(e, t) => this.setState({ closeTime: t })}
                                                            required
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
                                // <label>
                                //     เลือกรูปภาพ
                                //     <Input
                                //         style={{ display: "none" }}
                                //         type="file"
                                //         accept="image/png, image/jpeg"
                                //         onChange={(e) =>
                                //             this._handleImageChange("facility_image", e)
                                //         }
                                //     />
                                // </label>,
                            ]}
                        ></Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Update