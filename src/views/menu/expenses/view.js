import React from "react";
import { Card, CardBody, CardHeader, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Loading, DataTable } from "../../../components/heaven-strap";

import { ExpenseModel, ExpenseListModel, UnitMemberModel } from "../../../models";
import { Pagination, Button } from "antd";
import { numberFormat, timeFormat } from "../../../utils";
const expense_model = new ExpenseModel();
const expense_list_model = new ExpenseListModel();
const unit_member_model = new UnitMemberModel();



class View extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      expenses: [],
      paginationDatas: {
        total: "",
      },
      dataSource: [],
      index_buffers: [],
      pageno: 1,
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData = () =>
    this.setState({ loading: true }, async () => {
      const idproperty = Number(localStorage.getItem("propertyid"));
      const expenses = await expense_model.getExpenseBy({
        propertyId: idproperty,
        page: 1,
        limit: 10,
      });
      this.setState({
        loading: false,
        expenses,
        dataSource: expenses?.result[0],
        paginationDatas: {
          total: expenses?.result[0]?.total,
        },
      });
    });

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
          const res = await expense_model.deleteExpenseByCode(Number(code));
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
  handleChangePagination = async (page, pageSize) => {
    try {
      this.setState({
        loading: true,
      });
      const property = Number(localStorage.getItem("propertyid"));

      const res = await expense_model.getExpenseBy({
        page: page === 0 ? 1 : page,
        limit: pageSize,
        propertyId: property,
      });

      console.log("respag", res.result[0].total);
      if (res.code === 200) {
        this.setState({
          dataSource: res?.result[0],
          loading: false,
          pageno: page,
          paginationDatas: {
            total: res?.result[0]?.total,
          },
        });
      }
    } catch (error) { }
  };
  _sendLine = async () => {
    const { value } = await Swal.fire({
      title: "คุณแน่ใจหรือไม่ ?",
      text: "ยืนยันการส่งแจ้งเตือนไลน์",
      icon: "warning",
      showCancelButton: true,
    })
    console.log("index", this.state.index_buffers)
    value && this._checkSendLine() && this.setState({ loading: true }, async () => {
      let res = await expense_model.sendExpenseLine({
        expenseData: this.state.index_buffers
      })
      console.log("res", res)
      if (res.code === 200) {
        window.location.reload()
        // this._fetchData()
        // this.setState({
        //   index_buffers:[]
        // })
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

    // const res_member = await unit_member_model.getUnitMemberByCode({
    //   id: this.state.index_buffers[0].unit_member_code,
    // });
    // const lineUnitId = res_member.result[0].lineUnitId
    // let Json = InvoiceJson({
    //   username:"asd",
    //   firstname:"asd",
    //   lastname:"sad",
    // })


  }
  _checkSendLine = () => {
    if (this.state.index_buffers.length === 0) {
      Swal.fire({ text: "โปรดเลือกรายการ", icon: "warning" });
      return false;
    }
    if (this.state.index_buffers.find(item => item.user_lineUserId === null)) {
      Swal.fire({ text: "ผู้ใช้ " + this.state.index_buffers.find(item => item.user_lineUserId === null).firstname + " ไม่ได้ลงทะเบียนไลน์", icon: "warning" });
      return false;
    } else {
      return true
    }
  }

  render() {
    const { permission_add, permission_edit, permission_delete } =
      this.props.PERMISSION;
    const idproperty = localStorage.getItem("propertyid");

    return (
      <div>
        <Loading show={this.state.loading} />
        <Card className="cardTable">
          <CardHeader style={{ backgroundColor: "#634ae2" }}>
            <h3 className="text-header text-white">ใบแจ้งหนี้ค้างชำระ </h3>
            {permission_add && (
              <Link
                to={`/properties/${idproperty}/expenses/insert`}
                className="btn btn-success float-right"
              >
                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มใบแจ้งหนี้ค้างชำระ
              </Link>
            )}
          </CardHeader>
          <div >
            <Button type="primary" size="large" className="float-right mr-3 mt-2 mb-2" onClick={this._sendLine} >Line</Button>
          </div>
          <DataTable
            style={{ overflowX: "scorll" }}
            onChange={this._fetchData}
            showRowNo={false}
            dataSource={this.state.dataSource.item}
            bordered={false}
            pagination={false}
            setProps={{ rowSelection: { type: "checkbox", onChange: (selectedRowKeys, selectedRows) => this.setState({ index_buffers: selectedRows, },) } }}
            rowKey="expense_code"
            columns={[
              {
                title: "ชื่อเจ้าของยูนิต",
                dataIndex: "user_fullname",
                filterAble: true,
                ellipsis: true,
                align: "center",
              },
              {
                title: "ยูนิต",
                dataIndex: "unit_name",
                filterAble: true,
                ellipsis: false,
                align: "center",
              },
              {
                title: "วันเริ่มรอบใบแจ้งหนี้ค้างชำระ",
                dataIndex: "expense_startdate",
                ellipsis: false,
                render: (cell) => {
                  return timeFormat.showFullDateTH(cell);
                },
              },

              {
                title: "วันสิ้นสุดรอบใบแจ้งหนี้ค้างชำระ",
                dataIndex: "expense_enddate",
                ellipsis: false,
                render: (cell) => {
                  return timeFormat.showFullDateTH(cell);
                },
              },
              {
                title: "ราคารวม",
                dataIndex: "expense_total",
                ellipsis: false,
                // width: 240,
                render: (cell) => {
                  return numberFormat.decimalFix(cell, 2) + " บาท";
                },
              },
              {
                title: "",
                dataIndex: "",
                render: (cell) => {
                  const row_accessible = [];

                  if (permission_edit) {
                    row_accessible.push(
                      <Link
                        key="update"
                        to={`/properties/${idproperty}/expenses/update/${cell.expense_code}`}
                        title="แก้ไขรายการ"
                      >
                        <button
                          type="button"
                          className="icon-button color-warning"
                        >
                          <i
                            className="fa fa-pencil-square-o"
                            aria-hidden="true"
                          />
                        </button>
                      </Link>
                    );
                  }
                  if (permission_delete) {
                    row_accessible.push(
                      <button
                        key="delete"
                        type="button"
                        className="icon-button color-danger"
                        onClick={() => this._onDelete(cell.expense_code)}
                        title="ลบรายการ"
                      >
                        <i className="fa fa-trash " aria-hidden="true" />
                      </button>
                    );
                  }

                  return row_accessible;
                },
                width: 80,
              },
            ]}
          />
        </Card>
        <div className="paginationTable">
          <Pagination
            total={this.state.paginationDatas?.total}
            showSizeChanger
            showTotal={(total) => `Total ${total} items`}
            defaultPageSize={10}
            current={this.state.pageno}
            onChange={(page, pageSize) =>
              this.handleChangePagination(page, Number(pageSize))
            }
          />
        </div>
      </div>
    );
  }
}

export default View;
