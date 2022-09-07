import React from "react";
import { Card, CardBody, CardHeader, FormGroup } from "reactstrap";
import {
  CWidgetDropdown,
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";

import { CChartBar } from "@coreui/react-chartjs";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { Loading, DataTable, Select } from "../../../components/heaven-strap";
import CIcon from "@coreui/icons-react";

import { SurveyAnswerModel, SurveyModel } from "../../../models";
import { Tag, Divider, Tabs, Pagination } from "antd";
import { timeFormat } from "../../../utils";

const { TabPane } = Tabs;

const survey_answer_model = new SurveyAnswerModel();
const survey_model = new SurveyModel();

class View extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      survey_answers: [],
      surveys: [],
      survey_code: "",
      survey_name: "",
      survey_scores: [],
      dataSource: [],
      dataSource: [],
      paginationDatas: {
        page: "",
        limit: "",
        total: "",
      },
      pageno: 1,
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData = () =>
    this.setState({ loading: true }, async () => {
      const idproperty = localStorage.getItem("propertyid");

      //   const survey_answers = await survey_answer_model.getSurveyAnswerBy({
      //     page: 1,
      //     limit: 10,
      //     propertyId: idproperty,
      //   });
      const surveys = await survey_model.getSurveyBy({
        propertyId: idproperty,
      });
      //   console.log("total", survey_answers.result[0].item);
      this.setState({
        loading: false,
        // survey_answers: survey_answers.result[0].item,
        surveys: surveys?.result[0]?.item,
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
          const res = await survey_answer_model.deleteSurveyAnswerByCode({
            survey_answer_code: code,
          });
          if (res.require) {
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
  _handleSurvey = async (e) => {
    const idproperty = localStorage.getItem("propertyid");

    if (e === "") return true;
    const survey_answers = await survey_answer_model.getSurveyAnswerBy({
      page: 1,
      limit: 9999,
      propertyId: idproperty,
      surveyId: Number(e),
    });

    let dataSurvey = this.state.surveys?.filter(
      (item) => item.survey_code === e
    );
    let dataSurveyAnswer = survey_answers.result[0].item?.filter(
      (item) => item.survey_code === e
    );
    let scoreObj = [];

    for (let index = 0; index < 5; index++) {
      let dataSurveyScore = dataSurveyAnswer?.filter(
        (item) => parseInt(item.survey_answer_score) === index + 1
      ).length;
      if (dataSurveyScore) {
        scoreObj.push({
          score_index: index + 1,
          score: parseInt(dataSurveyScore),
        });
      } else {
        scoreObj.push({
          score_index: index + 1,
          score: 0,
        });
      }
    }
    console.log("score", scoreObj);

    console.log("dataSurveyAnswer1", this.state.survey_answers);

    this.setState({
      survey_code: e,
      survey_name: dataSurvey[0]?.survey_name,
      survey_scores: scoreObj,
      dataSource: dataSurveyAnswer,
      paginationDatas: {
        total: survey_answers?.result[0]?.total,
      },
    });
  };
  handleChangePagination = async (page, pageSize) => {
    try {
      this.setState({
        loading: true,
        pageno: page,
      });
      const property = Number(localStorage.getItem("propertyid"));
      const res = await survey_answer_model.getSurveyAnswerBy({
        page: page === 0 ? 1 : page,
        limit: pageSize,
        propertyId: property,
        surveyId: Number(this.state.survey_code),
      });

      if (res.code === 200) {
        this.setState({
          dataSource: res.result[0].item,
          loading: false,
          pageno: page,
          paginationDatas: {
            total: res.result[0].total,
          },
        });
      }
    } catch (error) { }
  };

  render() {
    const idproperty = localStorage.getItem("propertyid");
    const survey_options = [
      { label: "- ระบุชื่อแบบสอบถาม -", value: "" },
      ...this.state.surveys.map((item) => ({
        label: item.survey_name,
        value: item.survey_code,
      })),
    ];

    return (
      <div>
        <Loading show={this.state.loading} />
        <Card className="cardTable" style={{ borderRadius: "12px" }}>
          <CardHeader style={{ backgroundColor: "#634ae2" }}>
            <h3 className="text-header text-white">ผลแบบสอบถาม </h3>
            {/* {permission_add &&
                            <Link to={`/properties/${idproperty}/survey-answer/insert`} className="btn btn-success float-right" >
                                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มแบบสอบถาม
                            </Link>
                        } */}
            <Select
              style={{ width: 150 }}
              options={survey_options}
              className="float-right w-25"
              value={this.state.survey_code}
              onChange={(e) => this._handleSurvey(e)}
            />
          </CardHeader>
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="ทั่วไป" key="1">
              <CRow className="d-flex justify-content-center">
                <CCol sm="12" lg="5">

                  <h4>{!this.state.survey_name
                    ? "กรุณาเลือกแบบสอบถาม"
                    : this.state.survey_name}</h4>
                  <CChartBar
                    className="c-chart-wrapper mt-3 mx-3 mb-3 "
                    datasets={[
                      {
                        label: "จำนวนผู้ทำแบบสอบถาม",
                        backgroundColor: "#BAABDA",
                        data: this.state.survey_scores.map((item) =>
                          parseInt(item.score)
                        ),
                        // barPercentage: 1
                      },
                    ]}
                    labels={[
                      "1 คะแนน",
                      "2 คะแนน",
                      "3 คะแนน",
                      "4 คะแนน",
                      "5 คะแนน",
                    ]}
                    options={{
                      tooltips: {
                        enabled: true,
                        titleFontFamily: "Kanit",
                        footerFontFamily: "Kanit",
                        bodyFontFamily: "Kanit",
                        fontColor: "black",

                      },
                      legend: {
                        labels: {
                          fontFamily: "Kanit",
                          fontColor: "black",
                        },
                      },
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              fontFamily: "Kanit",
                              fontColor: "black",
                              // beginAtZero: true,
                            },
                          },
                        ],
                        xAxes: [
                          {
                            ticks: {
                              fontFamily: "Kanit",
                              fontColor: "black",
                            },
                          },
                        ],
                      },
                    }}
                  />
                </CCol>
              </CRow>
              <DataTable
                onChange={this._fetchData}
                showRowNo={false}
                dataSource={this.state.dataSource}
                dataTotal={this.state.dataSource.length}
                bordered={false}
                pagination={false}
                rowKey="survey_answer_code"
                columns={[
                  {
                    title: "คะแนน",
                    dataIndex: "survey_answer_score",
                    // sorter: true,

                    filters: [
                      { text: "1 คะแนน", value: 1 },
                      { text: "2 คะแนน", value: 2 },
                      { text: "3 คะแนน", value: 3 },
                      { text: "4 คะแนน", value: 4 },
                      { text: "5 คะแนน", value: 5 },
                    ],
                    ellipsis: true,
                    align: "center",
                    render: (cell) => {
                      if (cell === "1") {
                        return (
                          <div>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span className="fa fa-star fa-lg"></span>
                            <span className="fa fa-star fa-lg"></span>
                            <span className="fa fa-star fa-lg"></span>
                            <span className="fa fa-star fa-lg"></span>
                          </div>
                        );
                      } else if (cell === "2") {
                        return (
                          <div>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span className="fa fa-star fa-lg"></span>
                            <span className="fa fa-star fa-lg "></span>
                            <span className="fa fa-star fa-lg"></span>
                          </div>
                        );
                      } else if (cell === "3") {
                        return (
                          <div>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span className="fa fa-star fa-lg"></span>
                            <span className="fa fa-star fa-lg"></span>
                          </div>
                        );
                      } else if (cell === "4") {
                        return (
                          <div>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span className="fa fa-star fa-lg"></span>
                          </div>
                        );
                      } else if (cell === "5") {
                        return (
                          <div>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                            <span
                              className="fa fa-star fa-lg"
                              style={{ color: "orange" }}
                            ></span>
                          </div>
                        );
                      }
                    },
                  },
                  {
                    title: "รายละเอียด",
                    dataIndex: "survey_answer_note",
                    filterAble: true,
                    ellipsis: true,
                    align: "center",
                  },

                  {
                    title: "",
                    dataIndex: "",
                    render: (cell) => {
                      const row_accessible = [];

                      // if (permission_delete) {
                      //   row_accessible.push(
                      //     <button
                      //       key="detail"
                      //       type="button"
                      //       className="icon-button color-primary"
                      //       title="ลบรายการ"
                      //     >
                      //       <i className="fa fa-search " aria-hidden="true" />
                      //     </button>
                      //   );
                      // }

                      return row_accessible;
                    },
                    width: 80,
                  },
                ]}
              />
            </TabPane>
          </Tabs>
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
