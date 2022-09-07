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

import { ExpenseModel, UnitModel, UnitMemberModel } from "../../../models";
import { Tag, Divider, Tabs, Space, DatePicker } from "antd";
import ExpenseList from "./components/expense-list";
import { handleFilter, numberFormat, timeFormat } from "../../../utils";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const expense_model = new ExpenseModel();
const unit_model = new UnitModel();
const unit_member_model = new UnitMemberModel();

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
      unit_code: "",
      units: [],
      expense_startdate: new Date(),
      expense_enddate: new Date(),
      user_phone: "",
      unit_members: [],
      expense_date: "",
      expense_code: "",
      unit_member_code: "",
      expense_lists: [],
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData = async () => {
    const idproperty = localStorage.getItem("propertyid");

    const units = await unit_model.getUnitBy({
      propertyId: Number(idproperty),
      limit: 500
    });

    this.setState({
      loading: false,
      code_validate: {
        // value: last_code.data,
        status: "VALID",
        class: "",
        text: "",
      },
      //   expense_code: last_code.data,
      units: units.result[0].item,
    });
  };

  _handleSubmit = (event) => {
    const idproperty = localStorage.getItem("propertyid");
    event.preventDefault();
    // console.log(pg)

    this._checkSubmit() &&
      this.setState({ loading: true }, async () => {
        const res = await expense_model.insertExpense({
          expense_code: this.state.expense_code,
          unit: this.state.unit_code,
          expense_startdate: timeFormat.dateToStr(this.state.expense_startdate),
          expense_enddate: timeFormat.dateToStr(this.state.expense_enddate),
          unitUser: this.state.unit_member_code,
          expense_lists: this.state.expense_lists.map((item) => ({
            expense_list_name: item.expense_list_name,
            expense_list_unit: numberFormat.toInt(item.expense_list_unit),
            expense_list_price: numberFormat.toFloat(item.expense_list_price),
            expense_list_total: numberFormat.toFloat(item.expense_list_total),
            expense_list_id: item.expense_list_id
          })),
          expense_total: numberFormat.toFloat(this.state.expense_total),
          property: Number(idproperty),
        });

        if (res.code === 200) {
          Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success" });
          this.props.history.push(`/properties/${idproperty}/expenses`);
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
    if (!this.state.unit_code) {
      Swal.fire({ text: "โปรดระบุยูนิต", icon: "warning" });
      return false;
    }
    else if (!this.state.unit_member_code) {
      Swal.fire({ text: "โปรดระบุสมาชิก", icon: "warning" });
      return false;

    } else if (this.state.user_phone === '' || this.state.user_phone === 0) {
      Swal.fire({ text: "ยูนิตนี้ไม่มีเจ้าของ", icon: "warning" });
      return false;
    }
    else if (this.state.expense_lists.length === 0) {
      Swal.fire({ text: "กรุณากรอกรายการบิล", icon: "warning" });
      return false;
    }
    else {
      return true;
    }
  }

  _checkCode = async () => {
    const code = this.state.expense_code.replace(/\//g, "-").trim();

    if (code.length) {
      if (this.state.code_validate.value !== code) {
        const duplicate = await expense_model.getExpenseByCode({
          expense_code: code,
        });

        this.setState({
          expense_code: code,
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

  _unitSelected = async (e) => {
    if (e !== "") {
      const unit_members = await unit_member_model.getUnitMemberBy({
        unit: Number(e),
        limit: 500

      });
      console.log("unit_members", unit_members)
      this.setState({
        unit_code: e,
        unit_members: unit_members.result[0].item,
      });
    } else if (e === "") {
      this.setState({
        unit_code: e,
        unit_members: [],
        unit_member_code: "",
        user_phone: "",
      });
    }
  };
  _contactSelected = async (e) => {
    if (e !== "") {
      const unit_members = await unit_member_model.getUnitMemberBy({
        id: Number(e),
        limit: 500
      });
      console.log(unit_members.result[0].item);
      const { user_phone } = unit_members.result[0].item[0];
      this.setState({
        unit_member_code: e,
        user_phone,
      });
    } else if (e === "" || this.state.unit_member_code === "") {
      this.setState({
        unit_member_code: e,
        user_phone: "",
      });
    }
  };
  _calculateAll = () => {
    let total_price = 0.0;
    this.state.expense_lists.forEach((item) => {
      total_price += numberFormat.toFloat(item.expense_list_total);
    });
    console.log("total_price", total_price);

    this.setState({
      expense_total: numberFormat.decimalFix(total_price, 2),
    });
  };

  render() {
    const idproperty = localStorage.getItem("propertyid");
    const unit_options = [
      { label: "- ระบุยูนิต -", value: "" },
      ...this.state.units.map((item) => ({
        label: item.unitName,
        value: item.id,
      })),
    ];
    const unit_member_options = [
      { label: "- ระบุผู้ติดต่อ -", value: "" },
      ...this.state.unit_members.map((item) => ({
        label: item.user_fullname,
        value: item.id,
      })),
    ];
    return (
      <div>
        <Loading show={this.state.loading} />
        <Card>
          <CardHeader style={{ backgroundColor: "#634ae2" }}>
            <h3 className="mb-0 text-white">เพิ่มบิล / Add Expense </h3>
          </CardHeader>
          <Form onSubmit={this._handleSubmit}>
            <CardBody>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <label>
                      ยูนิต{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </label>
                    <Select
                      options={unit_options}
                      value={this.state.unit_code}
                      onChange={(e) => this._unitSelected(e)}
                    />
                    <p className="text-muted">Example : 0812345678.</p>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <label>
                      ผู้ติดต่อ{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </label>
                    <Select
                      options={unit_member_options}
                      value={this.state.unit_member_code}
                      onChange={(e) => this._contactSelected(e)}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <label>
                      เบอร์โทรศัพท์{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </label>
                    <Input
                      type="text"
                      value={this.state.user_phone}
                      onChange={(e) =>
                        this.setState({ user_phone: e.target.value })
                      }
                      disabled
                    />
                    <p className="text-muted">Example : 0812345678.</p>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <label>
                      วันที่เริ่มและวันที่สิ้นสุดรอบบิล{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </label>
                    <RangePicker
                      value={[moment(this.state.expense_startdate, 'DD/MM/YYYY'), moment(this.state.expense_enddate, 'DD/MM/YYYY')]}

                      onChange={(e, datestring) =>
                        this.setState({
                          expense_startdate: e[0],
                          expense_enddate: e[1],
                        })
                      }
                      format="DD/MM/YYYY"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="รายการค่าใช้จ่าย" key="1">
                      <ExpenseList
                        onRefresh={(e) =>
                          this.setState(
                            {
                              expense_lists: e.expense_lists,
                            },
                            () => {
                              this._calculateAll();
                            }
                          )
                        }
                      />
                    </TabPane>
                  </Tabs>
                </Col>
                <Col md={12} className="d-flex justify-content-end">
                  <FormGroup>
                    <label>
                      รวมเงินทั้งสิ้น{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </label>
                    <Input
                      type="text"
                      className="float text-center"
                      value={this.state.expense_total}
                      readOnly
                    />
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
            <CardFooter className="text-right">
              <Button type="submit" color="success">
                Save
              </Button>
              <Link to={`/properties/${idproperty}/expenses`}>
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
