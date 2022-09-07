import React from "react";
import { CardBody, CardHeader, FormGroup, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Loading, DataTable } from "../../../../components/heaven-strap";

import { MailParcelModel, UnitModel } from "../../../../models";
import { Pagination, Tag, Button, Card, Divider } from "antd";
import { numberFormat, timeFormat } from "../../../../utils";

const mail_parcel_model = new MailParcelModel();
const unit_model = new UnitModel();


class CardInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      mail_parcels: [],
      paginationDatas: {
        total: "",
      },
      dataSource: [],
      units: [],
      pageno: 1,
      index_buffers: []
    };
  }


  render() {

    return (
      <div>
        <Row >
          {/* <Col md={12} className="d-flex justify-content-center"> */}
          {this.props.type === 'topic' ?
            <Col md={12} className="d-flex justify-content-center">
              <Card style={{ backgroundColor: '#634ae2', }} className="w-75 ">
                <h4 style={{ color: 'yellow' }}>{this.props.type === 'topic' ? 'หัวข้อกระทู้' : 'ตอบกระทู้'}</h4>
                <h4 className="text-white">{this.props.data?.user?.fullname}</h4>
                <h6 className="text-white">{timeFormat.showFullDateTimeTH(this.props.data?.createdAt)}</h6>
                <hr style={{ border: '1px solid white' }} />
                <h5 className="text-white">{this.props.data?.title}</h5>

              </Card></Col> : this.props.messages.map((item, idx) => item.user.role === 'user' ? <Col key={idx} md={12} className="d-flex justify-content-center"><Card style={{ backgroundColor: '#46388a', }} className="w-75 ">
                <div className="d-flex justify-content-between">
                  <h4 style={{ color: 'yellow' }}>{this.props.type === 'topic' ? 'หัวข้อกระทู้' : 'ตอบกระทู้'}</h4>
                  {/* <h4 className="text-white">{"#"+Number(idx+1)}</h4> */}
                </div>
                <h4 className="text-white">{item.message}</h4>
                <hr style={{ border: '1px solid white' }} />
                <h5 className="text-white d-flex justify-content-end">{item.user.firstname + " " + item.user.lastname}</h5>
                <h6 className="text-white d-flex justify-content-end">{timeFormat.showFullDateTimeTH(item.createdAt)}</h6>
              </Card></Col> : <Col key={idx} md={12} className="d-flex justify-content-center"><Card style={{ backgroundColor: '#ffffff', }} className="w-75 ">
                <div className="d-flex justify-content-between">
                  <h4 style={{ color: 'black' }}>{this.props.type === 'topic' ? 'หัวข้อกระทู้' : 'ตอบกระทู้'}</h4>
                </div>

                <div className="text-black overflow-auto" dangerouslySetInnerHTML={{ __html: item.message }}></div>
                <hr style={{ border: '1px solid black' }} />
                <h5 className="text-black d-flex justify-content-start">The Heaven Team</h5>
                <h6 className="text-black d-flex justify-content-start">{timeFormat.showFullDateTimeTH(item.createdAt)}</h6>
              </Card></Col>)
          }
          {/* </Col> */}
        </Row>
      </div>
    );
  }
}

export default CardInformation;
