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

import { UnitModel, MemberModel } from '../../../models'
import { numberFormat, handleFilter } from '../../../utils'
const idproperty = Number(localStorage.getItem("propertyid"));

const unit_model = new UnitModel()
const member_model = new MemberModel()

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
            unit_code: '',
            member_code: '',
            unit_name: '',
            area_size: '',
            members: [],
            type: '',
            unit_price: 0,
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

        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await unit_model.insertUnit({
                unitName: this.state.unit_name.trim(),
                price: Number(this.state.unit_price),
                areaSize: Number(this.state.area_size),
                type: this.state.type.trim(),
                property: idproperty
            })

            if (res.code === 200) {
                Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                this.props.history.push(`/properties/${idproperty}/unit`)
            } else {
                this.setState({ loading: false, }, () => {
                    Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                })
            }
        })
    }

    _checkSubmit() {
        if (!this.state.type) {
            Swal.fire({ text: "กรุณาระบุประเภทยูนิต / Please input unit type", icon: "warning", })
            return false
        }
        else if (this.state.area_size === '') {
            Swal.fire({ text: "กรุณาระบุขนาด / Please input Area size", icon: "warning", })
            return false
        }
        else if (this.state.unit_name === '') {
            Swal.fire({ text: "กรุณาระบุชื่อ / Please input Name", icon: "warning", })
            return false
        }
        else if (this.state.unit_price === '') {
            Swal.fire({ text: "กรุณาระบุราคา / Please input price", icon: "warning", })
            return false
        }
        else {
            return true
        }
    }


    render() {
        const types = [
            { label: 'ห้องว่าง', value: 'Resident Unit' },
            { label: 'ร้านค้า', value: 'Retails Unit' },
        ]
        return (
            <div>
                <Loading show={this.state.loading} />
                <Card>
                    <CardHeader style={{ backgroundColor: '#634ae2' }}>
                        <h3 className="mb-0 text-white">เพิ่มยูนิต / Add Unit </h3>
                    </CardHeader>
                    <Form onSubmit={this._handleSubmit}>
                        <CardBody>
                            <Row>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>ชื่อยูนิต <font color="#F00"><b>*</b></font></label>
                                        <Input
                                            type="text"
                                            value={this.state.unit_name}
                                            onChange={(e) => {
                                                this.setState({
                                                    unit_name: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>ประเภทยูนิต <font color="#F00"><b>*</b></font></label>
                                        <Select
                                            options={types}
                                            value={this.state.type}
                                            onChange={(e) => this.setState({ type: e })}
                                        />
                                        <p className="text-muted">Example : บ้าน</p>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>ขนาด <font color="#F00"><b>*</b></font></label>
                                        <Input
                                            type="text"
                                            className="float text-center"
                                            value={this.state.area_size}
                                            onChange={(e) => {
                                                if (handleFilter.inputFilter(e)) {
                                                    this.setState({
                                                        area_size: e.target.value
                                                    })
                                                }
                                            }} />

                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>ราคา <font color="#F00"><b>*</b></font></label>
                                        <Input
                                            type="text"
                                            className="float text-center"
                                            value={this.state.unit_price}
                                            onChange={(e) => {
                                                if (handleFilter.inputFilter(e)) {
                                                    this.setState({
                                                        unit_price: e.target.value
                                                    })
                                                }
                                            }} />

                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter className="text-right">
                            <Button type="submit" color="success">Save</Button>
                            <Link to={`/properties/${idproperty}/unit`}><Button type="button">Back</Button></Link>
                        </CardFooter>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Insert