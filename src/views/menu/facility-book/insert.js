import React from "react";
import moment from "moment";
import QRCode from "react-qr-code";
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

import { Loading, Select, DataTable } from "../../../components/heaven-strap";

import {
  FacilityBookModel,
  FacilityZoneModel,
  UnitModel,
  UnitMemberModel,
} from "../../../models";
import { Tag, Divider, Calendar } from "antd";
import { timeFormat, lineUniversalLink } from "../../../utils";

const facility_book_model = new FacilityBookModel();
const facility_zone_model = new FacilityZoneModel();
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
      bookingNo: "B" + new Date().getTime().toString(),
      facility_zones: [],
      unit_members: [],
      units: [],
      index_buffers: [],
      time_lists: [],
      facilityZone: "",
      facility_book_name: "",
      bookParticipant: "",
      facility_book_code: "",
      facility_book_type: "",
      status: "",
      facility_book_date: moment(new Date()).format("YYYY-MM-DD"),
      time_selected: [],
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData = async () => {
    const now = new Date();
    const idproperty = localStorage.getItem("propertyid");

    const units = await unit_model.getUnitBy({
      propertyId: idproperty,
      limit: 500,
    });

    const facility_zones = await facility_zone_model.getFacilityZoneBy({
      propertyId: idproperty,
      limit: 500,
    });

    console.log(this.state.facility_book_date);

    this.setState({
      loading: false,
      facility_zones: facility_zones.result[0].item,
      units: units.result[0].item,
    });
  };

  _unitSelected = async (e) => {
    if (e !== "") {
      const unit_members = await unit_member_model.getUnitMemberBy({
        unit: Number(e),
        limit: 500,
      });
      console.log("unit_members", unit_members);
      this.setState({
        unitUser: "",
        unit_code: e,
        unit_members: unit_members.result[0].item,
      });
    } else if (e === "") {
      this.setState({
        unit_code: e,
        unit_members: [],
        unitUser: "",
        user_phone: "",
      });
    }
  };
  _contactSelected = async (e) => {
    if (e !== "") {
      const unit_members = await unit_member_model.getUnitMemberBy({
        id: Number(e),
        limit: 500,
      });
      console.log(unit_members.result[0].item);
      const { user_phone } = unit_members.result[0].item[0];
      this.setState({
        unitUser: e,
        user_phone,
      });
    } else if (e === "" || this.state.unitUser === "") {
      this.setState({
        unitUser: e,
        user_phone: "",
      });
    }
  };

  _handleSubmit = (event) => {
    const idproperty = localStorage.getItem("propertyid");
    event.preventDefault();

    console.log(String(this.state.time_selected[0] + 1));
    this._checkSubmit() &&
      this.setState({ loading: true }, async () => {
        const res = await facility_book_model.insertFacilityBook({
          // unit_code: this.state.unit_code.trim(),
          unitUser: this.state.unitUser,
          bookParticipant: Number(this.state.bookParticipant),
          facilityZone: this.state.facilityZone,
          bookStarttime: String(this.state.time_selected[0]),
          bookEndtime: String(this.state.time_selected[0] + 1),
          bookDate: this.state.facility_book_date,
          bookStatus: "Waiting",
          bookingNo: this.state.bookingNo,
        });

        if (res.code === 200) {
          Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success" });
          this.props.history.push(`/properties/${idproperty}/facilitybook`);
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
    if (!this.state.unitUser) {
      Swal.fire({ text: "กรุณาระบุสมาชิก", icon: "warning" });
      return false;
    } else if (!this.state.unit_code) {
      Swal.fire({ text: "กรุณาระบุยูนิต", icon: "warning" });
      return false;
    } else if (!this.state.facilityZone) {
      Swal.fire({ text: "กรุณาระบุพื้นที่ส่วนกลาง", icon: "warning" });
      return false;
    } else if (!this.state.facilityZone) {
      Swal.fire({ text: "กรุณาระบุพื้นที่ส่วนกลาง", icon: "warning" });
      return false;
    } else if (
      this.state.bookParticipant > this.state.index_buffers[0]?.capacity
    ) {
      Swal.fire({ text: "จำนวนคนมากกว่าความจุ", icon: "warning" });
      return false;
    } else if (this.state.time_selected.length === 0) {
      Swal.fire({ text: "โปรดเลือกเวลาจอง", icon: "warning" });
      return false;
    } else {
      return true;
    }
  }

  _handleDatetimeBooking = async (date) => {
    const time_lists = await facility_book_model.checkDateTimeBooking({
      facilityId: this.state.facilityZone,
      bookDate: this.state.facility_book_date,
    });
    console.log(time_lists);
    this.setState({
      time_lists: time_lists.result,
      time_selected: [],
    });
  };

  // _handleDatetimeBooking = async (date) => {
  //     if (e !== '') {
  //         const time_lists = await facility_book_model.checkDateTimeBooking({ facilityId: e ,
  //             bookDate:this.state.facility_book_date

  //         })
  //         console.log(time_lists)
  //         this.setState({
  //             time_lists:time_lists.result,
  //             facilityZone: e,
  //             time_selected: []
  //         })
  //     } else {
  //         this.setState({
  //             facilityZone: e,
  //             time_lists: [],
  //             time_selected: []
  //         })
  //     }
  // }
  // _handleDateSelected = async (date) => {
  //     const dates = await facility_zone_model.checkDateTimeBooking({ date })

  // }

  render() {
    const idproperty = localStorage.getItem("propertyid");
    const facility_zone_options = [
      { label: "- ระบุพื้นที่ส่วนกลาง -", value: "" },
      ...this.state.facility_zones.map((item) => ({
        label: item.facilityName,
        value: item.id,
      })),
    ];
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
    const status_options = [
      { label: "- ระบุสถานะ -", value: "" },
      { value: "Wait", label: "รอเช็คอิน" },
      { value: "Checkin", label: "เช็คอิน" },
      { value: "Cancel", label: "ยกเลิก" },
    ];

    return (
      <div>
        <Loading show={this.state.loading} />
        <Card>
          <CardHeader style={{ backgroundColor: "#634ae2" }}>
            <h3 className="mb-0 text-white">
              เพิ่มรายการจองพื้นที่ส่วนกลาง / Add FacilityBook{" "}
            </h3>
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
                  </FormGroup>
                </Col>
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
                      value={this.state.unitUser}
                      onChange={(e) => this._contactSelected(e)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <label>
                      จำนวนเข้าใช้{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </label>
                    <Input
                      type="number"
                      value={this.state.bookParticipant}
                      onChange={(e) =>
                        this.setState({ bookParticipant: e.target.value })
                      }
                      onBlur={this._handleParticipant}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <label>
                      พื้นที่ส่วนกลาง{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </label>
                    <Select
                      options={facility_zone_options}
                      value={this.state.facilityZone}
                      onChange={(e) => {
                        this.setState(
                          {
                            facilityZone: e,
                          },
                          () => this._handleDatetimeBooking()
                        );
                      }}
                    />
                  </FormGroup>
                </Col>
                {/* <Col md={3}>
                                    <FormGroup>
                                        <label>สถานะ <font color="#F00"><b>*</b></font></label>
                                        <Select
                                            options={status_options}
                                            value={this.state.status}
                                            onChange={(e) => this.setState({ status: e })}
                                        />
                                    </FormGroup>
                                </Col> */}
              </Row>
              <Row>
                <Col md={6}>
                  <h4>หมายเลขการจอง {this.state.bookingNo}</h4>
                  <div
                    style={{
                      borderRadius: 0,
                      // border: "solid 2px rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ margin: 30, display: "inline-block" }}>
                      <QRCode
                        value={`${lineUniversalLink}booking/booking-checkin/?booking-no=${this.state.bookingNo}`}
                        size={180}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="site-calendar-fazility-booking">
                    <Calendar
                      defaultValue={moment(new Date())}
                      fullscreen={false}
                      mode="month"
                      onChange={async (date) => {
                        //   this._handleDateSelected(date)
                        this.setState(
                          {
                            facility_book_date:
                              moment(date).format("YYYY-MM-DD"),
                          },
                          async () =>
                            await this._handleDatetimeBooking(
                              moment(date).format("YYYY-MM-DD")
                            )
                        );
                        // await apiCheckDateTimeBooking(
                        //   moment(date).format(formatDate)
                        // );
                        // form.setFieldsValue({ paticipant: null });
                        // setDisableParticipant(true);
                        // checkOldDateTime(
                        //   moment(date).format(formatDate),
                        //   timeSelected,
                        //   maxCapacity
                        // );
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <label>
                    <h5>
                      จองเวลา
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </h5>
                  </label>
                  <p className="text-muted">
                    เวลาจะอิงจากเวลาเปิดปิดพื้นที่ส่วนกลาง
                  </p>
                  <DataTable
                    loading={this.state.loading}
                    dataSource={this.state.time_lists}
                    pagination={false}
                    bordered={false}
                    setProps={{
                      rowSelection: {
                        type: "radio",
                        selectedRowKeys: this.state.time_selected,
                        onChange: (selectedRowKeys, selectedRows) => {
                          // console.log("selectedRowKeys",selectedRowKeys[0])
                          //selectedRowKeys return [10],selectedRows return [{day:10}]
                          this.setState({
                            index_buffers: selectedRows,
                            time_selected: selectedRowKeys,
                          });
                        },
                        getCheckboxProps: (record) => {
                          let _dateData = null;
                          if (record.hours < 10) {
                            _dateData = new Date(
                              `${moment(this.state.facility_book_date).format(
                                "YYYY-MM-DD"
                              )} 0${record.hours}:00`
                            ).getTime();
                          } else {
                            _dateData = new Date(
                              `${moment(this.state.facility_book_date).format(
                                "YYYY-MM-DD"
                              )} ${record.hours}:00`
                            ).getTime();
                          }
                          let dateNow = Date.now();
                          console.log(record);
                          return {
                            disabled:
                              record.canSelected === false ||
                              dateNow > _dateData,
                            // test:console.log(new Date(`${moment(this.state.facility_book_date).format("YYYY-MM-DD")}`).getTime())

                            // || (
                            //     new Date().getHours() > Number(record.hours)
                            //     && Number(new Date().toLocaleString().split('/')[1]) === Number(this.state.facility_book_date.split('-')[2])
                            //     && Number(new Date().getFullYear()) === Number(this.state.facility_book_date.split('-')[0])
                            //     && Number(new Date().getMonth()+1) === Number(this.state.facility_book_date.split('-')[1])
                            //     )
                            // ||  Number(new Date().toLocaleString().split('/')[1]) > Number(this.state.facility_book_date.split('-')[2]) //day
                            // ||  Number(new Date().getFullYear()) > Number(this.state.facility_book_date.split('-')[0]) // year
                            // ||  Number(new Date().getMonth()+1) > Number(this.state.facility_book_date.split('-')[1]) // month
                            // ,
                            // test:console.log(new Date().getHours() > Number(record.hours)
                            // && Number(new Date().toLocaleString().split('/')[1]) === Number(this.state.facility_book_date.split('-')[2])
                            // && Number(new Date().getFullYear()) === Number(this.state.facility_book_date.split('-')[0])
                            // && Number(new Date().getMonth()+1) === Number(this.state.facility_book_date.split('-')[1]))
                          };
                        },
                      },
                      showHeader: false,
                    }}
                    rowKey="hours"
                    columns={[
                      {
                        title: "",
                        dataIndex: "hours",
                        filterAble: true,
                        ellipsis: true,
                        render: (val) => {
                          return (
                            <>
                              {String(val).length === 1
                                ? `0${val}:00`
                                : `${val}:00`}
                            </>
                          );
                        },
                      },
                      {
                        key: "id",
                        title: "textStatus",
                        dataIndex: "textStatus",
                        render: (text, record) => {
                          return (
                            <>
                              {!record.canSelected ? (
                                <span style={{ color: "red" }}>{text} </span>
                              ) : (
                                <span style={{ color: "green" }}>
                                  {text} {record.capacity}
                                </span>
                              )}
                            </>
                          );
                        },
                      },
                    ]}
                  />
                </Col>
              </Row>
              {/* <Row>
                                    <Col md={12}>
                                        <div
                                            style={{
                                                borderRadius: 0,
                                                border: "solid 2px rgba(0, 0, 0, 0.1)",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div style={{ margin: 30, display: "inline-block" }}>
                                                <QRCode
                                                    value={`${lineUniversalLink}/mail-parcel/confirm-receive/?id=${this.state.mailParcelId}&receive-code=${this.state.receiveCode}`}
                                                    size={180}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row> */}
            </CardBody>
            <CardFooter className="text-right">
              <Button type="submit" color="success">
                Save
              </Button>
              <Link to={`/properties/${idproperty}/facilitybook`}>
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
