import React from "react";
import { CardBody, CardHeader, FormGroup, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Loading, DataTable } from "../../../components/heaven-strap";

import { InformationModel } from "../../../models";
import { Pagination, Tag, Button, Card } from "antd";
import { numberFormat, timeFormat } from "../../../utils";

// const information_model = new InformationModel();
const information_model = new InformationModel();


class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      informations: [],
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
      const informations = await information_model.getInformationBy({
        propertyId: idproperty,
        page: 1,
        limit: 10,
      });

      this.setState({
        loading: false,
        informations,
        dataSource: informations.result[0],
        paginationDatas: {
          total: informations.result[0].total,
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
          const res = await information_model.deleteInformationByCode(Number(code));
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

      const res = await information_model.getInformationBy({
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
            <h3 className="text-header text-white">ติดต่อสอบถาม </h3>
            {/* {permission_add && (
              <Link
                to={`/properties/${idproperty}/information/insert`}
                className="btn btn-success float-right"
              >
                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มกระทู้
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
                title: "ชื่อคำถาม",
                dataIndex: "title",
                filterAble: true,
                ellipsis: false,
                align: "center",
              },
              {
                title: "ชื่อผู้สอบถาม",
                ellipsis: false,
                align: 'center',
                render: (cell) => cell.user.fullname,
                width: 240

              },

              {
                title: "วันที่สอบถาม",
                dataIndex: "createdAt",
                ellipsis: false,
                align: 'center',
                width: 240,
                render: (cell) => {
                  return timeFormat.showFullDateTimeTH(cell)
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
                        to={`/properties/${idproperty}/information/detail/${cell.id}`}
                        title="ดูรายการ"
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
