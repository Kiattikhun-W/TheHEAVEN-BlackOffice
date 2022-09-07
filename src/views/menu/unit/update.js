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

import { Loading, DataTable, Select } from '../../../components/heaven-strap'
import { numberFormat, handleFilter } from '../../../utils'

import { UnitModel, UnitMemberModel, MemberModel } from '../../../models'
import { Tabs, Drawer, Space, } from 'antd';
import AddMember from './components/addmember'

const { TabPane } = Tabs;

const unit_model = new UnitModel()
const unit_member_model = new UnitMemberModel()
const member_model = new MemberModel()
const idproperty = Number(localStorage.getItem("propertyid"));



class Update extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      id: '',
      type: '',
      visible: false,
      code_validate: {
        value: '',
        status: '',
        class: '',
        text: '',
      },
      price: 0,
      areaSize: 0,
      unitName: '',
      unit_members: [],
      unit_member_code: '',
      member_idcard: '',
      member_code: '',
      member_name: '',
      member_lastname: '',
      member_infos: [],
      member_role: 'Owner',
      unitCode: '',
      visbleMemberInput: false,
      visibleFooter: true,
      tab_key: {
        general: '1',
        member: '2',
      },
    }
  }


  componentDidMount() {
    this._fetchData()
    // this._fetchUnitMemberData()
  }


  _fetchData = async () => {
    const now = new Date()
    const { code } = this.props.match.params
    const units = await unit_model.getUnitByCode({ id: Number(code) })

    if (units.code !== 200) {
      Swal.fire({ title: "ข้อผิดพลาด !", text: 'ไม่สามารถโหลดข้อมูล', icon: "error", })
      this.props.history.push(`/properties/${idproperty}/unit`)
    } else if (units.result[0].length === 0) {
      Swal.fire({ title: "ไม่พบรายการนี้ในระบบ !", text: code, icon: "warning", })
      this.props.history.push(`/properties/${idproperty}/unit`)
    } else {
      const {
        id,
        type,
        unitName,
        areaSize,
        price,
      } = units.result[0]
      const unit_members = await unit_member_model.getUnitMemberBy({
        unit: Number(id),
        orderby: 'ASC',
        limit: 500
      })
      this.setState({
        loading: false,
        id,
        type,
        unit_members: unit_members.result[0],
        unitName,
        areaSize,
        price,
        unitCode: Number(code),
        // unit_member_code: last_code.data
      })
    }
  }

  _handleSubmit = (event) => {
    event.preventDefault()

    this._checkSubmit() && this.setState({ loading: true, }, async () => {
      const res = await unit_model.updateUnitBy(Number(this.state.id), {
        type: this.state.type.trim(),
        price: Number(this.state.price),
        areaSize: Number(this.state.areaSize),
        unitName: this.state.unitName,
      })

      if (res.code === 200) {
        Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
        this.props.history.push(`/properties/${idproperty}/unit`)

      } else {
        this.setState({
          loading: false,
        }, () => {
          Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
          // this.props.history.push(`/properties/${idproperty}/unit`)
        })
      }
    })
  }


  _checkSubmit() {
    if (!this.state.type) {
      Swal.fire({ text: "กรุณาระบุประเภทยูนิต / Please input unit type", icon: "warning", })
      return false
    }
    else if (this.state.areaSize === '') {
      Swal.fire({ text: "กรุณาระบุขนาด / Please input Area size", icon: "warning", })
      return false
    }
    else if (this.state.unitName === '') {
      Swal.fire({ text: "กรุณาระบุชื่อ / Please input Name", icon: "warning", })
      return false
    }
    else if (this.state.price === '') {
      Swal.fire({ text: "กรุณาระบุราคา / Please input price", icon: "warning", })
      return false
    }
    else {
      return true
    }
  }

  _onDelete = (code) =>
    Swal.fire({
      title: "คุณแน่ใจหรือไม่ ?",
      text: "ยืนยันลบรายการนี้",
      icon: "warning",
      showCancelButton: true,
    }).then(
      ({ value }) =>
        value &&
        this.setState({ loading: true }, async () => {
          const res = await unit_member_model.deleteUnitMemberByCode(Number(code));
          if (res.code === 200) {
            Swal.fire({ title: "ลบรายการแล้ว !", text: "", icon: "success" });
            this._fetchData();
          } else {
            this.setState({ loading: false }, () => {
              Swal.fire({
                title: "เกิดข้อผิดพลาด !",
                text: "ไม่สามารถดำเนินการได้ !",
                icon: "error",
              });
            });
          }
        })
    );



  setVisible = () => {
    this.setState({ visible: true })
  }
  onClose = () => {
    this.setState({
      visible: false,
      member_name: '',
      member_code: '',
      member_lastname: '',
      visbleMemberInput: false,
      code_validate: { value: '', status: '', class: '', text: '', },
      member_idcard: '',
    })
  };
  _visbleMemberInput = () => {
    this.setState({ visbleMemberInput: true })
  }

  _handleUnSusses = () => alert("ยังไม่เสร็จครับ")

  callback = (key) => {
    console.log("key is", key)
    if (key === "1") {
      this.setState({ visibleFooter: true })
    } else this.setState({ visibleFooter: false })
  }
  _handleFooter = () => {
    return this.state.visibleFooter === true ? (
      <CardFooter className="text-right">
        <Button type="submit" color="success">Save</Button>
        <Link to={`/properties/${idproperty}/unit`}><Button type="button">Back</Button></Link>
      </CardFooter>
    ) : null
  }
  _onSuccess = async () => {
    const units = await unit_model.getUnitByCode({ id: Number(this.state.unitCode) })
    if (units.code !== 200) {
      Swal.fire({ title: "ข้อผิดพลาด !", text: 'ไม่สามารถโหลดข้อมูล', icon: "error", })
      this.props.history.push(`/properties/${idproperty}/unit`)
    } else if (units.result[0].length === 0) {
      Swal.fire({ title: "ไม่พบรายการนี้ในระบบ !", text: this.state.unitCode, icon: "warning", })
      this.props.history.push(`/properties/${idproperty}/unit`)
    } else {
      const {
        id,
        type,
        unitName,
        areaSize,
        price,
      } = units.result[0]
      const unit_members = await unit_member_model.getUnitMemberBy({
        unit: Number(id),
        orderby: 'ASC',
        limit: 500
      })


      this.setState({
        loading: false,
        id,
        type,
        unit_members: unit_members.result[0],
        unitName,
        areaSize,
        price,
        unitCode: this.state.unitCode,
        // unit_member_code: last_code.data
      })
    }

  }


  render() {
    const { permission_add, permission_edit, permission_delete, } = this.props.PERMISSION

    const unit_types = [
      { value: '', label: '- โปรดเลือกประเภทยูนิต -' },
      { label: 'ห้องว่าง', value: 'Resident Unit' },
      { label: 'ร้านค้า', value: 'Retails Unit' },
    ]
    return (
      <div>
        <Loading show={this.state.loading} />
        <Card>
          <CardHeader>
            <h3 className="mb-0">แก้ไขยูนิต / Update Unit</h3>
          </CardHeader>
          <Form onSubmit={this._handleSubmit}>
            <CardBody>
              <Tabs defaultActiveKey='1' onChange={this.callback} type="card">
                <TabPane tab="ทั่วไป" key="1">
                  <Row>
                    <Col md={3}>
                      <FormGroup>
                        <label>ประเภทยูนิต <font color="#F00"><b>*</b></font></label>
                        <Select
                          options={unit_types}
                          value={this.state.type}
                          onChange={(e) => this.setState({ type: e })}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <FormGroup>
                        <label>ชื่อยูนิต <font color="#F00"><b>*</b></font></label>
                        <Input
                          type="text"
                          value={this.state.unitName}
                          required
                          onChange={(e) => {
                            this.setState({
                              unitName: e.target.value,
                            });
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <FormGroup>
                        <label>ขนาด <font color="#F00"><b>*</b></font></label>
                        <Input
                          type="text"
                          className="float text-center"
                          value={this.state.areaSize}
                          required
                          onChange={(e) => {
                            if (handleFilter.inputFilter(e)) {
                              this.setState({
                                areaSize: e.target.value
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
                          value={this.state.price}
                          required
                          onChange={(e) => {
                            if (handleFilter.inputFilter(e)) {
                              this.setState({
                                price: e.target.value
                              })
                            }
                          }} />

                      </FormGroup>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="สมาชิก" key="2">
                  <AddMember unitId={this.state.id} onSuccess={this._onSuccess} />
                  <DataTable
                    // onChange={this._fetchUnitMemberData}
                    showRowNo={false}
                    dataSource={this.state.unit_members.item}
                    pagination={false}
                    rowKey="id"
                    columns={[
                      {
                        title: "ชื่อลูกบ้าน",
                        dataIndex: "user_fullname",
                        filterAble: true,
                        ellipsis: true,
                      },
                      {
                        title: "ประเภทสมาชิก",
                        dataIndex: "unitRole",
                        ellipsis: true,
                        // render:(cell)=>(cell==='owner'?'เจ้าของห้อง':cell==='resident' ?'ลูกบ้าน' : 'ผู้เช่า')
                      },
                      {
                        title: '',
                        dataIndex: '',
                        render: (cell) => {
                          const row_accessible = []

                          if (permission_delete) {
                            row_accessible.push(
                              <button key="delete" type="button" className="icon-button color-danger" onClick={() => this._onDelete(cell.id)} title="ลบรายการ">
                                <i className="fa fa-trash" aria-hidden="true" />
                              </button>
                              // <button key="delete" type="button" className="icon-button color-danger" onClick={this._handleUnSusses} title="ลบรายการ">
                              //   <i className="fa fa-trash" aria-hidden="true" />
                              // </button>
                            )
                          }

                          return row_accessible
                        },
                        width: 80,
                      },
                    ]}
                  />

                </TabPane>
              </Tabs>
            </CardBody>
            {this._handleFooter()}

          </Form>
        </Card>
      </div>
    )
  }
}

export default Update