import React from 'react'
import {
  Card,
  CardHeader,
  Col,
  Row,
  CardBody,
  Button,
  CardFooter,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

import GLOBAL from '../../../GLOBAL'

import { Loading, } from '../../../components/heaven-strap'

import { numberFormat, timeFormat, } from '../../../utils'

import { TransferProofModel, } from '../../../models'

const transfer_proof_model = new TransferProofModel()

class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      transferId: '',
      expenseNo: '',
      transferProofs_date: '',
      userfullname: '',
      expense_total: '',
      transferProofs_number: '',
      image: '',
      rejectedNote: '',
      status: '',
      loading: true,
      display_verify_status: '',
      medias: [],
    }
  }

  componentDidMount() {
    this._fetchData()
  }

  _fetchData = async () => {
    const { code } = this.props.match.params

    const transferProofs = await transfer_proof_model.getTransferProofByCode({ id: Number(code), })
    const idproperty = localStorage.getItem("propertyid");

    if (transferProofs.code !== 200) {
      Swal.fire({ title: "ข้อผิดพลาด !", text: 'ไม่สามารถโหลดข้อมูล', icon: "error", })
      this.props.history.push(`/properties/${idproperty}/transferproof`)

    } else if (transferProofs.result.length === 0) {
      Swal.fire({ title: "ไม่พบรายการนี้ในระบบ !", text: code, icon: "warning", })
      this.props.history.push(`/properties/${idproperty}/transferproof`)

    } else {

      console.log("transferProofs", transferProofs)
      const {
        id,
        expense,
        user,
        imageId,
        createdAt,
        status,
        rejectedNote

      } = transferProofs.result[0]
      let display_verify_status = []
      if (status === 'Rejected') {
        display_verify_status = <span className="text-danger">รายการไม่ถูกต้อง</span>
      } else if (status === 'Confirmed') {
        display_verify_status = <span className="text-success">ตรวจสอบแล้ว</span>
      } else {
        display_verify_status = <span className="text-warning">รอตรวจสอบ</span>
      }

      let media_path = transferProofs.result[0].image.path

      this.setState({
        transferId: id,
        loading: false,
        expenseNo: expense.expenseNo,
        status: status,
        transferProofs_date: timeFormat.validateDate(createdAt),
        userfullname: user.firstname + " " + user.lastname,
        expense_total: numberFormat.decimalFix(expense.expense_total, 2),
        // transferProofs_number,
        rejectedNote,
        display_verify_status,
        image: `${GLOBAL.BASE_SERVER.URL_IMG}${(media_path || 'default.png')}`,
        // transferProofs_verify_remark,
        // status,
      })
    }
  }

  render() {
    const idproperty = Number(localStorage.getItem("propertyid"));

    return (
      <div>
        <Loading show={this.state.loading} />
        <Card>
          <CardHeader style={{ backgroundColor: '#634ae2', padding: 17 }}>
            <h3 className="mb-0 text-header text-white">รายละเอียดการชำระเงิน</h3>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={8}>
                <table className="table-sm table-bordered">
                  <tbody>
                    <tr>
                      <td className="text-center" width={160}><b>วันที่รับเงิน </b></td>
                      <td className="text-center" width={180}><b>เลขที่ใบแจ้งชำระ </b></td>
                    </tr>
                    <tr>
                      <td className="text-center">{timeFormat.showFullDateTH(this.state.transferProofs_date)} </td>
                      <td className="text-center">{this.state.expenseNo} </td>
                    </tr>
                  </tbody>
                </table>
                <Card>
                  <CardBody>
                    <table>
                      <tbody>
                        <tr>
                          <td width={120}><b>ชำระโดย</b></td>
                          <td>{this.state.userfullname} </td>
                        </tr>
                        {/* <tr>
                          <td width={120}><b>ลงบัญชี</b></td>
                          <td>{this.state.debit_receipt_name} </td>
                        </tr> */}
                        {/* <tr>
                          <td width={120}><b>เลขที่รายการ</b></td>
                          <td>{this.state.receipt_payment_list_number} </td>
                        </tr> */}
                        <tr>
                          <td><b>ยอดเงิน</b></td>
                          <td>{this.state.expense_total} </td>
                        </tr>
                        <tr>
                          <td><b>สถานะ</b></td>
                          <td>{this.state.display_verify_status} </td>
                        </tr>
                        <tr>
                          <td><b>หมายเหตุ</b></td>
                          <td className="pre-line">{this.state.rejectedNote} </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardBody>
                </Card>
              </Col>
              <Col md={4}>
                <img className="w-100" style={{ maxWidth: 480, }} src={this.state.image} alt="slip" />
              </Col>
            </Row>
            <div className="text-muted small">
              {/* เพิ่มโดย : {this.state.addby_name} {timeFormat.showDateTimeTH(this.state.receipt_payment_list_date)} */}
            </div>
          </CardBody>
          <CardFooter className="text-right">
            <Link to={`/properties/${idproperty}/transferproof/`}><Button type="button">Back</Button></Link>
          </CardFooter>
        </Card>
      </div>
    )
  }
}

export default Detail