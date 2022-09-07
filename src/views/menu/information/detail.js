import React from "react";
import moment from "moment";
import GLOBAL from "../../../GLOBAL";

import {
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
import { PictureOutlined } from '@ant-design/icons';

import { Loading, Select } from "../../../components/heaven-strap";
// import { SunEditor } from "../../../components/modals";
import SunEditor from 'suneditor-react';
import "suneditor/dist/css/suneditor.min.css";
import { InformationModel } from "../../../models";
import {
  handleImageUploadBefore,
  configToobars,
} from "../../../models/menu-server/suneditor"
import { Switch, DatePicker, Pagination, Upload, Button } from "antd";
import { timeFormat } from "../../../utils";
import CardInformation from "../information/components/CardInformation"
const { RangePicker } = DatePicker;
const information_model = new InformationModel();
const idproperty = localStorage.getItem("propertyid");

class Update extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: 0,
      code_validate: {
        value: "",
        status: "",
        class: "",
        text: "",
      },
      paginationDatas: {
        total: "",
      },
      informations: [],
      pageno: 1,
      title: "",
      fullname: "",
      message: '',
      descriptionTH: '',
      createdAt: new Date(),
      messages: [],
      informationMessage_image: {
        src: `https://cdn.discordapp.com/attachments/914042035802112061/931939477503508610/254337478_571291797460516_304746305366841547_n.png`,
        file: null,
        old: '',
      },
      upload_path: "informationMessage/",
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData = async () => {
    const { code } = this.props.match.params;

    const informations = await information_model.getInformationByCode({ id: code });

    // console.log(informations);

    if (informations.code !== 200) {
      Swal.fire({
        title: "ข้อผิดพลาด !",
        text: "ไม่สามารถโหลดข้อมูล",
        icon: "error",
      });
      this.props.history.push(`/properties/${idproperty}/information`);
    } else if (informations.result.length === 0) {
      Swal.fire({
        title: "ไม่พบรายการนี้ในระบบ !",
        text: code,
        icon: "warning",
      });
      this.props.history.push(`/properties/${idproperty}/information`);
    } else {
      const {
        id,
        title,
        user,
        createdAt,
      } = informations.result[0];
      const informations_messages = await information_model.getInformationMessageBy({ information: id, page: 1, limit: 5 });

      // console.log(" informations.result", informations_messages.result[0].item)
      this.setState({
        loading: false,
        title,
        id,
        informations: informations.result[0],
        fullname: user.fullname,
        createdAt: timeFormat.validateDate(createdAt),
        messages: informations_messages.result[0].item,
        paginationDatas: {
          total: informations_messages.result[0].total,
        },
      });
    }
  };

  _handleSubmit = (event) => {
    event.preventDefault();
    console.log("image", (this.props.USER))
    const idproperty = Number(localStorage.getItem("propertyid"));

    this._checkSubmit() &&
      this.setState({ loading: true }, async () => {
        const res = await information_model.insertInformationMessage(
          {
            message: this.state.message.trim(),
            information: this.state.id,
            user: this.props.USER.id,
          }
        );

        if (res.code === 200) {
          Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success" });
          this._fetchData()
          this.setState({
            message: ''
          })
          // this.props.history.push(`/properties/${idproperty}/information`);
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
    if (this.state.message === '') {
      Swal.fire({ text: "กรุณากรอกคอมเม้น", icon: "warning" });
      return false;
    } else {
      return true;
    }
  }
  handleChangePagination = async (page, pageSize) => {
    try {
      this.setState({
        loading: true,
      });
      const property = Number(localStorage.getItem("propertyid"));

      const res = await information_model.getInformationMessageBy({
        page: page === 0 ? 1 : page,
        limit: pageSize,
        information: this.state.id
      });
      console.log("page,pageSize", page, pageSize)

      console.log("respag", res.result);
      if (res.code === 200) {
        this.setState({
          messages: res.result[0].item,
          loading: false,
          pageno: page,
          paginationDatas: {
            total: res.result[0].total,

          },
        });
      }
    } catch (error) { }
  };

  _handleImageChange(img_name, e) {
    if (e.target.files.length) {
      let file = new File([e.target.files[0]], e.target.files[0].name, { type: e.target.files[0].type, })
      console.log(file)

      if (file) {
        let reader = new FileReader()

        reader.onloadend = () => {
          this.setState(state => {
            if (img_name === "informationMessage_image") {
              return {
                informationMessage_image: {
                  src: reader.result,
                  file: file,
                  old: state.informationMessage_image.old,
                },
              }
            }
          })
        }
        reader.readAsDataURL(file)
      }
    }
  }
  _handleImageUploadBefore = async (files, info, uploadHandler) => {
    const formData = new FormData()
    formData.append("file", files[0]);
    let result = null;

    try {
      let res = await fetch(`${GLOBAL.BASE_SERVER.URL_IMG}api/v1/media/upload/file`, {
        method: "POST",
        body: formData,
        headers: GLOBAL.ACCESS_TOKEN,
      });
      result = await res.json();
    } catch (error) {
      console.log("ERROR", error);
    }
    let resultza = result.result[0].url = GLOBAL.BASE_SERVER.URL_IMG
    const response = {
      result: [
        {
          url: GLOBAL.BASE_SERVER.URL_IMG,
          name: result.result[0].fileName,
          size: result.result[0].size,
          // path: result.result[0].path

        }
      ]
    };
    console.log("result", result.result[0])
    uploadHandler(response.result[0]);
  }

  render() {
    const idproperty = localStorage.getItem("propertyid");

    return (
      <div >
        <Loading show={this.state.loading} />
        {/* <Card style={{backgroundColor:'gray'}}> */}
        <CardInformation data={this.state.informations} type={'topic'} />
        {this.state.messages.length !== 0 ? <CardInformation page={this.state.pageno} messages={this.state.messages} type={'message'} /> : null}




        {/* <div  style={{ marginLeft: 55, marginRight: 55 }} > */}
        <Row>
          <Col md={12}  >
            <FormGroup
              className="d-flex justify-content-center"
            >
              {/* <Input
                // style={{ width: 1050 }}
                className="w-75"
                type="textarea"
                rows={5}
                placeholder="แสดงความคิดเห็น"
                // value={this.state.receiveCode}
                onChange={(e) =>
                  this.setState({ message: e.target.value })
                }
              /> */}
              {console.log("text", this.state.message)}
              <SunEditor

                onImageUploadBefore={(files, info, uploadHandler) => {
                  console.log(files[0])
                  if (files[0].size > 2097152) {
                    Swal.fire({ text: "รูปภาพต้องมีขนาดไม่เกิน 2MB", icon: "warning", })
                    return false
                  }
                  else {
                    const formData = new FormData()
                    formData.append("file", files[0]);
                    let response1 = {}
                    const res_upload = fetch(
                      `${GLOBAL.BASE_SERVER.URL_IMG}api/v1/media/upload/file`,
                      {
                        method: "POST",
                        headers: GLOBAL.ACCESS_TOKEN,
                        body: formData,
                      }
                    ).then((response) => response.json().then((e) => {
                      console.log(e)
                      response1 = {
                        result: [
                          {
                            url: GLOBAL.BASE_SERVER.URL_IMG + 'image/' + e.result[0].fileName,
                            // name: e.result[0].fileName,
                          }
                        ]


                      };
                      console.log("response1", response1)
                      uploadHandler(response1);

                    })).catch((error) => ({ require: false, data: [], err: error }));


                    console.log("res_upload", res_upload)
                  }


                }}
                setContents={this.state.message}
                onChange={(e) => this.setState({
                  message: e
                })}
                width="75%"
                height="auto"
                setOptions={{
                  buttonList: configToobars
                }}
              />
            </FormGroup>
          </Col>

          <Col className="d-flex justify-content-center" md={12}>
            <div className="d-flex justify-content-start w-75">
              <Button className="   " size='large' type='primary' onClick={this._handleSubmit}>ตอบกระทู้</Button>
            </div>

            {/* <Input
              id="sx"
              style={{ display: 'none' }}
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => this._handleImageChange("informationMessage_image", e)}
            />
            <label htmlFor={"sx"} className="btn btn-success p-5">
           ว่าไงวัยรุ่น

            </label> */}
            {/* <Upload className="d-inline" onChange={(e) => this._handleImageChange("informationMessage_image", e)} >
              <Button style={{ backgroundColor: "#28a745", borderColor: '#28a745' }} className="mt-2 " size='large' icon={<PictureOutlined />} type='primary'>แนบรูป</Button>
            </Upload> */}
            {/* <Button className="mt-2 " size='large' type='primary' onClick={this._handleSubmit}>ตอบกระทู้</Button> */}
            {/* <img
              className="image-upload"
              style={{}}
              src={this.state.informationMessage_image.src}
              alt="profile"
            /> */}
          </Col>
        </Row>
        {/* </div> */}
        {/* </Card> */}

        <div className="paginationTable my-3">
          <Pagination
            total={this.state.paginationDatas?.total}
            showSizeChanger
            showTotal={(total) => `Total ${total} items`}
            defaultPageSize={5}
            current={this.state.pageno}
            onChange={(page, pageSize) =>
              this.handleChangePagination(page, Number(pageSize))
            }
          />
        </div>


      </div >
    );
  }
}

export default Update;
