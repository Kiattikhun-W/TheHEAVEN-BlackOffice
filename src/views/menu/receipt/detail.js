import { Button, Card, PageHeader } from "antd";
// import { from } from "core-js/core/array";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReceiptTheHeavenModel, ExpenseListModel } from "../../../models";
import Swal from "sweetalert2";
import { numberFormat, timeFormat } from "../../../utils";
import { useReactToPrint } from "react-to-print";
import {
FilePdfOutlined
} from "@ant-design/icons";
import {
  CardHeader
} from 'reactstrap'
const receipt_model = new ReceiptTheHeavenModel();
const idproperty = localStorage.getItem("propertyid");
const expense_list_model = new ExpenseListModel();
function Detail(props) {
  const [receipts, setRecipients] = useState([]);
  const [expenseLists, setExpenseList] = useState([]);

  //   // const [loading, setLoading] = useRecoilState<boolean>(loadingState);
  const printRef = useRef();
  const history = useHistory();
  //   const receiptId = Number(props.match.params.id) || 0;
  //   const formatDate = "DD/MM/YYYY";


  useEffect(() => {
    _fetchData();
    // eslint-disable-next-line
  }, []);
  const _fetchData = async () => {
    const { code } = props.match.params;

    const receipts = await receipt_model.getReceiptByCode({ id: code });

    console.log(receipts);

    if (receipts.code !== 200) {
      Swal.fire({
        title: "ข้อผิดพลาด !",
        text: "ไม่สามารถโหลดข้อมูล",
        icon: "error",
      });
      props.history.push(`/properties/${idproperty}/receipt`);
    } else if (receipts.result.length === 0) {
      Swal.fire({
        title: "ไม่พบรายการนี้ในระบบ !",
        text: code,
        icon: "warning",
      });
      props.history.push(`/properties/${idproperty}/receipt`);
    } else {
      const expense_lists = await expense_list_model.getExpenseListBy({
        expenseId: receipts?.result[0].expense.id,
      })
      setRecipients(receipts?.result[0])
      setExpenseList(expense_lists?.result[0].item)
      // console.log("expense_lists",expense_lists)

    }
  };
  const handlePrintReceipt = useReactToPrint({
    content: () => printRef.current,
  });



  return (
    <div>
      <PageHeader
        // title={<h1>ใบเสร็จรับเงิน</h1>}
        extra={[
          <Button
            size="large"
            onClick={() => {
              history.goBack();
            }}
          >
            Cancel
          </Button>,
          <Button
            size="large"
            danger
            icon={<FilePdfOutlined />}
            htmlType="submit"
            onClick={handlePrintReceipt}
          >
            Print
          </Button>,
        ]}
      ></PageHeader>
      

      <div className="invoice-box bg-white" ref={printRef} >
        <style type="text/css" media="print">
          {"\
   @page { size: landscape;}\
"}
        </style>
        <table cellpadding="0" cellspacing="0">
          <tr className="top">
            <td colspan="4">
              <table>
                <tr>
                  <td className="title">
                    <img src="https://media.discordapp.net/attachments/914042035802112061/931939477503508610/254337478_571291797460516_304746305366841547_n.png" style={{ width: "50%", maxWidth: "300px" }} alt="logo" />
                  </td>
                  <td>
                  <b style={{color:'#634ae2'}}>เลขที่ใบเสร็จ: </b> {receipts?.receiptNo && receipts?.receiptNo}<br />
                  <b style={{color:'#634ae2'}}>วันเริ่มรอบบิล:</b> {timeFormat.showFullDateTH(receipts.expense?.expense_startdate)}<br />
                  <b style={{color:'#634ae2'}}> วันสิ้นสุดรอบบิล:</b> {timeFormat.showFullDateTH(receipts.expense?.expense_enddate)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr className="information">
            <td colspan="4">
              <table>
                <tr>
                  <td>
                    <span style={{color:'#634ae2'}}>ประเภทห้อง</span> {receipts.expense?.unit?.type && receipts.expense?.unit?.type === 'Retails Unit' ? ': ห้องเช่า' : ': ห้องพักอาศัย'}<br />
                    <span style={{color:'#634ae2'}}> เลขที่ห้อง :</span> {receipts.expense?.unit?.unitName && receipts.expense?.unit?.unitName}<br />
                  </td>

                  <td>
                    {receipts.expense?.unitUser.user
                      ? `${receipts.expense.unitUser.user.firstname} ${receipts.expense.unitUser.user.lastname}`
                      : "ไม่มีเจ้าของห้อง"}
                    <br />
                    {receipts.expense?.unitUser.user.phone}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr className="heading">
            <td>ชื่อรายการ</td>
            <td style={{textAlign:'center'}}>หน่วยที่ใช้</td>
            <td>ราคา</td>
            <td>ราคารวม</td>
          </tr>

          {/* <tr className="item">
            <td>Website design</td>

            <td>$300.00</td>
          </tr> */}
          {expenseLists &&
            expenseLists.map((item, index) => (
              <React.Fragment key={index}>
                <tr className="item">
                  <td>
                    {item.expense_list_name}
                  </td>
                  <td style={{textAlign:'center'}}> 
                    {item.expense_list_unit} 
                  </td>
                  <td>
                    {numberFormat.decimalFix(item.expense_list_price, 2) + " บาท"}
                  </td>
                  <td width={140}>
                    {numberFormat.decimalFix(item.expense_list_total, 2) + " บาท"}
                  </td>
                </tr>
              </React.Fragment>
            ))}



          {/* <tr className="item">
            <td>Hosting (3 months)</td>

            <td>$75.00</td>
          </tr>

          <tr className="item last">
            <td>Domain name (1 year)</td>

            <td>$10.00</td>
          </tr> */}

          <tr className="total" >     
            <td></td>
            <td></td>       
            <td></td> 
            <td  style={{width:100}}><b style={{color:'#634ae2'}}>รวมทั้งสิ้น</b> <br/> {numberFormat.decimalFix(receipts.expense?.expense_total && receipts.expense?.expense_total, 2) + " บาท"}</td>
          </tr>
        </table>
      </div>
    </div >

  );
}

export default Detail;
