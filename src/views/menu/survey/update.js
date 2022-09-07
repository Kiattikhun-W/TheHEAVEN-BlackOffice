import React from "react";
import moment from "moment";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { Loading, Select } from "../../../components/heaven-strap";

import { SurveyModel } from "../../../models";
import { Switch, DatePicker } from "antd";
import { timeFormat } from "../../../utils";

const { RangePicker } = DatePicker;
const survey_model = new SurveyModel();
const idproperty = localStorage.getItem("propertyid");

class Update extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      code_validate: {
        value: "",
        status: "",
        class: "",
        text: "",
      },
      surveys: [],
      survey_name: "",
      survey_tel: "",
      survey_code: "",
      survey_status: "",
      survey_startdate: new Date(),
      survey_enddate: new Date(),
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData = async () => {
    const { code } = this.props.match.params;

    const surveys = await survey_model.getSurveyByCode({ id: code });

    console.log(surveys);

    if (surveys.code !== 200) {
      Swal.fire({
        title: "ข้อผิดพลาด !",
        text: "ไม่สามารถโหลดข้อมูล",
        icon: "error",
      });
      this.props.history.push(`/properties/${idproperty}/survey`);
    } else if (surveys.result.length === 0) {
      Swal.fire({
        title: "ไม่พบรายการนี้ในระบบ !",
        text: code,
        icon: "warning",
      });
      this.props.history.push(`/properties/${idproperty}/survey`);
    } else {
      const {
        survey_name,
        survey_tel,
        survey_code,
        survey_status,
        survey_startdate,
        survey_enddate,
      } = surveys.result[0];

      this.setState({
        loading: false,
        survey_name,
        survey_tel,
        survey_code,
        survey_status,
        survey_startdate: timeFormat.validateDate(survey_startdate),
        survey_enddate: timeFormat.validateDate(survey_enddate),
      });
    }
  };

  _handleSubmit = (event) => {
    event.preventDefault();

    this._checkSubmit() &&
      this.setState({ loading: true }, async () => {
        const res = await survey_model.updateSurveyBy(
          Number(this.state.survey_code),
          {
            survey_name: this.state.survey_name.trim(),
            survey_status: '-',
            survey_startdate: timeFormat.dateToStr(this.state.survey_startdate),
            survey_enddate: timeFormat.dateToStr(this.state.survey_enddate),
            properties_code: idproperty,
          }
        );

        if (res.code === 200) {
          Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success" });
          this.props.history.push(`/properties/${idproperty}/survey`);
        } else {
          this.setState({ loading: false }, () => {
            Swal.fire({
              title: "เกิดข้อผิดพลาด !",
              text: "ไม่สามารถดำเนินการได้ !",
              icon: "error",
            });
          });
        }
      });
  };

  _checkSubmit() {

    return true;

  }

  render() {
    const idproperty = localStorage.getItem("propertyid");
    const survey_status_options = [
      { label: "- เลือกประเภท -", value: "" },
      { value: "published", label: "เผยแพร่" },
      { value: "archived", label: "จัดเก็บ" },
      { value: "not published", label: "ไม่เผยแพร่" },
    ];
    return (
      <div>
        <Loading show={this.state.loading} />
        <Card>
          <CardHeader style={{ backgroundColor: "#634ae2" }}>
            <h3 className="mb-0 text-white">เพิ่มแบบสอบถาม / Add Survey </h3>
          </CardHeader>
          <Form onSubmit={this._handleSubmit}>
            <CardBody>
              <Row>
                {/* <Col md={3}>
                  <FormGroup>
                    <label>
                      รหัสแบบสอบถาม{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </label>
                    <Input
                      type="text"
                      value={this.state.survey_code}
                      className={this.state.code_validate.class}
                      onChange={(e) =>
                        this.setState({ survey_code: e.target.value })
                      }
                      onBlur={this._checkCode}
                      required
                    />
                    <p className="text-muted">Example : MEM00001.</p>
                  </FormGroup>
                </Col> */}
                <Col md={3}>
                  <FormGroup>
                    <label>
                      ชื่อ{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </label>
                    <Input
                      type="text"
                      value={this.state.survey_name}
                      onChange={(e) =>
                        this.setState({ survey_name: e.target.value })
                      }
                      required
                    />
                    <p className="text-muted">Example : ตำรวจ.</p>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                {/* <Col md={3}>
                  <FormGroup>
                    <label>
                      สถานะ{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </label>
                    <Select
                      options={survey_status_options}
                      value={this.state.survey_status}
                      onChange={(e) => this.setState({ survey_status: e })}
                    />
                  </FormGroup>
                </Col> */}
                <Col md={3}>
                  <FormGroup>
                    <label>
                      วันที่เริ่มและวันที่สิ้นสุด{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </label>
                    <RangePicker
                      value={[
                        moment(this.state.survey_startdate, "HH:mm"),
                        moment(this.state.survey_enddate, "HH:mm"),
                      ]}
                      allowClear={false}

                      onChange={(e, datestring) =>
                        this.setState({
                          survey_startdate: e[0],
                          survey_enddate: e[1],
                        })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
            <CardFooter className="text-right">
              <Button type="submit" color="success">
                Save
              </Button>
              <Link to={`/properties/${idproperty}/survey`}>
                <Button type="button">Back</Button>
              </Link>
            </CardFooter>
          </Form>
        </Card>
      </div>
    );
  }
}

export default Update;
