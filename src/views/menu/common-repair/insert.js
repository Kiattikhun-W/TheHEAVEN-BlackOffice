import React from "react";
import moment from "moment";

import {
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import GLOBAL from "../../../GLOBAL";
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import * as FormData from 'form-data';

import { Loading, Select } from "../../../components/heaven-strap";
import { timeFormat } from "../../../utils";
import {
    RepairCommonModel,
    RepairZoneModel,
    RepairCategoryModel,
    RepairCategoryListModel,
    UnitMemberModel,
} from "../../../models";
import { Switch, DatePicker, Card, Button, Upload } from "antd";

const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";
const repair_common_model = new RepairCommonModel();
const repair_zone_model = new RepairZoneModel();
const repair_category_model = new RepairCategoryModel();
const repair_category_list_model = new RepairCategoryListModel();

const unit_member_model = new UnitMemberModel();

class Insert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            code_validate: {
                value: "",
                status: "",
                class: "",
                text: "",
            },
            jobNo: new Date().getTime().toString(),
            setDisable: true,
            unit_members: [],
            repair_zones: [],
            repair_categories: [],
            repair_common_code: "",
            repairZone: "",
            repairCategory: "",
            property: "",
            user: "",
            repair_common_status: "",
            description: "",
            startDate: new Date(),
            finishDate: new Date(),
            repair_common_note: "",
            repair_common_image: {
                src: `https://cdn.discordapp.com/attachments/914042035802112061/931939477503508610/254337478_571291797460516_304746305366841547_n.png`,
                file: null,
                old: "",
            },
            upload_path: "repaircommon/",
        };
    }

    componentDidMount() {
        this._fetchData();
    }

    _fetchData = async () => {
        const now = new Date();
        const idproperty = localStorage.getItem("propertyid");

        const repair_zones = await repair_zone_model.getRepairZoneBy({
            useInCommonArea: true,
            limit: 500
        });
        const repair_categories = await repair_category_model.getRepairCategoryBy(
            {
                limit: 500
            }
        );
        const unit_members = await unit_member_model.getUnitMemberBy({
            propertyId: Number(idproperty),
            limit: 500
        });

        const
            keys = ['userId'],
            filtered = unit_members.result[0].item.filter(
                (s => o =>
                    (k => !s.has(k) && s.add(k))
                        (keys.map(k => o[k]).join('|'))
                )
                    (new Set)
            );

        console.log(filtered)
        this.setState({
            loading: false,
            repair_zones: repair_zones.result[0].item,
            repair_categories: repair_categories.result[0].item,
            unit_members: filtered,
        });
    };

    _handleSubmit = async (event) => {
        event.preventDefault();

        const idproperty = Number(localStorage.getItem("propertyid"));
        this._checkSubmit() &&
            this.setState({ loading: true }, async () => {
                const form_data = new FormData();
                // form_data.append("image", this.state.repair_common_image?.file, this.state.repair_common_image.file?.name)       

                const res = await repair_common_model.insertRepairCommon({
                    repairZone: this.state.repairZone,
                    // repair_common_status: this.state.repair_common_status.trim(),
                    repairCategory: this.state.repairCategory,
                    property: idproperty,
                    user: this.state.user,
                    description: this.state.description.trim(),
                    startDate: timeFormat.dateToStr(this.state.startDate),
                    finishDate: timeFormat.dateToStr(this.state.finishDate),
                    // image: await repair_common_model.insertRepairCommonImage({
                    //     repair_common_image: this.state.repair_common_image,
                    // })
                    // image: {
                    //     file:this.state.repair_common_image.file, 
                    //     name:this.state.repair_common_image.file.name
                    // }
                });

                if (res.code === 200) {
                    const resImg = await repair_common_model.insertRepairCommonImage({
                        repair_common_image: this.state.repair_common_image,
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
                            this.props.history.goBack();
                        }
                    } else {
                        Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success" });
                        this.props.history.goBack();
                    }
                    // Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success" });
                    //     this.props.history.goBack();

                } else {
                    this.setState({ loading: false }, () => {
                        Swal.fire({
                            title: "เกิดข้อผิดพลาด !",
                            text: "ไม่สามารถดำเนินการได้ !",
                            icon: "error",
                        });
                    });
                }
            });
    };

    _handleImageChange(img_name, e) {
        if (e.target.files.length) {
            let file = new File([e.target.files[0]], e.target.files[0].name, {
                type: e.target.files[0].type,
            });

            if (file) {
                let reader = new FileReader();

                reader.onloadend = () => {
                    this.setState((state) => {
                        if (img_name === "repair_common_image") {

                            return {
                                repair_common_image: {
                                    src: reader.result,
                                    file: file,
                                    old: state.repair_common_image.old,
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
        if (!this.state.user) {
            Swal.fire({ text: "กรุณาระบุผู้ติดต่อ ", icon: "warning", })
            return false
        }
        if (this.state.repair_common_image?.file?.size > 2097152) {
            Swal.fire({ text: "รูปภาพต้องมีขนาดไม่เกิน 2MB", icon: "warning", })
            return false
        }
        else if (!this.state.repairZone) {
            Swal.fire({ text: "กรุณาระบุพื้นที่ / Please input Repair Area", icon: "warning", })
            return false
        }
        else if (!this.state.repairCategory) {
            Swal.fire({ text: "กรุณาระบุหมวดหมู่ / Please input Repair Category", icon: "warning", })
            return false
        }
        else if (this.state.description === '') {
            Swal.fire({ text: "กรุณาระบุรายละเอียด", icon: "warning", })
            return false
        }
        else if (!this.state.startDate && !!this.state.finishDate) {
            Swal.fire({ text: "กรุณาระบุวัน", icon: "warning", })
            return false
        }
        else {
            return true
        }
        // return true;
    }

    _checkCode = async () => {
        const code = this.state.repair_common_code.replace(/\//g, "-").trim();

        if (code.length) {
            if (this.state.code_validate.value !== code) {
                const duplicate = await repair_common_model.getRepairCommonByCode({
                    repair_common_code: code,
                });

                this.setState({
                    repair_common_code: code,
                    code_validate: duplicate.data.length
                        ? {
                            value: code,
                            status: "INVALID",
                            class: "is-invalid",
                            text: "This code already exists.",
                        }
                        : {
                            value: code,
                            status: "VALID",
                            class: "is-valid",
                            text: "",
                        },
                });
            }
        } else {
            this.setState({
                code_validate: { value: code, status: "", class: "", text: "" },
            });
        }
    };

    _handleCategory = async (e) => {
        if (e === '') {
            this.setState({
                repairCategory: '',
                setDisable: true,
                repairZone: e,
            })
        } else {
            this.setState({
                repairCategory: '',
                setDisable: true,
            })
            const repair_categories = await repair_category_model.getRepairCategoryBy({
                repairZone: e,
                limit: 500,
            });

            this.setState({
                repairZone: e,
                repair_categories: repair_categories.result[0].item,
                setDisable: false,
            });
        }

    };

    render() {
        const idproperty = localStorage.getItem("propertyid");
        const repair_common_status_options = [
            { value: "Waiting", label: "รอดำเนินการ" },
            { value: "Process", label: "อยู่ระหว่างดำเนินการ" },
            { value: "Done", label: "เสร็จสิ้น" },
            { value: "Cancel", label: "ยกเลิก" },
        ];
        const repair_zone_options = [
            { label: "- ระบุพื้นที่ซ่อม -", value: "" },
            ...this.state.repair_zones.map((item) => ({
                label: item.zoneName,
                value: item.id,
            })),
        ];
        const repair_category_options = [
            { label: "- ระบุหมวดหมู่ -", value: "" },
            ...this.state.repair_categories.map((item) => ({
                label: item.categoryName,
                value: item.id,
            })),
        ];
        const unit_member_options = [
            { label: "- ระบุผู้ติดต่อ -", value: "" },
            ...this.state.unit_members.map((item) => ({
                label: item.user_fullname,
                value: item.user_id,
            })),
        ];
        return (
            <div>
                <Loading show={this.state.loading} />
                <Row>
                    <Col md={8}>
                        <Card className="cardTable">
                            <CardHeader style={{ backgroundColor: "#634ae2", padding: 17 }}>
                                <h3 className="mb-0 text-white">
                                    เพิ่มรายการแจ้งซ่อมพื้นที่ส่วนกลาง{" "}
                                </h3>
                            </CardHeader>

                            <Form onSubmit={this._handleSubmit}>
                                <CardBody className="p-5">
                                    <Row>
                                        <Col md={12}>
                                            <Row>
                                                {/* <Col md={4}>
                                                    <FormGroup>
                                                        <label>
                                                            Job no.{" "}
                                                            <font color="#F00">
                                                                <b>*</b>
                                                            </font>
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            value={this.state.jobNo}
                                                            onChange={(e) =>
                                                                this.setState({ jobNo: e.target.value })
                                                            }
                                                            readOnly
                                                        />
                                                    </FormGroup>
                                                </Col> */}
                                            </Row>
                                            {/* <hr /> */}
                                            <Row>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label>
                                                            ผู้ติดต่อ{" "}
                                                            <font color="#F00">
                                                                <b>*</b>
                                                            </font>
                                                        </label>
                                                        <Select
                                                            options={unit_member_options}
                                                            value={this.state.user}
                                                            onChange={(e) => this.setState({ user: e })}
                                                            readOnly
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <label>
                                                            รายละเอียด{" "}
                                                            <font color="#F00">
                                                                <b>*</b>
                                                            </font>
                                                        </label>
                                                        <Input
                                                            type="textarea"
                                                            rows={5}
                                                            value={this.state.description}
                                                            onChange={(e) =>
                                                                this.setState({ description: e.target.value })
                                                            }
                                                            required
                                                        />
                                                        <p className="text-muted">Example : ก็อกหัก.</p>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                {/* <Col md={4}>
                                                    <FormGroup>
                                                        <label>
                                                            สถานะ
                                                            <font color="#F00">
                                                                <b>*</b>
                                                            </font>
                                                        </label>
                                                        <Select
                                                            options={repair_common_status_options}
                                                            value={this.state.status}
                                                            onChange={(e) => this.setState({ status: e })}
                                                        />
                                                    </FormGroup>
                                                </Col> */}
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label>
                                                            ประเภทพื้นที่ซ่อม{" "}
                                                            <font color="#F00">
                                                                <b>*</b>
                                                            </font>
                                                        </label>
                                                        <Select
                                                            options={repair_zone_options}
                                                            value={this.state.repairZone}
                                                            onChange={(e) => this._handleCategory(e)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label>
                                                            หมวดหมู่การซ่อม{" "}
                                                            <font color="#F00">
                                                                <b>*</b>
                                                            </font>
                                                        </label>
                                                        <Select
                                                            options={repair_category_options}
                                                            value={this.state.repairCategory}
                                                            onChange={(e) =>
                                                                this.setState({ repairCategory: e })
                                                            }
                                                            disabled={this.state.setDisable}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label>
                                                            วันเริ่มและวันสิ้นสุด{" "}
                                                            <font color="#F00">
                                                                <b>*</b>
                                                            </font>
                                                        </label>
                                                        <RangePicker
                                                            value={[moment(this.state.startDate, 'DD/MM/YYYY'), moment(this.state.finishDate, 'DD/MM/YYYY')]}
                                                            // defaultValue={[moment(this.state.convenientStartTime, 'HH:mm'), moment(this.state.convenientStartTime, 'HH:mm')]}
                                                            onChange={(e) =>
                                                                this.setState({
                                                                    startDate: e[0],
                                                                    finishDate: e[1],
                                                                })
                                                            }
                                                            format={"DD/MM/YYYY"}
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
                                    <Link to={`/properties/${idproperty}/repaircommon`}>
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
                                    src={this.state.repair_common_image.src}
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
                                            this._handleImageChange("repair_common_image", e)
                                        }
                                    />
                                </label>,
                            ]}
                        ></Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Insert;
