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
import { RepairCommonModel, RepairZoneModel, RepairCategoryModel, RepairCategoryListModel, UnitMemberModel, MediaCommonModel, MediaModel, UserModel } from '../../../models'
import { Switch, DatePicker, Card, Button, } from 'antd';

const idproperty = localStorage.getItem("propertyid");

const { RangePicker } = DatePicker;

const dateFormat = 'DD/MM/YYYY';
const repair_common_model = new RepairCommonModel()
const repair_zone_model = new RepairZoneModel()
const repair_category_model = new RepairCategoryModel()
const unit_member_model = new UnitMemberModel()
const media_common_model = new MediaCommonModel()
const media_model = new MediaModel()
const user_model = new UserModel()

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
            jobNo: new Date().getTime().toString(),
            unit_members: [],
            repair_zones: [],
            repair_categories: [],
            createdAt: new Date(),
            jobNo: '',
            repairZone: '',
            repairCategory: '',
            property: '',
            user: '',
            id: 0,
            status: '',
            description: '',
            startDate: new Date(),
            finishDate: new Date(),
            repair_common_note: '',
            repair_common_image: {
                src: `https://cdn.discordapp.com/attachments/914042035802112061/931939477503508610/254337478_571291797460516_304746305366841547_n.png`,
                file: null,
                old: '',
            },
            upload_path: "repaircommon/",
            repair_commons: [],
            media_path: 'https://cdn.discordapp.com/attachments/914042035802112061/931939477503508610/254337478_571291797460516_304746305366841547_n.png',
        }
    }

    componentDidMount() {
        this._fetchData()
    }

    _fetchData = async () => {
        const { code } = this.props.match.params
        const repair_commons = await repair_common_model.getRepairCommonByCode({ id: code })

        const media_commons = await media_common_model.getMediaCommonBy({ repairCommonHistoryId: code })
        const medias = await media_model.getMediaBy({ title: "default" })


        if (repair_commons.code !== 200) {
            Swal.fire({ title: "ข้อผิดพลาด !", text: 'ไม่สามารถโหลดข้อมูล', icon: "error", })
            this.props.history.push(`/properties/${idproperty}/repaircommon`)
        } else if (repair_commons.result.length === 0) {
            Swal.fire({ title: "ไม่พบรายการนี้ในระบบ !", text: code, icon: "warning", })
            this.props.history.push(`/properties/${idproperty}/repaircommon`)
        } else {
            const {
                id,
                jobNo,
                repairZone,
                repairCategory,
                status,
                description,
                user,
                startDate,
                finishDate,
                createdAt,
            } = repair_commons.result[0]
            console.log("medias", medias)
            // let {

            //     media_path,
            // } = media_commons.result[0].item[0]
            let media_path = media_commons.result[0].item[0]?.media_path
            let media_default = medias.result[0].item[0]?.path

            console.log("media_path", media_commons.result[0].item[0]?.media_path)


            const repair_zones = await repair_zone_model.getRepairZoneBy({ useInCommonArea: true })
            const repair_categories = await repair_category_model.getRepairCategoryBy({})
            const unit_members = await user_model.getUserBy({
                limit: 500,
            })
            this.setState({
                id,
                loading: false,
                jobNo,
                repairZone: repairZone.id,
                repairCategory: repairCategory.id,
                status,
                description,
                startDate,
                finishDate,
                createdAt,
                user: user.id,
                repair_zones: repair_zones.result[0].item,
                repair_categories: repair_categories.result[0].item,
                unit_members: unit_members.result[0].item,
                repair_common_image: {
                    src: `${GLOBAL.BASE_SERVER.URL_IMG}${(media_path || media_default || '')}`,
                    file: null,
                    // old: repair_common_image,
                },
            }, () => console.log(this.state.finishDate))
        }
    }

    _handleImageChange(img_name, e) {
        if (e.target.files.length) {
            let file = new File([e.target.files[0]], e.target.files[0].name, { type: e.target.files[0].type, })

            if (file) {
                let reader = new FileReader()

                reader.onloadend = () => {
                    this.setState(state => {
                        if (img_name === "repair_common_image") {
                            return {
                                repair_common_image: {
                                    src: reader.result,
                                    file: file,
                                    old: state.repair_common_image.old,
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

        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await repair_common_model.updateRepairCommonBy(
                Number(this.state.id), {
                jobNo: this.state.jobNo.trim(),
                repairZone: this.state.repairZone,
                status: this.state.status.trim(),
                repairCategory: this.state.repairCategory,
                properties_code: idproperty,
                description: this.state.description.trim(),
                startDate: timeFormat.dateToStr(this.state.startDate === null ? new Date(this.state.createdAt) : this.state.startDate),
                finishDate: timeFormat.dateToStr(this.state.finishDate === null ? new Date(this.state.createdAt) : this.state.finishDate),
            })

            if (res.code === 200) {
                Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                this.props.history.push(`/properties/${idproperty}/repaircommon`)
            } else {
                this.setState({ loading: false, }, () => {
                    Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                })
            }
        })
    }

    _checkSubmit() {
        if (!this.state.status) {
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

    render() {
        const idproperty = localStorage.getItem("propertyid");
        const status_options = [
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
        const unit_member_options = [
            { label: "- ระบุผู้ติดต่อ -", value: "" },
            ...this.state.unit_members.map((item) => ({
                label: item.firstname + " " + item.lastname,
                value: item.id,
            })),
        ];
        return (


            <div>
                <Loading show={this.state.loading} />
                <Row>
                    <Col md={8}>
                        <Card className="cardTable">
                            <CardHeader style={{ backgroundColor: '#634ae2', padding: 17 }}>
                                <h3 className="mb-0 text-white">แก้ไขพื้นที่ส่วนกลาง </h3>
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
                                                        <label>ผู้ติดต่อ <font color="#F00"><b>*</b></font></label>
                                                        <Select
                                                            options={unit_member_options}
                                                            value={this.state.user}
                                                            onChange={(e) => this.setState({ user: e })}
                                                            disabled
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
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label>สถานะ<font color="#F00"><b>*</b></font></label>
                                                        <Select
                                                            options={status_options}
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
                                                        {console.log(this.state.startDate, this.state.finishDate)}
                                                        <label>วันเริ่มและวันสิ้นสุด <font color="#F00"><b>*</b></font></label>
                                                        <RangePicker

                                                            value={[moment(this.state.startDate === null ? new Date(this.state.createdAt) : this.state.startDate, 'YYYY/MM/DD'), moment(this.state.finishDate === null ? new Date(this.state.createdAt) : this.state.finishDate, 'YYYY/MM/DD')]}
                                                            // defaultValue={[moment(this.state.convenientStartTime, 'HH:mm'), moment(this.state.convenientStartTime, 'HH:mm')]}
                                                            onChange={(e) => this.setState({ startDate: e[0], finishDate: e[1] })}
                                                            format={'YYYY/MM/DD'}
                                                            allowClear={false}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter className="text-right">
                                    <Button type="primary" className='mr-2' onClick={this._handleSubmit} size="large">Save</Button>
                                    <Link
                                        to={`/properties/${idproperty}/repaircommon`}
                                    >
                                        <Button size="large">Back</Button></Link>
                                </CardFooter>
                            </Form>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card
                            className="p-0"
                            title="Image Before Repairing"

                            cover={
                                <img
                                    className="image-upload"
                                    style={{}}
                                    src={this.state.repair_common_image.src}
                                    alt="profile"
                                />
                            }

                        // actions={[
                        //     <label >เลือกรูปภาพ
                        //         <Input
                        //             style={{ display: 'none' }}
                        //             type="file"
                        //             accept="image/png, image/jpeg"
                        //             onChange={(e) => this._handleImageChange("repair_common_image", e)}
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