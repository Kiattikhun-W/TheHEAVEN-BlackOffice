import React from 'react'
import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap'
import Swal from 'sweetalert2'

import GLOBAL from '../../../../GLOBAL'

import { numberFormat, timeFormat, } from '../../../../utils'

import { TransferProofModel,MediaModel } from '../../../../models'

const transfer_proof_model = new TransferProofModel()
const media_model = new MediaModel()


class PaymentDetailModal extends React.Component {
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
      transferProofs_verify_remark: '',
      status: '',
      medias:[],
      expenseId:'',
    }
  }

  componentDidUpdate(props_old) {
    !props_old.show && this.props.show && this._onShow()
  }

  _onShow = async () => {
    const { transferId, } = this.props


    const transferProofs = await transfer_proof_model.getTransferProofByCode({ id: Number(transferId), })

    if (transferProofs.code !== 200) {
      Swal.fire({ title: "ข้อผิดพลาด !", text: 'ไม่สามารถโหลดข้อมูล', icon: "error", })
      this._handleClose()
    } else if (transferProofs.result.length === 0) {
      Swal.fire({ title: "ไม่พบรายการนี้ในระบบ !", text: transferId, icon: "warning", })
      this._handleClose()
    } else {

      console.log("transferProofs", transferProofs)
      const {
        id,
        expense,
        user,
        imageId,
        createdAt
        
      } = transferProofs.result[0]
      let media_path = transferProofs.result[0].image.path

        this.setState({
          transferId,
          expenseId:expense.id,
          expenseNo:expense.expenseNo,
          transferProofs_date: timeFormat.validateDate(createdAt),
          userfullname:user.firstname+ " "+user.lastname,
          expense_total: numberFormat.decimalFix(expense.expense_total, 2),
          // transferProofs_number,
          image: `${GLOBAL.BASE_SERVER.URL_IMG}${(media_path || 'default.png')}`,
          transferProofs_verify_remark:'',
          // status,
        })
      }
    }
  

  _handleValid = () => this.props.onVerify({
    transferId: this.state.transferId,
    expenseId:this.state.expenseId,
    expenseNo: this.state.expenseNo,
    transferProofs_verify_remark: this.state.transferProofs_verify_remark.trim(),
    transferProofs_verify_status: 'Confirmed',
  })

  _handleInvalid = () => {
    if (!this.state.transferProofs_verify_remark) {
      Swal.fire({ text: "กรุณาระบุหมายเหตุ / Please input Remark", icon: "warning", })
    } else {
      this.props.onVerify({
        transferId: this.state.transferId,
        expenseId:this.state.expenseId,
        expenseNo: this.state.expenseNo,
        transferProofs_verify_remark: this.state.transferProofs_verify_remark.trim(),
        transferProofs_verify_status: 'Rejected',
      })
    }
  }

  _handleClose = () => this.props.onClose()

  render() {
    return (
      <Modal size="md" centered isOpen={this.props.show} toggle={this._handleClose}>
        <ModalHeader toggle={this._handleClose}>ตรวจสอบรายการ</ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <table>
                <tbody>                  
                  <tr>
                    <td style={{ width: 100, }}><b>เลขที่ใบแจ้งชำระ</b></td>
                    <td>{this.state.expenseNo} </td>
                  </tr>
                  <tr>
                    <td><b>ชำระโดย </b></td>
                    <td>{this.state.userfullname} </td>
                  </tr>
                  <tr>
                    <td><b>ชำระเมื่อ </b></td>
                    <td>{timeFormat.showDateTimeTH(this.state.transferProofs_date)}</td>
                  </tr>
                  <tr>
                    <td><b>ยอดเงิน </b></td>
                    <td>{numberFormat.decimalFix(this.state.expense_total, 2)}</td>
                  </tr>
                </tbody>
              </table>
            </CardBody>
          </Card>
          <Card className="m-0">
            <CardBody>
              <img className="w-100" src={this.state.image} alt="slip" />
            </CardBody>
          </Card>
          <label>หมายเหตุ</label>
          <Input
            type="textarea"
            value={this.state.transferProofs_verify_remark}
            onChange={(e) => this.setState({ transferProofs_verify_remark: e.target.value })}
          />
          <p className="text-muted m-0">Example : -.</p>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="success" onClick={this._handleValid}>ยืนยันรายการ</Button>
          <Button type="button" color="danger" onClick={this._handleInvalid}>รายการไม่ถูกต้อง</Button>
          <Button type="button" onClick={this._handleClose}>ยกเลิก</Button>
        </ModalFooter>
      </Modal>
    )
  }
}
  


export default PaymentDetailModal