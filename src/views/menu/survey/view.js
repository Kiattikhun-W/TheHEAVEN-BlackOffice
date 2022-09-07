import React from "react";
import { Card, CardBody, CardHeader, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Loading, DataTable } from "../../../components/heaven-strap";
// import { RiSendPlane2Fill } from "react-icons/ri";

import { SurveyModel } from "../../../models";
import { Tag, Divider } from "antd";
import { timeFormat } from "../../../utils";
import { Table, Pagination, Button } from "antd";

const survey_model = new SurveyModel();

class View extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      surveys: [],
      dataSource: [],
      paginationDatas: {
        page: "",
        limit: "",
        total: "",
      },
      pageno: 1,
      index_buffers: []
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData = () =>
    this.setState({ loading: true }, async () => {
      const idproperty = localStorage.getItem("propertyid");

      const surveys = await survey_model.getSurveyBy({
        page: 1,
        limit: 10,
        propertyId: idproperty,
      });

      console.log("survey", surveys);
      this.setState({
        loading: false,
        surveys,
        dataSource: surveys?.result[0],
        paginationDatas: {
          page: surveys?.result[0]?.page,
          limit: surveys?.result[0]?.limit,
          total: surveys?.result[0]?.total,
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
          const res = await survey_model.deleteSurveyByCode(Number(code));
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
        pageno: page,
      });
      const property = Number(localStorage.getItem("propertyid"));
      const res = await survey_model.getSurveyBy({
        page: page === 0 ? 1 : page,
        limit: pageSize,
        propertyId: property,
      });

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
  _sendLine = async () => {
    const idproperty = localStorage.getItem("propertyid");

    const { value } = await Swal.fire({
      title: "คุณแน่ใจหรือไม่ ?",
      text: "ยืนยันการส่งแจ้งเตือนไลน์",
      icon: "warning",
      showCancelButton: true,
    })
    console.log("index", this.state.index_buffers)
    value && this._checkSendLine() && this.setState({ loading: true }, async () => {
      let res = await survey_model.sendSurveyLine({
        surveyData: this.state.index_buffers
      })
      console.log("res", res)
      if (res.code === 200) {
        // window.location.reload()

        this.props.history.push(`/properties/${idproperty}/survey`)
        this.setState({ loading: false })
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

  }
  _checkSendLine = () => {
    if (this.state.index_buffers.length === 0) {
      Swal.fire({ text: "โปรดเลือกรายการ", icon: "warning" });
      return false;
    }
    else {
      return true
    }
  }
  render() {
    const { permission_add, permission_edit, permission_delete } =
      this.props.PERMISSION;
    const idproperty = localStorage.getItem("propertyid");

    return (
      <div className="App">
        <Loading show={this.state.loading} />
        <Card className="cardTable">
          <CardHeader style={{ backgroundColor: "#634ae2" }}>
            <h3 className="text-header text-white">แบบสอบถาม </h3>
            {permission_add && (
              <Link
                to={`/properties/${idproperty}/survey/insert`}
                className="btn btn-success float-right"
              >
                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มแบบสอบถาม
              </Link>
            )}
          </CardHeader>
          <div >
            <Button type="primary" size="large" className="float-right mr-3 mt-2 mb-2" style={{ backgroundColor: "rgb(62, 211, 82)", color: "#fff", border: "rgb(62, 211, 82)" }}
              onClick={this._sendLine} >Line</Button>
          </div>
          <DataTable
            onChange={this._fetchData}
            // showRowNo={true}
            dataSource={this.state.dataSource.item}
            setProps={{ rowSelection: { type: "checkbox", onChange: (selectedRowKeys, selectedRows) => this.setState({ index_buffers: selectedRows, },) } }}
            pagination={false}
            bordered={false}
            rowKey="survey_code"
            columns={[
              {
                title: "ชื่อแบบสอบถาม",
                dataIndex: "survey_name",
                filterAble: true,
                ellipsis: true,
                width: 180,
                align: "center",
              },
              {
                title: "วันที่เริ่ม",
                dataIndex: "survey_startdate",
                // filterAble: true,
                ellipsis: true,
                width: 240,
                align: "center",

                render: (cell) => {
                  return <>{timeFormat.showFullDateTH(cell)}</>;
                },
              },
              {
                title: "วันที่สิ้นสุด",
                dataIndex: "survey_enddate",
                // filterAble: true,
                ellipsis: true,
                width: 240,
                align: "center",

                render: (cell) => {
                  return <>{timeFormat.showFullDateTH(cell)}</>;
                },
              },
              // {
              //   title: "สถานะ",
              //   dataIndex: "survey_status",
              //   // filterAble: true,
              //   ellipsis: true,
              //   width: 240,
              //   align: "center",
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
                        to={`/properties/${idproperty}/survey/update/${cell.survey_code}`}
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
                        onClick={() => this._onDelete(cell.survey_code)}
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
            // defaultCurrent={1}
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
