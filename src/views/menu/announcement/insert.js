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

import { AnnouncementModel } from '../../../models'
import { DatePicker, TimePicker, Button, Card, } from 'antd'
import Announcement from '.';

const announcement_model = new AnnouncementModel()

class Insert extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            desc: '',
            title: '',
            announcement_image: {
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
            const res = await announcement_model.insertAnnouncement({
                title: this.state.title.trim(),
                desc: this.state.desc.trim(),
                property: Number(idproperty),
                image: await announcement_model.insertAnnouncementImage({
                    announcement_image: this.state.announcement_image,
                })
            })
            if (res.code === 200) {
                Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                this.props.history.push(`/properties/${idproperty}/announcement`)
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
                        if (img_name === "announcement_image") {

                            return {
                                announcement_image: {
                                    src: reader.result,
                                    file: file,
                                    old: state.announcement_image.old,
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
        if (this.state.announcement_image?.file?.size > 2097152) {
            Swal.fire({ text: 'ขนาดรูปภาพไม่เกิน 2MB', icon: "warning", })
            return false
        } else if (this.state.desc === '') {
            Swal.fire({ text: 'โปรดระบุรายละเอียด', icon: "warning", })
            return false
        } else if (this.state.title === '') {
            Swal.fire({ text: 'โปรดระบุหัวข้อ', icon: "warning", })
            return false
        } else if (this.state.announcement_image.file === null) {
            Swal.fire({ text: 'โปรดระบุรูปภาพ', icon: "warning", })
            return false
        }
        else {
            return true
        }
        // else {
        //     return true
        // }
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
                                <h3 className="mb-0 text-white">เพิ่มประกาศ  </h3>
                            </CardHeader>
                            <Form onSubmit={this._handleSubmit}>
                                <CardBody>
                                    <Row>
                                        <Col md={12}>
                                            <Row>
                                                <Col>
                                                    <FormGroup>
                                                        <label>หัวข้อ<font color="#F00"><b>*</b></font></label>
                                                        <Input
                                                            type="text"
                                                            value={this.state.title}
                                                            onChange={(e) => this.setState({ title: e.target.value })}
                                                            required
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <label>รายละเอียด<font color="#F00"><b>*</b></font></label>
                                                        <Input
                                                            type="textarea"
                                                            rows={3}
                                                            value={this.state.desc}
                                                            onChange={(e) => this.setState({ desc: e.target.value })}
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
                                    <Link to={`/properties/${idproperty}/announcement`}>
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
                                    src={this.state.announcement_image.src}
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
                                            this._handleImageChange("announcement_image", e)
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