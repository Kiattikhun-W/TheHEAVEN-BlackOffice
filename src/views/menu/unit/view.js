import React from "react";
import { Card, CardBody, CardHeader, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { Loading, DataTable } from "../../../components/heaven-strap";

import { UnitModel } from "../../../models";
import { Table, Pagination } from "antd";
import { numberFormat, timeFormat } from "../../../utils";

const unit_model = new UnitModel();
class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      units: [],
      columns: [],
      dataSource: [],
      pageno: 1,
      paginationDatas: {
        page: "",
        limit: "",
        total: "",
      },
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData = () =>
    this.setState({ loading: true }, async () => {
      const idproperty = Number(localStorage.getItem("propertyid"));

      const units = await unit_model.getUnitBy({
        page: 1,
        limit: 10,
        propertyId: idproperty,
      });
      console.log(units.result);

      this.setState(
        {
          loading: false,
          units: units.result[0],
          dataSource: units.result[0],
          paginationDatas: {
            page: units.result[0].page,
            limit: units.result[0].limit,
            total: units.result[0].total,
          },
        },
        () => {
          console.log("state", this.state.paginationDatas);
        }
      );
    });


  handleChangePagination = async (page, pageSize) => {
    try {
      this.setState({
        loading: true,
        pageno: page
      });
      const property = Number(localStorage.getItem("propertyid"));

      const res = await unit_model.getUnitBy({
        page: page === 0 ? 1 : page,
        limit: pageSize,
        propertyId: property,
      });

      if (res.code === 200) {
        this.setState({
          dataSource: res.result[0],
          loading: false,
          paginationDatas: {
            page: res.result[0].page,
            limit: res.result[0].limit,
            total: res.result[0].total,
          },
        });
      }
    } catch (error) { }
  };

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
          const res = await unit_model.deleteUnitByCode(Number(code));
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

  render() {
    const { permission_add, permission_edit, permission_delete } =
      this.props.PERMISSION;
    const idproperty = localStorage.getItem("propertyid");

    return (
      <div>
        <Loading show={this.state.loading} />
        <Card>
          <CardHeader style={{ backgroundColor: "#634ae2" }}>
            <h3 className="text-header text-white">ยูนิต </h3>
            {permission_add && (
              <Link
                to={`/properties/${idproperty}/unit/insert`}
                className="btn btn-success float-right"
              >
                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มยูนิต
              </Link>
            )}
          </CardHeader>
          <CardBody>
            {/* <Table
              rowKey="id"
              showRowNo={true}
              columns={this.state.columns}
              pagination={false}
              dataSource={this.state.dataSource}
            ></Table> */}

            <DataTable
              style={{ overFlow: "auto" }}
              showRowNo={false}
              pagination={false}
              dataSource={this.state.dataSource.item}
              bordered={false}
              rowKey="id"
              columns={[
                {
                  title: "ชื่อยูนิต",
                  dataIndex: "unitName",
                  filterAble: true,
                  ellipsis: true,
                  align: "center",
                },
                {
                  title: "ประเภทยูนิต",
                  dataIndex: "type",
                  filterAble: true,
                  ellipsis: true,
                },
                {
                  title: "ขนาด",
                  dataIndex: "areaSize",
                  filterAble: true,
                  ellipsis: true,
                },
                {
                  title: "ราคา",
                  dataIndex: "price",
                  // sorter: (a, b) => a.price - b.price,
                  ellipsis: true,
                  render: (cell) => {
                    return numberFormat.decimalFix(cell, 2) + " บาท";
                  },
                },
                {
                  title: "เจ้าของยูนิต",
                  dataIndex: ["unitUser", "user", "firstname"],
                  ellipsis: true,
                  render: (cell, row) => {
                    let findUser = row.unitUser?.find(item => item.unitRole === "Owner" && item.isDelete === false)
                    if (findUser) {
                      return findUser.user.firstname + " " + findUser.user.lastname
                    } else {
                      return "ไม่มีเจ้าของที่ลงทะเบียน"
                    }
                    // if(findUser)){
                    //   return(findUser.unitUser.user.firstname+" "+row.unitUser.user.lastname)
                    // }else return "ไม่มีเจ้าของ"
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
                          to={`/properties/${idproperty}/unit/update/${cell.id}`}
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
                          <i className="fa fa-trash" aria-hidden="true" />
                        </button>
                      );
                    }

                    return row_accessible;
                  },
                  width: 80,
                },
              ]}
            />
          </CardBody>
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
