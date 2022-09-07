import React, { useState, useEffect } from "react";
import {
  CWidgetDropdown,
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
} from "@coreui/react";

import { Card, Tag } from "antd";

import {
  CChartBar,
  CChartLine,
  CChartDoughnut,
  CChartRadar,
  CChartPie,
  CChartPolarArea,
} from "@coreui/react-chartjs";
import {
  Loading,
  DataTable,
  Select,
} from "../../../../../components/heaven-strap";

import CIcon from "@coreui/icons-react";
import ChartLineSimple from "../charts/ChartLineSimple";
import ChartBarSimple from "../charts/ChartBarSimple";
import {
  SurveyAnswerModel,
  SurveyModel,
  RepairCommonModel,
} from "../../../../../models";

import { MemberModel } from "../../../../../models";
import { CardHeader } from "reactstrap";
import { Link } from "react-router-dom"

const survey_model = new SurveyModel();
const survey_answer_model = new SurveyAnswerModel();
const repair_common_model = new RepairCommonModel();

const WidgetsDropdown = (props) => {
  const [state, setState] = useState({
    memberCharts: [],
  });
  const [surveys, setSurveys] = useState([]);
  const [surveyId, setSurveyId] = useState("");
  const [survey_scores, setSurveyScore] = useState([]);
  const [survey_name, setSurveyName] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [repair_commons, setRepairCommons] = useState([]);
  // const _fetchData = async () => {
  //   const member_charts = await member_model.getMemberChartByMonth()
  //   console.log("data", member_charts.data)

  //   let chart_members = []
  //   let month_arrs = [
  //     { month_number: 1, month_name: 'มกราคม', total_member: 0 },
  //     { month_number: 2, month_name: 'กุมภาพันธ์', total_member: 0 },
  //     { month_number: 3, month_name: 'มีนาคม', total_member: 0 },
  //     { month_number: 4, month_name: 'เมษายน', total_member: 0 },
  //     { month_number: 5, month_name: 'พฤษภาคม', total_member: 0 },
  //     { month_number: 6, month_name: 'มิถุนายน', total_member: 0 },
  //     { month_number: 7, month_name: 'กรกฎาคม', total_member: 0 },
  //     { month_number: 8, month_name: 'สิงหาคม', total_member: 0 },
  //     { month_number: 9, month_name: 'กันยายน', total_member: 0 },
  //     { month_number: 10, month_name: 'ตุลาคม', total_member: 0 },
  //     { month_number: 11, month_name: 'พฤษจิกายน', total_member: 0 },
  //     { month_number: 12, month_name: 'ธันวาคม', total_member: 0 }
  //   ]
  //   chart_members.push(...member_charts.data.map(val => val))

  //   for (let iterator of chart_members) {
  //     let b = month_arrs.find(val => val.month_number === iterator.month_number)
  //     if (b) {
  //       b.total_member = iterator.total_member
  //     }
  //   }

  //   setState(
  //     {
  //       memberCharts: month_arrs
  //     }
  //   )

  // }

  // useEffect(() => {
  //   setPropertyId(props.propertyId)

  // }, [props.propertyId]);
  useEffect(() => {
    _fetchData();
  }, [props.propertyId]);
  const _fetchData = async () => {
    console.log("props.propertyId", props.propertyId);
    const surveys = await survey_model.getSurveyBy({
      propertyId: props.propertyId,
    });
    const repair_commons = await repair_common_model.getRepairCommonTop5By({
      propertyId: props.propertyId,
    });
    const repair_commons_table = await repair_common_model.getRepairCommonBy({
      propertyId: props.propertyId,
      limit: 5,
      status: 'Waiting',
    });
    setDataSource(repair_commons_table.result[0])

    console.log("repair_commons", repair_commons);
    setRepairCommons(repair_commons);
    setSurveys(surveys.result[0].item);
    setSurveyId("");
    setSurveyName("");
    setSurveyScore([]);
  };

  const _handleSurvey = async (e) => {
    const idproperty = props.propertyId;

    if (e === "") {
      setSurveyId(e);
      setSurveyName("");
      setSurveyScore([]);
      // setSurveyId(e)
    } else {
      const survey_answers = await survey_answer_model.getSurveyAnswerBy({
        page: 1,
        limit: 9999,
        propertyId: idproperty,
        surveyId: Number(e),
      });

      let dataSurvey = surveys?.filter((item) => item.survey_code === e);
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

      // console.log("dataSurveyAnswer1", this.state.survey_answers);
      setSurveyName(dataSurvey[0].survey_name);
      setSurveyScore(scoreObj);
      setSurveyId(e);
      // this.setState({
      //     surveyId: e,
      //     survey_name: dataSurvey[0].survey_name,
      //     survey_scores: scoreObj,
      //     // dataSource: dataSurveyAnswer,
      //     // paginationDatas: {
      //     //     total: survey_answers.result[0].total,
      //     // },
      // });
    }
  };

  // render
  return (
    // <CCard>
    //   <CCardBody >
    <>
      <CRow>
        <CCol sm="5" md="12" lg="12" className="mb-3">
          <h4>เลือกแบบสอบถาม</h4>
          <Select
            options={[
              { label: "- ระบุแบบสอบถาม -", value: "" },
              ...surveys.map((item) => ({
                label: item.survey_name,
                value: item.survey_code,
              })),
            ]}
            className="text-center w-25"
            value={surveyId}
            onChange={(e) => _handleSurvey(e)}
          />
        </CCol>
      </CRow>
      <hr className="mt-0" />
      <CRow className="d-flex justify-content-center">
        <CCol sm="12" md="12" lg="6">
          <Card>
            <h4>{!survey_name ? "กรุณาเลือกแบบสอบถาม" : survey_name}</h4>
            <CChartBar
              className="c-chart-wrapper "
              datasets={[
                {
                  label: "จำนวนผู้ทำแบบสอบถาม",
                  backgroundColor: "#BAABDA",
                  data: survey_scores.map((item) => parseInt(item.score)),
                  // barPercentage: 1
                },
              ]}
              labels={["1 คะแนน", "2 คะแนน", "3 คะแนน", "4 คะแนน", "5 คะแนน"]}
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
          </Card>
        </CCol>

        <CCol sm="12" lg="6">
          <Card>
            {/* {console.log("repair_commons.categoryname",repair_commons.result.find(item=>item.categoryname))} */}
            <h4>หมวดหมู่ที่มีการแจ้งซ่อม 5 อันดับแรกในพื้นที่ส่วนกลาง</h4>
            {repair_commons.result?.find((item) => item.categoryname) ===
              undefined ? (
              <h5>ไม่มีการแจ้งซ่อม</h5>
            ) : (
              <CChartDoughnut
                className="c-chart-wrapper "
                datasets={[
                  {
                    backgroundColor: [
                      "#9C4B28",
                      "#E4815D",
                      "#FDB195",
                      "#FFD1BB",
                      "#F3D8D1",
                      "#E0C097",
                      "#F3F0D7",
                      "#4F091D",
                      "#DD4A48",
                      "#97BFB4",
                      "#8267BE",
                      "#FFBD35",
                    ],
                    data: repair_commons.result.map((item) => item.countUse),
                  },
                ]}
                labels={repair_commons.result.map((item) => item.categoryname)}
                options={{
                  tooltips: {
                    enabled: true,
                    titleFontFamily: "Kanit",
                    footerFontFamily: "Kanit",
                    bodyFontFamily: "Kanit",
                    fontColor: "black",
                  },
                  legend: {
                    display: true,
                    labels: {
                      fontFamily: "Kanit",
                      fontColor: "black",
                    },
                  },
                }}
              />
            )}
          </Card>
        </CCol>
        <CCol>
          <h4>รายการแจ้งซ่อมพื้นที่ส่วนกลาง 5 รายการล่าสุด</h4>
          <DataTable
            // onChange={_fetchData}
            pagination={false}
            showRowNo={true}
            dataSource={dataSource.item}
            rowKey="id"
            columns={[
              {
                title: "รหัสแจ้งซ่อม ",
                dataIndex: "jobNo",
                // filterAble: true,
                ellipsis: true,
                align: 'center',
                width: 240,
              },

              {
                title: "รายละเอียด",
                dataIndex: "description",
                // filterAble: true,
                ellipsis: true,
                align: 'center',
              },
              {
                title: "สถานะ",
                dataIndex: "status",
                ellipsis: true,
                // filters: [
                //   { value: "Waiting", text: "รอดำเนินการ" },
                //   { value: "Process", text: "อยู่ระหว่างดำเนินการ" },
                //   { value: "Done", text: "เสร็จสิ้น" },
                //   { value: "Cancel", text: "ยกเลิก" },

                // ],
                align: 'center',
                render: (cell) => {
                  return cell === 'Done' ?
                    <Tag color="success">เสร็จสิ้น</Tag> :
                    cell === 'Process' ?
                      <Tag color="warning">อยู่ระหว่างดำเนินการ</Tag> :
                      cell === 'Waiting' ?
                        <Tag color="processing">รอดำเนินการ</Tag> :
                        <Tag color="error">ยกเลิก</Tag>
                }
              },
              {
                title: "แจ้งโดย",
                // filterAble: true,
                ellipsis: true,
                align: 'center',
                render: (cell) => cell.user.userFullname
              },

              {
                title: '',
                dataIndex: '',
                render: (cell) => {
                  // const row_accessible = []

                  //   row_accessible.push(
                  //     <Link key="update" to={`/properties/${props.propertyId}/repaircommon/update/${cell.id}`} title="แก้ไขรายการ">
                  //       <button type="button" className="icon-button color-warning">
                  //         <i className="fa fa-pencil-square-o" aria-hidden="true" />
                  //       </button>
                  //     </Link>
                  //   )                    

                  // return row_accessible
                },
                width: 80,
              },
            ]}
          />
        </CCol>
      </CRow>
    </>

    //   </CCardBody>
    // </CCard>
  );
};

export default WidgetsDropdown;
