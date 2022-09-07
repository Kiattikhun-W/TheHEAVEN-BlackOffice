import React from 'react'
import {
    Button,
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

import { Loading, Select } from '../../../components/heaven-strap'
import { RepairCategoryManage, } from './components'

import { RepairCategoryModel, RepairZoneModel } from '../../../models'
import { Tabs, Space, Switch } from 'antd';

const { TabPane } = Tabs;

const repair_category_model = new RepairCategoryModel()
const repair_zone_model = new RepairZoneModel()


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
            repair_category_code: '',
            categoryName: '',
            repair_category_lists: [],
            zones: [],
            zoneIds: [],

        }
    }

    componentDidMount() {
        this._fetchData()
    }

    _fetchData = async () => {
        const now = new Date()
        const last_code = await repair_category_model.generateRepairCategoryLastCode({
            code: `RC${now.getFullYear()}`,
            digit: 3,
        })
        const zones = await repair_zone_model.getRepairZoneBy({

        })

        this.setState({
            loading: false,
            code_validate: { value: last_code.data, status: 'VALID', class: '', text: '', },
            zones: zones.result[0].item
        })
    }

    _handleSubmit = (event) => {
        event.preventDefault()
        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await repair_category_model.insertRepairCategory({
                categoryName: this.state.categoryName.trim(),
                repairZone: this.state.zoneIds
            })

            if (res.code === 200) {
                Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                this.props.history.push(`/setting/repair-category`)
            } else {
                this.setState({ loading: false, }, () => {
                    Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                })
            }
        })
    }

    _checkSubmit() {
        if (this.state.zoneIds.length === 0) {
            Swal.fire({ text: "กรุณาระบุพื้นที่", icon: "warning", })
            return false
        }
        // else if (!this.state.repair_category_warranty) {
        //     Swal.fire({ text: "กรุณาระบุการประกัน/ Please input Repair Warranty", icon: "warning", })
        //     return false
        // }
        else {
            return true
        }
    }

    render() {
        const zone_options = this.state.zones.map(item => ({
            label: item.zoneName, value: item.id,
        }))
        return (
            <div>
                <Loading show={this.state.loading} />
                <Row>
                    <Col md={8}>
                        <Card>
                            <CardHeader style={{ backgroundColor: '#634ae2' }}>
                                <h3 className="mb-0 text-white">เพิ่มหมวดหมู่การซ่อม / Add Repair Category </h3>
                            </CardHeader>
                            <Form onSubmit={this._handleSubmit}>
                                <CardBody>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <label>ชื่อหมวดหมู่ <font color="#F00"><b>*</b></font></label>
                                                <Input
                                                    type="text"
                                                    value={this.state.categoryName}
                                                    onChange={(e) => this.setState({ categoryName: e.target.value })}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <label>พื้นที่ {console.log(this.state.zoneIds)}<font color="#F00"><b>*</b></font></label>
                                                <Select
                                                    mode='multiple'
                                                    options={zone_options}
                                                    value={this.state.zoneIds}
                                                    onChange={(e) => this.setState({ zoneIds: e })}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter className="text-right">
                                    <Button type="submit" color="success">Save</Button>
                                    <Link to={`manage-menu/RepairCategory`}><Button type="button">Back</Button></Link>
                                </CardFooter>
                            </Form>
                        </Card>
                    </Col>
                    {/* <Col md={4}>
                        <Card>
                            <CardBody>
                                <Col md={12}>
                                    <Row>
                                        <Col md={12}>
                                            <Tabs defaultActiveKey='1' type="card">
                                                <TabPane tab="พื้นที่ซ่อม" key="1">
                                                    <Row>
                                                        <Col md={12}>
                                                            <RepairCategoryManage
                                                                onRefresh={(e) => this.setState({ repair_category_lists: e.repair_category_lists, },console.log("repair_category_lists",this.state.repair_category_lists))}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                            </Tabs>
                                        </Col>
                                    </Row>
                                </Col>
                            </CardBody>
                        </Card>
                    </Col> */}
                </Row>
            </div>
        )
    }
}

export default Insert