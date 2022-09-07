import React from "react";
import { CardBody, CardHeader, FormGroup, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Loading, DataTable } from "../../../components/heaven-strap";

import { TransferProofModel, ReceiptTheHeavenModel } from "../../../models";
import { Pagination, Tag, Button, Card } from "antd";
import { numberFormat, timeFormat } from "../../../utils";
import { PaymentListModal, } from './components'

const transfer_proof_model = new TransferProofModel();
const receipt_model = new ReceiptTheHeavenModel();


class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      transfer_proofs: [],
      paginationPendingDatas: {
        total: "",
      },
      paginationNotPendingDatas: {
        total: "",
      },
      show_modal: false,
      dataSource: [],
      dataSourcePending: [],
      dataSourceNotPending: [],
      pageNoNotPending: 1,
      transferId: 0,
      units: [],
      pageNoPending: 1,
      index_buffers: []
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData = () =>
    this.setState({ loading: true }, async () => {
      const idproperty = Number(localStorage.getItem("propertyid"));
      const transfer_pendings = await transfer_proof_model.getTransferProofBy({
        status: 'Pending',
        propertyId: idproperty,
        page: 1,
        limit: 10,
      });
      const transfer_NotPendings = await transfer_proof_model.getTransferProofBy({
        statusNotIn: 'Pending',
        propertyId: idproperty,
        page: 1,
        limit: 10,
      });

      console.log("dataSourcePending", transfer_pendings)

      this.setState({
        loading: false,
        transfer_pendings,
        dataSourcePending: transfer_pendings.result[0],
        dataSourceNotPending: transfer_NotPendings.result[0],
        paginationPendingDatas: {
          total: transfer_pendings.result[0].total,
        },
        paginationNotPendingDatas: {
          total: transfer_NotPendings.result[0].total,
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
          const res = await transfer_proof_model.deleteTransferProofByCode(Number(code));
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
  handleChangePendingPagination = async (page, pageSize) => {
    try {
      this.setState({
        loading: true,
      });
      const property = Number(localStorage.getItem("propertyid"));

      const res = await transfer_proof_model.getTransferProofBy({
        status: 'Pending',
        page: page === 0 ? 1 : page,
        limit: pageSize,
        propertyId: property,
      });

      if (res.code === 200) {
        this.setState({
          dataSourcePending: res.result[0],
          loading: false,
          pageNoPending: page,
          paginationPendingDatas: {
            page: res.result[0].page,
            limit: res.result[0].limit,
            total: res.result[0].total,
          },
        });
      }
    } catch (error) { }
  };
  handleChangeNotPendingPagination = async (page, pageSize) => {
    try {
      this.setState({
        loading: true,
      });
      const property = Number(localStorage.getItem("propertyid"));

      const res = await transfer_proof_model.getTransferProofBy({
        statusNotIn: 'Pending',
        page: page === 0 ? 1 : page,
        limit: pageSize,
        propertyId: property,
      });

      console.log("respag", res.result[0].total);
      if (res.code === 200) {
        this.setState({
          dataSourceNotPending: res.result[0],
          loading: false,
          pageNoNotPending: page,
          paginationNotPendingDatas: {
            page: res.result[0].page,
            limit: res.result[0].limit,
            total: res.result[0].total,
          },
        });
      }
    } catch (error) { }
  };

  _onVerify = async (e) => {
    const { value } = e.transferProofs_verify_status === 'Rejected' ? await Swal.fire({
      title: "คุณแน่ใจหรือไม่ ?",
      text: "ยืนยันไม่อนุมัติรายการนี้",
      icon: "warning",
      showCancelButton: true,
    }) : await Swal.fire({
      title: "คุณแน่ใจหรือไม่ ?",
      text: "ยืนยันอนุมัติรายการนี้",
      icon: "warning",
      showCancelButton: true,
    })

    // console.log(value)

    value && this.setState({ loading: true, }, async () => {
      if (e.transferProofs_verify_status === 'Rejected') {
        console.log(e.transferProofs_verify_status)
        const res = await transfer_proof_model.updateTransferProofBy(Number(e.transferId), {
          rejectedAt: timeFormat.dateTimeToStr(new Date()),
          rejectedNote: e.transferProofs_verify_remark,
          status: e.transferProofs_verify_status,
        })
        if (res.code === 200) {
          console.log(res)
          Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
          this.setState({ show_modal: false, transferId: '', }, async () => {
            await transfer_proof_model.sendRejectedTransfer({
              id: Number(e.transferId),
            })
            this._fetchData()
          })
        } else {
          this.setState({ loading: false, }, () => {
            Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
          })
        }
      } else {
        const res = await transfer_proof_model.updateTransferProofBy(Number(e.transferId), {
          confirmedAt: timeFormat.dateTimeToStr(new Date()),
          rejectedNote: e.transferProofs_verify_remark,
          status: e.transferProofs_verify_status,
        })
        if (res.code === 200) {
          console.log("e.expenseId", e.transferId)
          Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", })
          this.setState({ show_modal: false, transferId: '', }, async () => {
            await receipt_model.insertReceipt({
              expense: Number(e.expenseId),
              receiptNo: new Date().getTime().toString()
            })
            await transfer_proof_model.sendConfirmTransfer({
              id: Number(e.transferId),
            })
            this._fetchData()
          })
        } else {
          this.setState({ loading: false, }, () => {
            Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
          })
        }
      }
    })
  }



  render() {
    const { permission_add, permission_edit, permission_delete } =
      this.props.PERMISSION;
    const idproperty = localStorage.getItem("propertyid");

    return (
      <div>
        <Loading show={this.state.loading} />
        <Card className="cardTable" >
          <CardHeader style={{ backgroundColor: "#f0ad4e" }}>
            <h3 className="text-header text-white">รายการตรวจสอบ / List to do </h3>
            {/* {permission_add && (
              <Link
                to={`/properties/${idproperty}/transferproof/insert`}
                className="btn btn-success float-right"
              >
                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มรายการ
              </Link>
            )} */}

          </CardHeader>

          <DataTable
            style={{ overFlow: 'auto' }}
            onChange={this._fetchData}
            showRowNo={false}
            dataSource={this.state.dataSourcePending.item}
            bordered={false}
            pagination={false}
            // setProps={{ rowSelection: { type: "checkbox", onChange: (selectedRowKeys, selectedRows) => this.setState({ index_buffers: selectedRows, },) } }}
            rowKey="id"
            columns={[
              {
                title: "เลขที่ใบแจ้งหนี้",
                dataIndex: ["expense", "expenseNo"],
                // filterAble: true,
                ellipsis: true,
                align: "center",
              },
              {
                title: "สถานะ",
                dataIndex: "status",
                ellipsis: false,
                align: "center",
                render: (cell) => {
                  if (cell === 'Pending') {
                    return (<Tag color="yellow">รอตรวจสอบ</Tag>)
                  }
                  else if (cell === 'Confirmed') {
                    return (
                      <Tag color="#87d068">ตรวจสอบแล้ว</Tag>
                    )
                  } else {
                    return <Tag color="#f50">ไม่ถูกต้อง</Tag>
                  }
                },
              },
              {
                title: "ชำระเมื่อ",
                dataIndex: "createdAt",
                ellipsis: false,
                align: 'center',
                render: (cell) => timeFormat.showFullDateTimeTH(cell)
              },

              {
                title: "จำนวนเงิน",
                dataIndex: ["expense", "expense_total"],
                ellipsis: false,
                align: 'center',
                render: (cell) => {
                  return numberFormat.decimalFix(cell, 2)
                }
              },
              {
                title: "ชำระโดย",
                dataIndex: ["user"],
                ellipsis: false,
                align: 'center',
                render: (cell) => {
                  return cell.firstname + " " + cell.lastname
                }
              },
              {
                title: 'ตรวจสอบ',
                dataIndex: '',
                align: "center",
                width: 90,

                render: (row) => {
                  // console.log(row.id)
                  return (
                    <button
                      type="button"
                      className="icon-button color-primary"
                      onClick={() => this.setState({ show_modal: true, transferId: row.id, })}
                    >
                      <i className="fa fa-search" aria-hidden="true" />
                    </button>
                  )
                }
              },


            ]}
          />
        </Card>
        <div className="paginationTable">
          <Pagination
            total={this.state.paginationPendingDatas?.total}
            showSizeChanger
            showTotal={(total) => `Total ${total} items`}
            defaultPageSize={10}
            current={this.state.pageNoPending}
            onChange={(page, pageSize) =>
              this.handleChangePendingPagination(page, Number(pageSize))
            }
          />
        </div>

        {/* section Not pendding here */}

        <Loading show={this.state.loading} />
        <Card className="cardTable" >
          <CardHeader style={{ backgroundColor: "#634ae2" }}>
            <h3 className="text-header text-white">รายการอนุมัติการชำระเงิน / Receipt Payment </h3>
            {/* {permission_add && (
              <Link
                to={`/properties/${idproperty}/transferproof/insert`}
                className="btn btn-success float-right"
              >
                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มรายการ
              </Link>
            )} */}

          </CardHeader>

          <DataTable
            style={{ overFlow: 'auto' }}
            onChange={this._fetchData}
            showRowNo={false}
            dataSource={this.state.dataSourceNotPending.item}
            bordered={false}
            pagination={false}
            // setProps={{ rowSelection: { type: "checkbox", onChange: (selectedRowKeys, selectedRows) => this.setState({ index_buffers: selectedRows, },) } }}
            rowKey="id"
            columns={[
              {
                title: "เลขที่ใบแจ้งหนี้",
                dataIndex: ["expense", "expenseNo"],
                // filterAble: true,
                ellipsis: true,
                align: "center",
              },
              {
                title: "สถานะ",
                dataIndex: "status",
                ellipsis: false,
                align: "center",
                render: (cell) => {
                  if (cell === 'Pending') {
                    return (<Tag color="#87d068">รอตรวจสอบ</Tag>)
                  }
                  else if (cell === 'Confirmed') {
                    return (
                      <Tag color="#87d068">ตรวจสอบแล้ว</Tag>
                    )
                  } else {
                    return <Tag color="#f50">ไม่ถูกต้อง</Tag>
                  }
                },
                filters: [
                  { text: 'ตรวจสอบแล้ว', value: 'Confirmed', },
                  { text: 'ไม่ถูกต้อง', value: 'Rejected', },
                ],
              },
              {
                title: "ชำระเมื่อ",
                dataIndex: "createdAt",
                ellipsis: false,
                align: 'center',
                render: (cell) => timeFormat.showFullDateTimeTH(cell)
              },

              {
                title: "จำนวนเงิน",
                dataIndex: ["expense", "expense_total"],
                ellipsis: false,
                align: 'center',
                render: (cell) => {
                  return numberFormat.decimalFix(cell, 2)
                }
              },
              {
                title: "ชำระโดย",
                dataIndex: ["user"],
                ellipsis: false,
                align: 'center',
                render: (cell) => {
                  return cell.firstname + " " + cell.lastname
                }
              },

              {
                title: "",
                dataIndex: "",
                render: (cell) => {
                  const row_accessible = [];

                  if (permission_edit) {
                    row_accessible.push(
                      <Link
                        key="detail"
                        to={`/properties/${idproperty}/transferproof/detail/${cell.id}`}
                        title="ดูรายละเอียด"
                      >
                        <button
                          type="button"
                          className="icon-button color-primary"
                        >
                          <i
                            className="fa fa-search"
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
                        onClick={() => this._onDelete(cell.id)}
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
            total={this.state.paginationNotPendingDatas?.total}
            showSizeChanger
            showTotal={(total) => `Total ${total} items`}
            defaultPageSize={10}
            current={this.state.pageNoNotPending}
            onChange={(page, pageSize) =>
              this.handleChangeNotPendingPagination(page, Number(pageSize))
            }
          />
        </div>
        <PaymentListModal
          show={this.state.show_modal}
          transferId={this.state.transferId}
          onVerify={this._onVerify}
          onClose={() => this.setState({ show_modal: false })}
        />
      </div>
    );
  }
}

export default View;
