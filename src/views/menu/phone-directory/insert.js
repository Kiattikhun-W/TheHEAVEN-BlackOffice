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

import { PhoneDirectoryModel } from '../../../models'

const phone_directory_model = new PhoneDirectoryModel()

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
            phone_directory_name: '',
            phone_directory_tel: '',
            phone_directory_code: '',
            phone_directory_type: '',
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
        const idproperty = Number(localStorage.getItem("propertyid"));
        event.preventDefault()


        this._checkSubmit() && this.setState({ loading: true, }, async () => {
            const res = await phone_directory_model.insertPhoneDirectory({
                phoneName: this.state.phone_directory_name.trim(),
                phoneNumber: this.state.phone_directory_tel,
                type: this.state.phone_directory_type.trim(),
                property: idproperty,
            })

            if (res.code === 200) {
                Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                this.props.history.push(`/properties/${idproperty}/phonedirectory`)
            } else {
                this.setState({ loading: false, }, () => {
                    Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                })
            }
        })
    }

    _checkSubmit() {
        if (!this.state.phone_directory_type) {
            Swal.fire({ text: 'กรุณากรอกประเภทเบอร์โทร', icon: "warning", })
            return false
        }
        else {
            return true
        }
    }



    render() {
        const idproperty = localStorage.getItem("propertyid");
        const phone_directory_type_options = [
            { label: '- เลือกประเภท -', value: '' },
            { value: "Internal", label: "เบอร์ภายใน" },
            { value: "External", label: "เบอร์ภายนอก" },
        ];
        return (
            <div>
                <Loading show={this.state.loading} />
                <Card>
                    <CardHeader style={{ backgroundColor: '#634ae2' }}>
                        <h3 className="mb-0 text-white">เพิ่มเบอร์โทร / Add PhoneDirectory </h3>
                    </CardHeader>
                    <Form onSubmit={this._handleSubmit}>
                        <CardBody>
                            <Row>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>ชื่อ <font color="#F00"><b>*</b></font></label>
                                        <Input
                                            type="text"
                                            value={this.state.phone_directory_name}
                                            onChange={(e) => this.setState({ phone_directory_name: e.target.value })}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>เบอร์โทรศัพท์ <font color="#F00"><b>*</b></font></label>
                                        <Input
                                            type="text"
                                            value={this.state.phone_directory_tel}
                                            onChange={(e) => this.setState({ phone_directory_tel: e.target.value })}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>ประเภท <font color="#F00"><b>*</b></font></label>
                                        <Select
                                            options={phone_directory_type_options}
                                            value={this.state.phone_directory_type}
                                            onChange={(e) => this.setState({ phone_directory_type: e })}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter className="text-right">
                            <Button type="submit" color="success">Save</Button>
                            <Link to={`/properties/${idproperty}/phonedirectory`}><Button type="button">Back</Button></Link>
                        </CardFooter>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Insert