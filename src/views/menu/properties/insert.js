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
import { PropertiesModel } from '../../../models'
import { timeFormat, _isEmpty } from '../../../utils'

const mapKey = "0c5d92d423a811a9840e6628d79e7c33";

const properties_model = new PropertiesModel()

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
            btnSave: false,
            propertyName: '',
            about: '',
            tel: '',
            type: '',
            address: '',
            properties_pic: '',
            areaSize: '',
            email: '',
            locationText: '',
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

    _fetchData = async () => {


        this.setState({
            loading: false,
        })
    }

    _handleSubmit = (event) => {
        event.preventDefault()
        const cloneValue = { ...this.state.location }

        const newLocation = {
            location: this.state.locationText,
            lat: cloneValue.lat,
            lon: cloneValue.lon,
        }
        console.log(this.state.property_image)

        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await properties_model.insertProperties({
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
                this.props.history.push(`/manage-menu/properties`)
            } else {
                this.setState({ loading: false, }, () => {
                    Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                })
            }
        })
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
        else if (this.state.tel === '' || this.state.areaSize === '' || this.state.email === '' || this.state.address === '' || this.state.about === '' || this.state.propertyName === '') {
            Swal.fire({ text: "กรุณาระบุข้อมูลให้ครบ", icon: "warning", })
            return false
        }
        // else if (!this.state.properties_pic) {
        //     Swal.fire({ text: "กรุณาระบุประเภทยูนิต / Please input unit type", icon: "warning", })
        //     return false
        // } 
        else {
            return true
        }
    }

    // Map = () => {
    //     map.location(longdo.LocationMode.Geolocation);
    //     map.Layers.setBase(longdo.Layers.NORMAL);
    //     map.zoom(20, true);
    //     map.Ui.Toolbar.visible(false);
    //     map.Ui.LayerSelector.visible(false);
    //     map.Ui.Fullscreen.visible(false);
    //     map.Ui.Crosshair.visible(false);
    //     map.Ui.Mouse.enableDrag(true);
    //     map.Ui.Mouse.enableWheel(true);
    //     map.Ui.Mouse.enableInertia(true);
    //     map.Ui.Keyboard.enableInertia(true);
    //     map.zoom(14, true);

    //     map.zoomRange({ min: 2, max: 20 });

    //     map.Event.bind("overlayDrop", (overlay) => {
    //         //   setlocation(overlay.location());
    //         this.setState({
    //             location: overlay.location()
    //         })
    //         // console.log(overlay.location())
    //     });
    // };
    // _handleChangeLocation = () => {
    //     if (_isEmpty(map.location())) {
    //         //   setlocation({ lon: 102.21889436244965, lat: 12.860059254174148 });
    //         this.setState({
    //             location: {
    //                 lon: 102.21889436244965, lat: 12.860059254174148
    //             }
    //         })

    //         map.bound({
    //             minLon: 102.21889436244965,
    //             minLat: 12.860059254174148,
    //             maxLon: 102.21889436244965,
    //             maxLat: 12.860059254174148,
    //         });

    //         const marker = new longdo.Marker(
    //             { lon: 102.21889436244965, lat: 12.860059254174148 },
    //             {
    //                 title: "Marker",
    //                 detail: "ตำเเหน่งของคุณ",
    //                 draggable: true,
    //                 weight: longdo.OverlayWeight.Top,
    //             }
    //         );
    //         map.Overlays.add(marker);
    //     } else {
    //         map.Layers.setBase(longdo.Layers.NORMAL);

    //         //   setlocation({ lon: map.location().lon, lat: map.location().lat });
    //         this.setState({
    //             location: {
    //                 lon: map.location().lon, lat: map.location().lat
    //             }
    //         })

    //         map.bound({
    //             minLon: map.location().lon,
    //             minLat: map.location().lat,
    //             maxLon: map.location().lon,
    //             maxLat: map.location().lat,
    //         });

    //         const marker = new longdo.Marker(
    //             { lon: map.location().lon, lat: map.location().lat },
    //             {
    //                 title: "Marker",
    //                 detail: "ตำเเหน่งของคุณ",
    //                 draggable: true,
    //                 weight: longdo.OverlayWeight.Top,
    //             }
    //         );
    //         map.Overlays.add(marker);
    //     }

    //     map.Event.bind("overlayDrop", (overlay) => {
    //         console.log("overlay", overlay.location())
    //         //   setlocation(overlay.location());
    //         this.setState({
    //             location: {
    //                 lon: overlay.location().lon,
    //                 lat: overlay.location().lat,
    //             }
    //         })

    //     });
    //     this.setState({
    //         btnSave: true
    //     })

    // };
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
                                        {/* <Col md={12} className="map-detail" style={{ height: "400px" }}>
                                            <LongdoMap
                                                key="longdo-map"
                                                id="longdo-map"
                                                mapKey={mapKey}
                                                callback={this.Map}
                                            />
                                        </Col>

                                        <Col md={12} className='d-flex justify-content-center'><div>Latitude :{this.state.location?.lat}</div></Col>
                                        <Col md={12} className='d-flex justify-content-center'>Longitude :{this.state.location?.lon}</Col>
                                        <Col md={12}>

                                            {this.state.btnSave === false ? (
                                                <Button type="primary" onClick={this._handleChangeLocation}>
                                                    เซ็ตตำแหน่ง
                                                </Button>
                                            ) : (
                                                " "
                                            )}
                                        </Col> */}
                                    </Row>
                                </CardBody>
                                <CardFooter className="text-right">
                                    {/* <Button type="submit" color="success">Save</Button>
                                    <Link to={`manage-menu/properties`}><Button type="button">Back</Button></Link> */}
                                    <Button
                                        type="primary"
                                        htmlType="submit"
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

export default Insert