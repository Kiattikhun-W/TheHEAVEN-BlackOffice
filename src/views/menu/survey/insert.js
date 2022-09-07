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
import { timeFormat } from "../../../utils";
import { SurveyModel } from "../../../models";
import { Switch, DatePicker } from "antd";

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";

const survey_model = new SurveyModel();

class Insert extends React.Component {
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
    const now = new Date();

    this.setState({
      loading: false,
    });
  };

  _handleSubmit = (event) => {
    const idproperty = localStorage.getItem("propertyid");
    event.preventDefault();

    this._checkSubmit() &&
      this.setState({ loading: true }, async () => {
        const res = await survey_model.insertSurvey({
          //   survey_code: this.state.survey_code.trim(),
          survey_name: this.state.survey_name.trim(),
          survey_status: "-",
          survey_startdate: timeFormat.dateToStr(this.state.survey_startdate),
          survey_enddate: timeFormat.dateToStr(this.state.survey_enddate),
          property: Number(idproperty),
        });

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
    //  else {
    return true;
    // }
  }

  _checkCode = async () => {
    const code = this.state.survey_code.replace(/\//g, "-").trim();

    if (code.length) {
      if (this.state.code_validate.value !== code) {
        const duplicate = await survey_model.getSurveyByCode({
          survey_code: code,
        });

        this.setState({
          survey_code: code,
          code_validate: duplicate.data.length
            ? {
              value: code,
              status: "INVALID",
              class: "is-invalid",
              text: "This code already exists.",
            }
            : {
              value: code,
              status: "VALID",
              class: "is-valid",
              text: "",
            },
        });
      }
    } else {
      this.setState({
        code_validate: { value: code, status: "", class: "", text: "" },
      });
    }
  };

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
                      allowClear={false}

                      onChange={(e, datestring) =>
                        this.setState({
                          survey_startdate: e[0] !== null ? e[0] : new Date(),
                          survey_enddate: e[1] !== null ? e[1] : new Date(),
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

export default Insert;
