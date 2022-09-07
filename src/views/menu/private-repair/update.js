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
import { timeFormat, } from '../../../utils'
import { RepairPrivateModel, RepairZoneModel, RepairCategoryModel, RepairCategoryListModel, UnitModel, UnitMemberModel, MediaPrivateModel, MediaModel } from '../../../models'
import { Switch, DatePicker, TimePicker, Card, Button, } from 'antd';

const { RangePicker } = DatePicker;

const dateFormat = 'DD/MM/YYYY';
const repair_private_model = new RepairPrivateModel()
const repair_zone_model = new RepairZoneModel()
const repair_category_model = new RepairCategoryModel()
const repair_category_list_model = new RepairCategoryListModel()
const unit_model = new UnitModel()
const unit_member_model = new UnitMemberModel()
const media_private_model = new MediaPrivateModel()
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
            repair_zones: [],
            units: [],
            id: 0,
            // unit_members: [],
            unit_member_code: '',
            unit_code: '',
            phoneNumber: 0,
            repair_categories: [],
            jobNo: new Date().getTime().toString(),
            repairZone: '',
            repairCategory: '',
            properties_code: '',
            status: '',
            createdAt: new Date(),
            description: '',
            startDate: new Date(),
            finishDate: new Date(),
            convenientDate: new Date(),
            convenientStartTime: new Date(),
            convenientEndTime: new Date(),
            repair_private_finish_date: new Date(),
            repair_private_note: '',
            repair_private_price: 0,
            repair_private_image: {
                src: `https://i.pinimg.com/originals/21/17/7c/21177c2546b4849f53234ac64a3e4232.png`,
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
                limit: 500

            });
            console.log("item", unit_members);
            if (unit_members.code === 200) {
                // console.log("phone","phone")

                let phone = unit_members.result[0].item.find(item => item.unitRole === 'Owner')
                console.log("phone", phone.user_phone)

                this.setState({
                    unit_code: e,
                    unit_members: unit_members.result[0].item,
                    phoneNumber: phone.user_phone
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
                limit: 500

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
        const { code } = this.props.match.params
        const repair_privates = await repair_private_model.getRepairPrivateByCode({ id: code })
        const idproperty = localStorage.getItem("propertyid");


        console.log(repair_privates)
        if (repair_privates.code !== 200) {
            Swal.fire({ title: "ข้อผิดพลาด !", text: 'ไม่สามารถโหลดข้อมูล', icon: "error", })
            this.props.history.push(`/properties/${idproperty}/repairprivate`)
        } else if (repair_privates.result.length === 0) {
            Swal.fire({ title: "ไม่พบรายการนี้ในระบบ !", text: code, icon: "warning", })
            this.props.history.push(`/properties/${idproperty}/repairprivate`)
        } else {
            const {
                id,
                jobNo,
                repairZone,
                status,
                repairCategory,
                unit,
                phoneNumber,
                description,
                convenientDate,
                convenientStartTime,
                convenientEndTime,
                startDate,
                finishDate,
                createdAt

            } = repair_privates.result[0]

            const media_privates = await media_private_model.getMediaPrivateBy({ repairPrivateHistoryId: code })

            let media_path = media_privates.result[0].item[0]?.media_path
            const medias = await media_model.getMediaBy({ title: "default" })
            let media_default = medias.result[0].item[0]?.path

            const repair_zones = await repair_zone_model.getRepairZoneBy({ useInPrivateArea: true, limit: 500 })
            const repair_categories = await repair_category_model.getRepairCategoryBy({ limit: 500 })
            const units = await unit_model.getUnitBy({
                propertyId: Number(idproperty),
                limit: 500
            })
            this.setState({
                id,
                createdAt,
                loading: false,
                convenientDate: timeFormat.validateDate(convenientDate),
                startDate,
                finishDate,
                repair_zones: repair_zones.result[0].item,
                repair_categories: repair_categories.result[0].item,
                units: units.result[0].item,
                phoneNumber,
                jobNo,
                repairZone: repairZone.id,
                status,
                repairCategory: repairCategory.id,
                unit_code: unit.id,
                description,
                convenientStartTime,
                convenientEndTime,
                repair_private_image: {
                    src: `${GLOBAL.BASE_SERVER.URL_IMG}${(media_path || media_default || '')}`,
                    file: null,
                    // old: repair_private_image,
                },

            })
        }
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

    _handleSubmit = (event) => {
        event.preventDefault()
        const idproperty = localStorage.getItem("propertyid");

        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await repair_private_model.updateRepairPrivateBy(
                Number(this.state.id),
                {
                    jobNo: this.state.jobNo.trim(),
                    repairZone: this.state.repairZone,
                    // status: this.state.status.trim(),
                    repairCategory: this.state.repairCategory,
                    unit: Number(this.state.unit_code),
                    property: idproperty,
                    status: this.state.status,
                    phoneNumber: this.state.phoneNumber,
                    description: this.state.description.trim(),
                    convenientDate: timeFormat.dateToStr(this.state.convenientDate),
                    startDate: timeFormat.dateToStr(this.state.startDate === null ? new Date(this.state.createdAt) : this.state.startDate),
                    finishDate: timeFormat.dateToStr(this.state.finishDate === null ? new Date(this.state.createdAt) : this.state.finishDate),
                    convenientStartTime: this.state.convenientStartTime,
                    convenientEndTime: this.state.convenientEndTime,
                })

            if (res.code === 200) {
                Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                this.props.history.push(`/properties/${idproperty}/repairprivate`)
            } else {
                this.setState({ loading: false, }, () => {
                    Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                })
            }
        })
    }

    _checkSubmit() {
        if (!this.state.repairZone) {
            Swal.fire({ text: "กรุณาระบุสถานะพื้นที่ / Please input Repair Status", icon: "warning", })
            return false
        }
        else {
            return true
        }
    }


    _handleCategory = async (e) => {
        const repair_categories = await repair_category_model.getRepairCategoryBy({ repairZone: e })
        console.log(repair_categories.result[0].item)

        this.setState({
            repairZone: e,
            repair_categories: repair_categories.result[0].item
        })
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
            // { value: "Process", label: "อยู่ระหว่างดำเนินการ" },
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
                                <h3 className="mb-0 text-white">แก้ไขแจ้งซ่อมพื้นที่ส่วนตัว  </h3>
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
                                                            disabled
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

                                                        />
                                                        <p className="text-muted">Example : ก็อกหัก.</p>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label>สถานะ<font color="#F00"><b>*</b></font></label>
                                                        <Select
                                                            options={repair_private_status_options}
                                                            value={this.state.status}
                                                            onChange={(e) => this.setState({ status: e })}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label>ประเภทพื้นที่ซ่อม <font color="#F00"><b>*</b></font></label>
                                                        <Select
                                                            options={repair_zone_options}
                                                            value={this.state.repairZone}
                                                            onChange={(e) => this._handleCategory(e)}
                                                            disabled
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label>หมวดหมู่การซ่อม <font color="#F00"><b>*</b></font></label>
                                                        <Select
                                                            options={repair_category_options}
                                                            value={this.state.repairCategory}
                                                            onChange={(e) => this.setState({ repairCategory: e })}
                                                            disabled
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
                                                            disabled
                                                            allowClear={false}

                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label>เวลาที่สะดวก <font color="#F00"><b>*</b></font></label>
                                                        <RangePicker
                                                            value={[moment(this.state.convenientStartTime, 'HH:mm'), moment(this.state.convenientEndTime, 'HH:mm')]}
                                                            // defaultValue={[moment(this.state.convenientStartTime, 'HH:mm'), moment(this.state.convenientStartTime, 'HH:mm')]}
                                                            picker="time"
                                                            onChange={this._handleConvenientTime}
                                                            format={'HH:mm'}
                                                            disabled
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <label>วันที่เริ่มซ่อม <font color="#F00"><b>*</b></font></label>
                                                    <DatePicker
                                                        value={moment(this.state.startDate === null ? new Date(this.state.createdAt) : this.state.startDate)}
                                                        onChange={(e) => this.setState({ startDate: e })}
                                                        format="YYYY-MM-DD"
                                                        allowClear={false}

                                                    />
                                                </Col>
                                                <Col md={6}>
                                                    <label>วันที่ซ่อมเสร็จ <font color="#F00"><b>*</b></font></label>
                                                    <DatePicker
                                                        value={moment(this.state.finishDate === null ? new Date(this.state.createdAt) : this.state.finishDate)}
                                                        onChange={(e) => this.setState({ finishDate: e })}
                                                        format="YYYY-MM-DD"
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

                        // actions={[
                        //     <label >เลือกรูปภาพ
                        //         <Input
                        //             style={{ display: 'none' }}
                        //             type="file"
                        //             accept="image/png, image/jpeg"
                        //             onChange={(e) => this._handleImageChange("repair_private_image", e)}
                        //         />
                        //     </label>
                        // ]}
                        ></Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Update