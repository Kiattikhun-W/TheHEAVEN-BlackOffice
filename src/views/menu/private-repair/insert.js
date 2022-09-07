import React from 'react'
import moment from 'moment';

import {
    // Button,

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
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

import { Loading, Select } from '../../../components/heaven-strap'
import { timeFormat, } from '../../../utils'
import { RepairPrivateModel, RepairZoneModel, RepairCategoryModel, RepairCategoryListModel, UnitModel, UnitMemberModel, MemberModel } from '../../../models'
import { Switch, DatePicker, TimePicker, Avatar, Card, Button } from 'antd';

const { RangePicker } = DatePicker;

const dateFormat = 'DD/MM/YYYY';
const repair_private_model = new RepairPrivateModel()
const repair_zone_model = new RepairZoneModel()
const repair_category_model = new RepairCategoryModel()
const repair_category_list_model = new RepairCategoryListModel()
const unit_model = new UnitModel()
const unit_member_model = new UnitMemberModel()
const member_model = new MemberModel()

const { Meta } = Card;

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
            repair_zones: [],
            setDisable: true,
            units: [],
            unit_members: [],
            unit_member_code: '',
            unit_code: '',
            phoneNumber: 0,
            repair_categories: [],
            jobNo: new Date().getTime().toString(),
            repairZone: '',
            repairCategory: '',
            properties_code: '',
            status: '',
            description: '',
            repair_private_start_date: new Date(),
            startDate: new Date(),
            finishDate: new Date(),
            convenientDate: new Date(),
            convenientStartTime: new Date(),
            convenientEndTime: new Date(),
            repair_private_finish_date: new Date(),
            repair_private_note: '',
            repair_private_price: 0,
            repair_private_image: {
                src: `https://cdn.discordapp.com/attachments/914042035802112061/931939477503508610/254337478_571291797460516_304746305366841547_n.png`,
                file: null,
                old: '',
            },
            upload_path: "repairprivate/",

        }
    }
    componentDidMount() {
        this._fetchData()
    }
    _unitSelected = async (e) => {
        this.setState({
            unit_member_code: "",
            phoneNumber: "",

        });
        if (e !== "") {
            const unit_members = await unit_member_model.getUnitMemberBy({
                unit: Number(e),
                limit: 500,
            });
            console.log("item", unit_members);
            if (unit_members.code === 200) {
                // console.log("phone","phone")

                let phone = unit_members.result[0].item.find(item => item.unitRole === 'Owner')


                console.log("phone", phone)
                if (phone) {
                    this.setState({
                        unit_code: e,
                        unit_members: unit_members.result[0].item,
                        phoneNumber: phone?.user_phone
                    });
                }

                this.setState({
                    unit_code: e,
                    unit_members: unit_members.result[0].item,
                    phoneNumber: phone?.user_phone
                });
            } else {
                this.setState({
                    unit_code: e,
                });
            }


        } else if (e === "") {
            this.setState({
                unit_code: e,
                unit_members: [],
                unit_member_code: "",
                phoneNumber: "",
            });
        }
    };
    _contactSelected = async (e) => {

        if (e !== "") {

            const unit_members = await unit_member_model.getUnitMemberBy({
                user: Number(e),
            });
            const { user_phone } = unit_members.result[0].item[0]
            console.log("item", user_phone);

            this.setState({
                unit_member_code: e,
                phoneNumber: user_phone,
            });
        } else if (e === "" || this.state.unit_member_code === "") {
            this.setState({
                unit_member_code: e,
                phoneNumber: "",
            });
        }
    };

    _fetchData = async () => {
        const now = new Date()
        const idproperty = localStorage.getItem("propertyid");
        const last_code = await repair_private_model.generateRepairPrivateLastCode({
            code: `RPRI${now.getFullYear()}`,
            digit: 3,
        })
        const repair_zones = await repair_zone_model.getRepairZoneBy({ useInPrivateArea: true, limit: 500 })
        const repair_categories = await repair_category_model.getRepairCategoryBy({
            limit: 500
        })
        const units = await unit_model.getUnitBy({
            propertyId: Number(idproperty),
            limit: 500
        })

        // const repair_category_list = await repair_category_list_model.getRepairCategoryListBy({})

        this.setState({
            loading: false,
            code_validate: { value: last_code.data, status: 'VALID', class: '', text: '', },
            repair_zones: repair_zones.result[0].item,
            repair_categories: repair_categories.result[0].item,
            units: units.result[0].item
            // repair_category_list:repair_category_list.data

        })
    }

    _handleSubmit = (event) => {
        event.preventDefault()
        // console.log(this.state.convenientStartTime,this.state.convenientEndTime)
        const idproperty = Number(localStorage.getItem("propertyid"));
        console.log(this.state.convenientStartTime)
        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await repair_private_model.insertRepairPrivate({
                jobNo: this.state.jobNo.trim(),
                repairZone: this.state.repairZone,
                // status: this.state.status.trim(),
                repairCategory: this.state.repairCategory,
                unit: Number(this.state.unit_code),
                property: idproperty,
                // unit_member_code:this.state.unit_member_code,
                phoneNumber: this.state.phoneNumber,
                description: this.state.description.trim(),
                // repair_private_start_date: timeFormat.dateToStr(this.state.repair_private_start_date),
                // repair_private_finish_date: timeFormat.dateToStr(this.state.repair_private_finish_date),
                convenientDate: timeFormat.dateToStr(this.state.convenientDate),
                startDate: timeFormat.dateTimeToStr(this.state.startDate),
                finishDate: timeFormat.dateTimeToStr(this.state.finishDate),
                convenientStartTime: this.state.convenientStartTime,
                convenientEndTime: this.state.convenientEndTime,
            })
            console.log("this.state.unit_code", this.state.unit_code)

            if (res.code === 200) {
                const resImg = await repair_private_model.insertRepairPrivateImage({
                    repair_private_image: this.state.repair_private_image,
                    id: res.result[0].id
                })
                if (resImg) {
                    if (resImg.code !== 200) {
                        this.setState({ loading: false }, () => {
                            Swal.fire({
                                title: "เกิดข้อผิดพลาด !",
                                text: resImg.message,
                                icon: "error",
                            });
                        });
                    } else {
                        Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success" });
                        this.props.history.push(`/properties/${idproperty}/repairprivate`);
                    }
                } else {
                    Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success" });
                    this.props.history.push(`/properties/${idproperty}/repairprivate`);
                }

                Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                this.props.history.push(`/properties/${idproperty}/repairprivate`)
            } else {
                this.setState({ loading: false, }, () => {
                    Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                })
            }
        })
    }

    _handleImageChange(img_name, e) {
        if (e.target.files.length) {
            let file = new File([e.target.files[0]], e.target.files[0].name, { type: e.target.files[0].type, })

            if (file) {
                let reader = new FileReader()

                reader.onloadend = () => {
                    this.setState(state => {
                        if (img_name === "repair_private_image") {
                            return {
                                repair_private_image: {
                                    src: reader.result,
                                    file: file,
                                    old: state.repair_private_image.old,
                                },
                            }
                        }
                    })
                }
                reader.readAsDataURL(file)
            }
        }
    }

    _checkSubmit() {
        if (this.state.unit_code === '') {
            Swal.fire({ text: "กรุณาเลือก unit", icon: "warning", })
            return false
        }
        else if (!this.state.phoneNumber) {
            Swal.fire({ text: "ยูนิตที่ท่านเลือกไม่มีเจ้าของยูนิต", icon: "warning", })
            return false
        } else if (!this.state.repairCategory) {
            Swal.fire({ text: "กรุณาเลือกหมวดหมู่", icon: "warning", })
            return false
        } else if (!this.state.repairZone) {
            Swal.fire({ text: "กรุณาเลือกพื้นที่", icon: "warning", })
            return false
        } else if (this.state.description === '') {
            Swal.fire({ text: "กรุณากรอกรายละเอียด", icon: "warning", })
            return false
        }
        else {
            return true
        }
    }

    _checkCode = async () => {
        const code = this.state.jobNo.replace(/\//g, "-").trim()

        if (code.length) {
            if (this.state.code_validate.value !== code) {
                const duplicate = await repair_private_model.getRepairPrivateByCode({ jobNo: code })

                this.setState({
                    jobNo: code,
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

    _handleCategory = async (e) => {
        if (e === '') {
            this.setState({
                repairCategory: '',
                setDisable: true,
                repairZone: e,
            })
        } else {
            const repair_categories = await repair_category_model.getRepairCategoryBy({ repairZone: e, limit: 500 })
            this.setState({
                repairZone: e,
                repair_categories: repair_categories.result[0].item,
                setDisable: false,
            })
        }

    }
    _handleConvenientTime = (e, t) => {
        console.log(t)
        this.setState({
            convenientStartTime: t[0],
            convenientEndTime: t[1]

        })


    }

    render() {
        const idproperty = localStorage.getItem("propertyid");
        const repair_private_status_options = [
            { label: '- ระบุสถานะ -', value: '', },
            { value: "Waiting", label: "รอดำเนินการ" },
            { value: "Process", label: "อยู่ระหว่างดำเนินการ" },
            { value: "Done", label: "เสร็จสิ้น" },
            { value: "Cancel", label: "ยกเลิก" },
        ];
        const repair_zone_options = [{ label: '- ระบุพื้นที่ซ่อม -', value: '', }, ...this.state.repair_zones.map(item => ({
            label: item.zoneName, value: item.id,
        }))]
        const repair_category_options = [{ label: '- ระบุหมวดหมู่ -', value: '', }, ...this.state.repair_categories.map(item => ({
            label: item.categoryName, value: item.id,
        }))]
        const unit_options = [{ label: '- ระบุยูนิต -', value: '', }, ...this.state.units.map(item => ({
            label: item.unitName, value: item.id,
        }))]
        return (


            <div>
                <Loading show={this.state.loading} />
                <Row>
                    <Col md={8}>
                        <Card className="cardTable">
                            <CardHeader style={{ backgroundColor: '#634ae2', padding: 17 }}>
                                <h3 className="mb-0 text-white">เพิ่มรายการแจ้งซ่อมพื้นที่ส่วนตัว / Add Private Repair </h3>
                            </CardHeader>

                            <Form onSubmit={this._handleSubmit}>
                                <CardBody className='p-5'>
                                    <Row>
                                        <Col md={12}>
                                            <Row>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label>Job no. <font color="#F00"><b>*</b></font></label>
                                                        <Input
                                                            type="text"
                                                            value={this.state.jobNo}
                                                            onChange={(e) => this.setState({ jobNo: e.target.value })}
                                                            readOnly
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label>ยูนิต <font color="#F00"><b>*</b></font></label>
                                                        <Select
                                                            options={unit_options}
                                                            value={this.state.unit_code}
                                                            onChange={(e) => this._unitSelected(e)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label>โทรศัพท์ <font color="#F00"><b>*</b></font></label>
                                                        <Input
                                                            type="text"
                                                            value={this.state.phoneNumber}
                                                            onChange={(e) => this.setState({ phoneNumber: e.target.value })}
                                                            readOnly
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <label>รายละเอียด <font color="#F00"><b>*</b></font></label>
                                                        <Input
                                                            type="textarea"
                                                            rows={5}
                                                            value={this.state.description}
                                                            onChange={(e) => this.setState({ description: e.target.value })}
                                                            required
                                                        />
                                                        <p className="text-muted">Example : ก็อกหัก.</p>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                {/* <Col md={4}>
                                                    <FormGroup>
                                                        <label>สถานะ<font color="#F00"><b>*</b></font></label>
                                                        <Select
                                                            options={repair_private_status_options}
                                                            value={this.state.status}
                                                            onChange={(e) => this.setState({ status: e })}
                                                        />
                                                    </FormGroup>
                                                </Col> */}
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label>ประเภทพื้นที่ซ่อม <font color="#F00"><b>*</b></font></label>
                                                        <Select
                                                            options={repair_zone_options}
                                                            value={this.state.repairZone}
                                                            onChange={(e) => this._handleCategory(e)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label>หมวดหมู่การซ่อม <font color="#F00"><b>*</b></font></label>
                                                        <Select
                                                            options={repair_category_options}
                                                            value={this.state.repairCategory}
                                                            onChange={(e) => this.setState({ repairCategory: e })}
                                                            disabled={this.state.setDisable}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label>วันที่สะดวก <font color="#F00"><b>*</b></font></label>
                                                        <DatePicker
                                                            defaultValue={moment(this.state.convenientDate, "DD/MM/YYYY")}
                                                            onChange={(e, datestring) => this.setState({ convenientDate: e })}
                                                            format="DD/MM/YYYY"
                                                            allowClear={false}

                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label>เวลาที่สะดวก <font color="#F00"><b>*</b></font></label>
                                                        <RangePicker
                                                            // value={[moment(this.state.convenientStartTime, '00:00'), moment(this.state.convenientEndTime, '00:00')]}
                                                            // defaultValue={[moment(this.state.convenientStartTime, 'HH:mm'), moment(this.state.convenientStartTime, 'HH:mm')]}
                                                            picker="time"
                                                            onChange={this._handleConvenientTime}
                                                            format={'HH:mm'}
                                                            allowClear={false}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <label>Startdate <font color="#F00"><b>*</b></font></label>
                                                    <DatePicker
                                                        value={moment(this.state.startDate)}
                                                        showTime
                                                        onChange={(e) => this.setState({ startDate: e })}
                                                        format="DD/MM/YYYY"
                                                        allowClear={false}

                                                    />
                                                </Col>
                                                <Col md={6}>
                                                    <label>Enddate <font color="#F00"><b>*</b></font></label>
                                                    <DatePicker
                                                        value={moment(this.state.finishDate)}
                                                        showTime
                                                        onChange={(e) => this.setState({ finishDate: e })}
                                                        format="DD/MM/YYYY"
                                                        allowClear={false}

                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter className="text-right">
                                    <Button type="primary" className='mr-2' onClick={this._handleSubmit} size="large">Save</Button>
                                    <Link to={`/properties/${idproperty}/repairprivate`}><Button size="large">Back</Button></Link>
                                </CardFooter>
                            </Form>
                        </Card>
                    </Col>
                    <Col sm={12} md={4}>
                        <Card
                            className="p-0"
                            title="Image Before Repairing"

                            cover={
                                <img
                                    className="image-upload"
                                    style={{}}
                                    src={this.state.repair_private_image.src}
                                    alt="profile"
                                />
                            }

                            actions={[
                                <label >เลือกรูปภาพ
                                    <Input
                                        style={{ display: 'none' }}
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => this._handleImageChange("repair_private_image", e)}
                                    />
                                </label>
                            ]}
                        ></Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Insert