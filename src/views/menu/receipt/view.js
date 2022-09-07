import React from "react";
import { CardBody, CardHeader, FormGroup, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Loading, DataTable } from "../../../components/heaven-strap";

import { ReceiptTheHeavenModel, UnitModel } from "../../../models";
import { Pagination, Tag, Button, Card } from "antd";
import { numberFormat, timeFormat } from "../../../utils";

const receipt_model = new ReceiptTheHeavenModel();


class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      mail_parcels: [],
      paginationDatas: {
        total: "",
      },
      dataSource: [],
      units: [],
      pageno: 1,
      index_buffers: []
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData = () =>
    this.setState({ loading: true }, async () => {
      const idproperty = Number(localStorage.getItem("propertyid"));
      const mail_parcels = await receipt_model.getReceiptBy({
        propertyId: idproperty,
        page: 1,
        limit: 10,
      });

      this.setState({
        loading: false,
        mail_parcels,
        dataSource: mail_parcels?.result[0],
        paginationDatas: {
          total: mail_parcels?.result[0]?.total,
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
          const res = await receipt_model.deleteReceiptByCode(Number(code));
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

      const res = await receipt_model.getReceiptBy({
        page: page === 0 ? 1 : page,
        limit: pageSize,
        propertyId: property,
      });

      console.log("respag", res.result[0].total);
      if (res.code === 200) {
        this.setState({
          dataSource: res.result[0],
          loading: false,
          pageno: page,
          paginationDatas: {
            page: res.result[0].page,
            limit: res.result[0].limit,
            total: res.result[0].total,
          },
        });
      }
    } catch (error) { }
  };

  render() {
    const { permission_add, permission_edit, permission_delete } =
      this.props.PERMISSION;
    const idproperty = localStorage.getItem("propertyid");

    return (
      <div>
        <Loading show={this.state.loading} />
        <Card className="cardTable" >
          <CardHeader style={{ backgroundColor: "#634ae2" }}>
            <h3 className="text-header text-white">ใบเสร็จ </h3>
            {/* {permission_add && (
              <Link
                to={`/properties/${idproperty}/receipt/insert`}
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
            dataSource={this.state.dataSource.item}
            bordered={false}
            pagination={false}
            // setProps={{ rowSelection: { type: "checkbox", onChange: (selectedRowKeys, selectedRows) => this.setState({ index_buffers: selectedRows, },) } }}
            rowKey="id"
            columns={[
              {
                title: "receiptNo",
                dataIndex: "receiptNo",
                filterAble: true,
                ellipsis: true,
                align: "center",
                width: 240,
              },
              {
                title: "เลขใบค้างชำระ",
                dataIndex: ["expense", "expenseNo"],
                // filterAble: true,
                ellipsis: false,
                align: "center",
              },
              {
                title: "ยูนิต",
                dataIndex: ["expense", "unit", "unitName"],
                // filterAble: true,
                ellipsis: false,
                align: "center",
              },
              {
                title: "ราคา",
                dataIndex: ["expense", "expense_total"],
                ellipsis: false,
                align: "center",
                render: (cell) => numberFormat.decimalFix(cell, 2) + " บาท"

              },
              // {
              //   title: "ขนส่ง",
              //   dataIndex: "courier",
              //   ellipsis: false,
              //   align: 'center',

              // },

              // {
              //   title: "สถานะ",
              //   dataIndex: "status",
              //   ellipsis: false,
              //   align: 'center',
              //   render: (cell) => {
              //     return cell === true ? <Tag color="#87d068">รับแล้ว</Tag> : <Tag color="#108ee9">รอรับ</Tag>
              //   }
              // },

              {
                title: "",
                dataIndex: "",
                render: (cell) => {
                  const row_accessible = [];

                  if (permission_edit) {
                    row_accessible.push(
                      <Link
                        key="update"
                        to={`/properties/${idproperty}/receipt/detail/${cell.id}`}
                        title="แก้ไขรายการ"
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
