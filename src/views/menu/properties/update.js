import React from 'react'
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
import { longdo, LongdoMap, map } from "./components/LongdoMap";
import { Card, Button } from 'antd'
import { PropertiesModel, MediaModel } from '../../../models'
import { timeFormat, _isEmpty } from '../../../utils'
import GLOBAL from '../../../GLOBAL'

const mapKey = "0c5d92d423a811a9840e6628d79e7c33";

const properties_model = new PropertiesModel()
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
            btnSave: false,
            propertyName: '',
            about: '',
            tel: '',
            type: '',
            address: '',
            properties_pic: '',
            areaSize: 0,
            email: '',
            id: 0,
            locationText: '',
            properties: [],
            location: {
                lat: 0,
                lon: 0
            },
            property_image: {
                src: `https://cdn.discordapp.com/attachments/914042035802112061/931939477503508610/254337478_571291797460516_304746305366841547_n.png`,
                file: null,
                old: "",
            },
        }
    }

    componentDidMount() {
        this._fetchData()
    }
    componentDidUpdate(props_old, prev_state) {
        // console.log("prev_state.location",prev_state.location,"sate",this.state.location)

        if (prev_state.location !== this.state.location) {
            //   this._fetchData()
            this.setState({
                location: this.state.location,
            })
            console.log("prev_state.location", prev_state.location, "state", this.state.location)
            // this._handleChangeLocation()

            this._handleCall()
        }
    }

    _fetchData = async () => {
        const { code } = this.props.match.params

        const properties = await properties_model.getPropertiesByCode({ id: code })


        if (properties.code !== 200) {
            Swal.fire({ title: "ข้อผิดพลาด !", text: 'ไม่สามารถโหลดข้อมูล', icon: "error", })
            this.props.history.push(`manage-menu/properties`)
        } else if (properties.result.length === 0) {
            Swal.fire({ title: "ไม่พบรายการนี้ในระบบ !", text: code, icon: "warning", })
            this.props.history.push(`manage-menu/properties`)
        } else {
            console.log("properties.result", properties.result)
            const {
                id,
                tel,
                address,
                location,
                email,
                type,
                about,
                areaSize,
                propertyName,
                image,
                imagePath,
            } = properties.result[0]
            const medias = await media_model.getMediaBy({ title: "default" })
            // let imagePath = image?.path
            let media_default = medias.result[0].item[0]?.path
            const cloneValue = { ...location }
            const newValue = {
                lat: cloneValue.lat,
                lon: cloneValue.lon,
            }
            console.log("newValue", newValue)

            this.setState({
                id,
                loading: false,
                tel,
                address,
                location: newValue,
                locationText: cloneValue.location,
                email,
                type,
                about,
                areaSize,
                propertyName,
                property_image: {
                    src: `${GLOBAL.BASE_SERVER.URL_IMG}${(imagePath || media_default || '')}`
                }
            })
        }
    }

    _handleSubmit = (event) => {
        event.preventDefault()
        // const cloneValue = { ...this.state.location }

        // const newLocation = {
        //     location: this.state.locationText,
        //     lat: cloneValue.lat,
        //     lon: cloneValue.lon,
        // }
        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await properties_model.updatePropertiesBy(Number(this.state.id), {
                propertyName: this.state.propertyName.trim(),
                about: this.state.about.trim(),
                email: this.state.email,
                address: this.state.address.trim(),
                // location: newLocation,
                areaSize: this.state.areaSize,
                tel: this.state.tel,
                type: this.state.type.trim(),
                image: await properties_model.insertPropertiesImage({
                    property_image: this.state.property_image,
                })
            })

            if (res.code === 200) {
                Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                this.props.history.push(`manage-menu/properties`)
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
                        if (img_name === "property_image") {

                            return {
                                property_image: {
                                    src: reader.result,
                                    file: file,
                                    old: state.property_image.old,
                                },
                            };
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        }
    }

    _checkSubmit() {
        if (this.state.property_image?.file?.size > 2097152) {
            Swal.fire({ text: 'ขนาดรูปภาพไม่เกิน 2MB', icon: "warning", })
            return false
        }
        else if (!this.state.type) {
            Swal.fire({ text: "กรุณาระบุประเภทโครงการ", icon: "warning", })
            return false
        }
        else if (this.state.tel === '' || this.state.areaSize === '' || this.state.email === '' || this.state.address === '' || this.state.address === null || this.state.about === '' || this.state.propertyName === '') {
            Swal.fire({ text: "กรุณาระบุข้อมูลให้ครบ", icon: "warning", })
            return false
        }
        else {
            return true
        }
    }
    _handleCall = () => {
        console.log("yeah", this.state.pressCall)

        if (this.state.pressCall === true) {
            this._handleChangeLocation()
        }
    }

    render() {
        const type_options = [
            { label: '- ระบุประเภท -', value: '', },
            { value: "Condo", label: "คอนโด" },
            { value: "housing estate", label: "บ้านจัดสรร" },
        ];

        return (
            <div>
                <Loading show={this.state.loading} />
                <Row>
                    <Col md={8}>
                        <Card className='cardTable'>
                            <CardHeader style={{ backgroundColor: '#634ae2' }}>
                                <h3 className="mb-0 text-white">เพิ่มโครงการ / Add Property </h3>
                            </CardHeader>
                            <Form onSubmit={this._handleSubmit}>
                                <CardBody>
                                    <Row>
                                        <Col md={4}>
                                            <FormGroup>
                                                <label>ชื่อโครงการ <font color="#F00"><b>*</b></font></label>
                                                <Input
                                                    type="text"
                                                    value={this.state.propertyName}
                                                    onChange={(e) => this.setState({ propertyName: e.target.value })}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <label>ประเภท <font color="#F00"><b>*</b></font></label>
                                                <Select
                                                    options={type_options}
                                                    value={this.state.type}
                                                    onChange={(e) => this.setState({ type: e })}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}>
                                            <FormGroup>
                                                <label>ขนาดพื้นที่ <font color="#F00"><b>*</b></font></label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={this.state.areaSize}
                                                    onChange={(e) => this.setState({ areaSize: e.target.value })}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <label>อีเมล <font color="#F00"><b>*</b></font></label>
                                                <Input
                                                    type="email"
                                                    min={0}
                                                    value={this.state.email}
                                                    onChange={(e) => this.setState({ email: e.target.value })}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}>
                                            <FormGroup>
                                                <label>รายละเอียดโครงการ <font color="#F00"><b>*</b></font></label>
                                                <Input
                                                    type="textarea"
                                                    rows={3}
                                                    value={this.state.about}
                                                    onChange={(e) => this.setState({ about: e.target.value })}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <label>ที่อยู่ <font color="#F00"><b>*</b></font></label>
                                                <Input
                                                    type="textarea"
                                                    rows={3}
                                                    value={this.state.address}
                                                    onChange={(e) => this.setState({ address: e.target.value })}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        {/* <Col md={4}>
                                            <FormGroup>
                                                <label>ตำแหน่ง <font color="#F00"><b>*</b></font></label>
                                                <Input
                                                    type="text"
                                                    value={this.state.locationText}
                                                    onChange={(e) => this.setState({ locationText: e.target.value })}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col> */}
                                        <Col md={4}>
                                            <FormGroup>
                                                <label>โทรศัพท์ <font color="#F00"><b>*</b></font></label>
                                                <Input
                                                    type="text"
                                                    value={this.state.tel}
                                                    onChange={(e) => this.setState({ tel: e.target.value })}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>

                                    </Row>
                                </CardBody>
                                <CardFooter className="text-right">
                                    {/* <Button type="submit" color="success">Save</Button>
                                    <Link to={`manage-menu/properties`}><Button type="button">Back</Button></Link> */}
                                    <Button
                                        type="primary"
                                        className="mr-2"
                                        onClick={this._handleSubmit}
                                        size="large"
                                    >
                                        Save
                                    </Button>
                                    <Link to={`manage-menu/properties`}>
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
                                    src={this.state.property_image.src}
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
                                            this._handleImageChange("property_image", e)
                                        }
                                    />
                                </label>,
                            ]}
                        ></Card>
                    </Col>
                </Row>

            </div >
        )
    }
}

export default Update