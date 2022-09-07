import React from "react";
import { CardBody, CardHeader, FormGroup, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Loading, DataTable } from "../../../components/heaven-strap";

import { MailParcelModel, UnitModel } from "../../../models";
import { Pagination, Tag, Button, Card } from "antd";
import { numberFormat, timeFormat } from "../../../utils";

const mail_parcel_model = new MailParcelModel();
const unit_model = new UnitModel();


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
      const mail_parcels = await mail_parcel_model.getMailParcelBy({
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
          const res = await mail_parcel_model.deleteMailParcelByCode(Number(code));
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

      const res = await mail_parcel_model.getMailParcelBy({
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
            page: res.result[0].page,
            limit: res.result[0].limit,
            total: res.result[0].total,
          },
        });
      }
    } catch (error) { }
  };
  _quickPickup = () => {
    return this.state.index_buffers.length !== 0 ? Swal.fire({
      title: "คุณแน่ใจหรือไม่ ?",
      text: "ยืนยันรับรายการรับด่วน",
      icon: "warning",
      showCancelButton: true,
    }).then(
      ({ value }) =>
        value &&
        this.setState({ loading: false }, async () => {
          // console.log(this.state.index_buffers)
          this.state.index_buffers.forEach(async (item) => {
            const idproperty = Number(localStorage.getItem("propertyid"));
            const now = new Date();
            const res = await mail_parcel_model.updateMailParcelBy(
              Number(item.id),
              {
                receiveCode: item.receiveCode,
                courier: item.courier,
                status: true,
                unit: item.unitId,
                trackingNumber: item.trackingNumber,
                property: Number(idproperty),
                receiveDate: timeFormat.dateToStr(now),
                user: 1
              }
            );
            if (res.code === 200) {

              Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success" }).then(() => this.setState({ loading: true }, window.location.reload()));
              // this._fetchData()
              // 

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


        })
    ) : Swal.fire({
      title: "เกิดข้อผิดพลาด !",
      text: " กรุณาเลือกรายการ!",
      icon: "warning",
    });
  }

  render() {
    const { permission_add, permission_edit, permission_delete } =
      this.props.PERMISSION;
    const idproperty = localStorage.getItem("propertyid");

    return (
      <div>
        <Loading show={this.state.loading} />
        <Card className="cardTable" >
          <CardHeader style={{ backgroundColor: "#634ae2" }}>
            <h3 className="text-header text-white">พัสดุไปรษณีย์ </h3>
            {permission_add && (
              <Link
                to={`/properties/${idproperty}/mailparcel/insert`}
                className="btn btn-success float-right"
              >
                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มรายการ
              </Link>
            )}

          </CardHeader>
          <div >
            <Button type="primary" size="large" className="float-right mr-3 mt-2 mb-2" onClick={this._quickPickup} >รับด่วน</Button>
          </div>

          <DataTable
            style={{ overFlow: 'auto' }}
            onChange={this._fetchData}
            showRowNo={false}
            dataSource={this.state.dataSource.item}
            bordered={false}
            pagination={false}
            setProps={{ rowSelection: { type: "checkbox", onChange: (selectedRowKeys, selectedRows) => this.setState({ index_buffers: selectedRows, },) } }}
            rowKey="id"
            columns={[
              {
                title: "receiveCode",
                dataIndex: "receiveCode",
                filterAble: true,
                ellipsis: true,
                align: "center",
              },
              {
                title: "ยูนิต",
                dataIndex: "unitName",
                filterAble: true,
                ellipsis: false,
                align: "center",
              },
              {
                title: "ขนส่ง",
                dataIndex: "courier",
                ellipsis: false,
                align: 'center',

              },

              {
                title: "สถานะ",
                dataIndex: "status",
                ellipsis: false,
                align: 'center',
                render: (cell) => {
                  return cell === true ? <Tag color="#87d068">รับแล้ว</Tag> : <Tag color="#108ee9">รอรับ</Tag>
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
                        key="update"
                        to={`/properties/${idproperty}/mailparcel/update/${cell.id}`}
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
