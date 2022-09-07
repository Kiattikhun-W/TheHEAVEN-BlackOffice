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
import { timeFormat, lineUniversalLink } from "../../../utils";
import { MailParcelModel, UnitModel } from "../../../models";
import QRCode from "react-qr-code";



const mail_parcel_model = new MailParcelModel();
const unit_model = new UnitModel();

class Insert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      receiveCode: new Date().getTime().toString(),
      courier: "",
      trackingnumber: '',
      unitId: '',
      units: [],
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData = async () => {
    const idproperty = Number(localStorage.getItem("propertyid"));

    const now = new Date();
    const units = await unit_model.getUnitBy({ propertyId: idproperty })
    console.log('units',)
    this.setState({
      loading: false,
      units: units.result[0].item
    });
  };

  _handleSubmit = (event) => {
    const idproperty = localStorage.getItem("propertyid");
    event.preventDefault();

    this._checkSubmit() &&
      this.setState({ loading: true }, async () => {
        const res = await mail_parcel_model.insertMailParcel({
          //   survey_code: this.state.survey_code.trim(),
          receiveCode: this.state.recive,
          courier: this.state.courier.trim(),
          status: false,
          unit: Number(this.state.unitId),
          trackingNumber: this.state.trackingnumber,
          property: Number(idproperty),
        });

        if (res.code === 200) {
          Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success" });
          this.props.history.push(`/properties/${idproperty}/mailparcel`);
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
    if (!this.state.courier) {
      Swal.fire({ text: "กรุณากรอกขนส่ง", icon: "warning" });
      return false;
    } else if (!this.state.unitId) {
      Swal.fire({ text: "กรุณาระบุยูนิต", icon: "warning" });
      return false;
    }
    else {
      return true;
    }
  }


  render() {
    const idproperty = localStorage.getItem("propertyid");
    const courier_options = [
      { label: "- เลือกประเภท -", value: "" },
      { value: "Kerry Express", label: "Kerry Express" },
      { value: "Flash Express", label: "Flash Express" },
      { value: "DHL", label: "DHL" },
      { value: "J&T Express", label: "J&T Express" },
      { value: "Other", label: "Other" },
    ];
    const unit_options = [{ label: '- ระบุยูนิต -', value: '', }, ...this.state.units.map(item => ({
      label: item.unitName, value: item.id,
    }))]
    return (
      <div>
        <Loading show={this.state.loading} />
        <Card>
          <CardHeader style={{ backgroundColor: "#634ae2" }}>
            <h3 className="mb-0 text-white">
              เพิ่มแบบรายการพัสดุ / Add Mail Parcel{" "}
            </h3>
          </CardHeader>
          <Form onSubmit={this._handleSubmit}>
            <CardBody>
              <Row>
                <Col md={6}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <label>Receive Code <font color="#F00"><b>*</b></font></label>
                        <Input
                          type="text"
                          value={this.state.receiveCode}
                          onChange={(e) =>
                            this.setState({ receiveCode: e.target.value })
                          }
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <label>เลข Track <font color="#F00"><b>*</b></font></label>
                        <Input
                          type="text"
                          value={this.state.trackingnumber}
                          onChange={(e) =>
                            this.setState({ trackingnumber: e.target.value })
                          }
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <label>ขนส่ง<font color="#F00"><b>*</b></font></label>
                        <Select
                          options={courier_options}
                          value={this.state.courier}
                          onChange={(e) => this.setState({ courier: e })}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <label> ยูนิต<font color="#F00"> <b>*</b></font> </label>
                        <Select
                          options={unit_options}
                          value={this.state.unitId}
                          onChange={(e) => this.setState({ unitId: e })}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md={6}>
                  <Row>
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
                  </Row>

                </Col>
              </Row>
            </CardBody>
            <CardFooter className="text-right">
              <Button type="submit" color="success">
                Save
              </Button>
              <Link to={`/properties/${idproperty}/mailparcel`}>
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
