import {
    CheckCircleOutlined,
    InfoCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    Button,
    DatePicker,
    Drawer,
    Form,
    Input,
    Modal,
    Switch,
    Space
} from "antd";
import { Loading, DataTable, Select } from '../../../../components/heaven-strap'
import { numberFormat, timeFormat, } from '../../../../utils'

import {
    Col,
    Row,
    FormGroup
} from "reactstrap";
import moment from "moment";
import React, { useEffect, useRef, useState, } from "react";
import { UserModel, UnitMemberModel } from '../../../../models'
import Swal from 'sweetalert2'
import md5 from "md5";
import {
    useHistory,
} from "react-router-dom";

const user_model = new UserModel()
const unit_user_model = new UnitMemberModel()


const AddMember = (props) => {
    const history = useHistory();

    const [state, setState] = useState({
        visible: false,
        isCheck: false,
        findusername: '',
        firstname: '',
        lastname: '',
        username: '',
        phone: '',
        address: '',
        lineUserId: null,
    });
    const idproperty = Number(localStorage.getItem("propertyid"));
    const [loading, setLoading] = useState(false)
    const [visible, setVisbile] = useState(false)
    const [name, setName] = useState('')
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [username, setUserName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [lineUserId, setLineUserId] = useState(null)
    const [findusername, setFindUsername] = useState('')
    const [isCheck, setIsCheck] = useState(false);
    const [isHaveData, setIsHaveData] = useState(false);
    const [unitRole, setUnitRole] = useState('Owner');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');





    const showDrawer = () => {

        setVisbile(true)
    };
    const onClose = () => {
        // setState({
        //     visible: false,
        //     isCheck: false,
        // });
        setIsCheck(false)
        setVisbile(false)
        setFirstName('')
        setLastName('')
        setUserName('')
        setLineUserId(null)
        setPhone('')
        setAddress('')
        setFindUsername('')
        setIsHaveData(false)

    };
    const showInput = (params) => {
        return (
            <>
                <Col md={6} className="my-2">
                    <FormGroup>
                        <label>ชื่อ <font color="#F00"><b>*</b></font></label>
                        <Input
                            className="text-center"
                            size='default'
                            placeholder="ชื่อจริง"
                            type="text"
                            value={firstname}
                            disabled={isHaveData}

                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                <Col md={6} className="my-2">
                    <FormGroup>
                        <label>นามสกุล <font color="#F00"><b>*</b></font></label>
                        <Input
                            className="text-center"
                            size='default'
                            placeholder="นามสกุล"
                            type="text"
                            value={lastname}
                            disabled={isHaveData}

                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                <Col md={6} className="my-2">
                    <FormGroup>
                        <label>Username <font color="#F00"><b>*</b></font></label>
                        <Input
                            className="text-center"
                            size='default'
                            placeholder="ชื่อผู้ใช้"
                            type="text"
                            value={username}
                            disabled={isHaveData}

                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                {/* <Col md={6} className="my-2">
                    <FormGroup>
                        <label>รหัสผ่าน <font color="#F00"><b>*</b></font></label>
                        <Input
                            className="text-center"
                            size='default'
                            placeholder="รหัสผ่าน"
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormGroup>
                </Col> */}
                <Col md={6} className="my-2">
                    <FormGroup>
                        <label>โทรศัพท์ <font color="#F00"><b>*</b></font></label>
                        <Input
                            className="text-center"
                            size='default'
                            placeholder="Phone no."
                            type="number"
                            value={phone}
                            disabled={isHaveData}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                {/* <Col md={6} className="my-2">
                    <FormGroup>
                        <label>ที่อยู่ <font color="#F00"><b>*</b></font></label>
                        <Input
                            className="text-center"
                            size='default'
                            placeholder="Address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </FormGroup>
                </Col> */}
                <Col md={6} className="my-2">
                    <FormGroup>
                        <label>ตำแหน่ง <font color="#F00"><b>*</b></font></label>
                        <Select
                            options={
                                [
                                    { label: 'เจ้าของ', value: 'Owner' },
                                    { label: 'ผู้เช่า', value: 'Tenent' },
                                ]
                            }
                            className="text-center w-100"
                            placeholder="Role"
                            value={unitRole}
                            onChange={(e) => setUnitRole(e)}
                        />
                    </FormGroup>
                </Col>



            </>
        )
    }
    const _findUserByUsername = async () => {
        if (findusername !== '') {
            const res = await user_model.getUserBy({ username: String(findusername) })
            // console.log(res)           
            if (res.code === 200) {
                if (res.result[0].item.length !== 0) {
                    setFirstName(res.result[0].item[0].firstname)
                    setLastName(res.result[0].item[0].lastname)
                    setUserName(res.result[0].item[0].username)
                    setLineUserId(res.result[0].item[0].lineUserId)
                    setPhone(res.result[0].item[0].phone)
                    setAddress(res.result[0].item[0].address)
                    setUserId(res.result[0].item[0].id)
                    setIsHaveData(true)
                } else {
                    setFirstName('')
                    setLastName('')
                    setUserName('')
                    setLineUserId(null)
                    setPhone('')
                    setAddress('')
                    setIsHaveData(false)

                }
            }
        } else {
            setFindUsername('')
            setFirstName('')
            setLastName('')
            setUserName('')
            setLineUserId(null)
            setPhone('')
            setAddress('')
            setIsHaveData(false)
        }
        setIsCheck(true)
    }
    const _handleSubmit = async () => {
        let res1 = []
        let res = []
        console.log("isHaveData", isHaveData)
        if (isHaveData) {
            let findDuplicate = await unit_user_model.getUnitMemberBy({
                unit: Number(props.unitId),
                user: Number(userId),
            })
            // console.log("findDuplicate.result[0].total>1",findDuplicate.result[0].total)
            if (findDuplicate.code === 200) {
                if (findDuplicate.result[0].total >= 1) {
                    await Swal.fire({ title: "มีรายชื่อนี้อยู่ในยูนิตแล้ว !", text: "ไม่สามารถดำเนินการได้ !", icon: "warning", })
                } else {
                    res1 = await unit_user_model.insertUnitMember({
                        unit: Number(props.unitId),
                        user: Number(userId),
                        unitRole
                    })
                    if (res1.code === 200) {
                        Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                        // history.push(`/properties/${idproperty}/unit`)
                        onClose()
                        props.onSuccess()
                    }
                    else {
                        setLoading(false)
                        Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                    }
                }
            }
        } else {
            console.log("asd")
            if (_checkSubmit()) {
                const res = await user_model.insertUser({
                    role: 'user',
                    firstname,
                    lastname,
                    username,
                    phone,
                    address,
                    password: md5(123456),
                    lineUnit: 1,
                    isActivate: true,
                    // foradd
                    isHaveData,
                    unit: Number(props.unitId),
                    unitRole,
                    lineUserId,

                })
                if (res.code === 200) {
                    Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
                    // history.push(`/properties/${idproperty}/unit`)
                    onClose()
                    props.onSuccess()
                } else {
                    setLoading(false)
                    Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
                }
            }




        }
    }
    const _checkSubmit = () => {
        if (firstname === '') {
            console.log("chekc")
            Swal.fire({ text: 'โปรดระบุชื่อ', icon: "warning", })
            return false
        } else if (lastname === '') {
            Swal.fire({ text: 'โปรดระบุนามสกุล', icon: "warning", })
            return false
        } else if (username === '') {
            Swal.fire({ text: 'โปรดระบุชื่อผู้ใช้', icon: "warning", })
            return false
        }
        else if (phone === '') {
            Swal.fire({ text: 'โปรดเลือกเวลาเบอร์โทรศัพท์', icon: "warning", })
            return false
        } else if (unitRole === '') {
            Swal.fire({ text: 'โปรดระบุตำแหน่ง', icon: "warning", })
            return false
        }
        else {
            return true
        }
    }




    useEffect(() => {
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <Button
                className="mb-2"
                size="default"
                type="primary"
                onClick={showDrawer}
                icon={<PlusOutlined />}
            >
                เพิ่มสมาชิก
            </Button>
            <Drawer
                title={`เพิ่มลูกบ้าน`}
                width={820}
                visible={visible}
                closable={false}
                onClose={onClose}
                bodyStyle={{
                    paddingBottom: 80,
                    overflow: 'auto'
                }}
                zIndex={1030}
                extra={
                    <Space>
                        <Button onClick={onClose}>ยกเลิก</Button>
                        <Button type="primary" onClick={_handleSubmit}>
                            บันทึก
                        </Button>
                    </Space>
                }
            >
                <Row>
                    <Col md={10}>
                        <Input
                            className="text-center"
                            size='large'
                            placeholder="Username"
                            type="text"
                            value={findusername}
                            onChange={(e) => {
                                setFindUsername(e.target.value)
                            }
                            }
                        />
                    </Col>
                    <Col md={2}>
                        <Button size='large' type="primary" onClick={_findUserByUsername} >
                            ค้นหา
                        </Button>
                    </Col>
                    {isCheck ? showInput() : null}
                </Row>
            </Drawer>
        </div>
    );
};

export default AddMember;
