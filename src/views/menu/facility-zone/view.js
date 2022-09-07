import React from "react";
import { CardBody, CardHeader, FormGroup, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Loading, DataTable } from "../../../components/heaven-strap";

import { FacilityZoneModel } from "../../../models";
import { Pagination, Tag, Button, Card } from "antd";
import { numberFormat, timeFormat } from "../../../utils";

// const facility_zone_model = new FacilityZoneModel();
const facility_zone_model = new FacilityZoneModel();


class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      facilites: [],
      paginationDatas: {
        total: "",
      },
      dataSource: [],
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
      const facilites = await facility_zone_model.getFacilityZoneBy({
        propertyId: idproperty,
        page: 1,
        limit: 10,
      });
      console.log("facilites", facilites)

      this.setState({
        loading: false,
        facilites,
        dataSource: facilites.result[0],
        paginationDatas: {
          total: facilites.result[0].total,
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
          const res = await facility_zone_model.deleteFacilityZoneByCode(Number(code));
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

      const res = await facility_zone_model.getFacilityZoneBy({
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
            <h3 className="text-header text-white">ส่วนกลาง </h3>
            {permission_add && (
              <Link
                to={`/properties/${idproperty}/facilityzone/insert`}
                className="btn btn-success float-right"
              >
                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มพื้นที่ส่วนกลาง
              </Link>
            )}

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
                title: "พื้นที่ส่วนกลาง",
                dataIndex: "facilityName",
                filterAble: true,
                ellipsis: false,
                align: "center",
              },


              {
                title: "ความจุ",
                dataIndex: "capacity",
                ellipsis: false,
                align: 'center',
                width: 240,

              },
              {
                title: "เวลาเปิด - เวลาปิด",
                // dataIndex: ['facilityStart','facilityEnd'],
                ellipsis: false,
                align: 'center',
                width: 240,
                render: (cell, rec) => {
                  // console.log("cell",rec.facilityStart,rec.facilityEnd)
                  return <>
                    {`${rec.openTime}-${rec.closeTime}`}
                  </>
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
                        to={`/properties/${idproperty}/facilityzone/update/${cell.id}`}
                        title="แก้ไขรายการ"
                      >
                        <button
                          type="button"
                          className="icon-button color-warning"
                        >
                          <i className="fa fa-pencil-square-o" aria-hidden="true" />

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
