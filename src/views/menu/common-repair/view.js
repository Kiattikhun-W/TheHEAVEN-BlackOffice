import React from "react"
import {
  Card,

  CardBody,
  CardHeader,
} from "reactstrap"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"

import { Loading, DataTable } from "../../../components/heaven-strap"

import { RepairCommonModel, } from "../../../models"
import {
  Tag, Divider, Pagination,
} from 'antd';

const repair_common_model = new RepairCommonModel()

class View extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      pageno: 1,
      repair_commons: [],
      dataSource: [],
      paginationDatas: {
        total: 0
      }
    }
  }

  componentDidMount() {
    this._fetchData()
  }

  _fetchData = () => this.setState({ loading: true, }, async () => {
    const idproperty = localStorage.getItem("propertyid");

    const repair_commons = await repair_common_model.getRepairCommonBy({
      propertyId: idproperty
    })
    this.setState({
      loading: false,
      repair_commons,
      dataSource: repair_commons.result[0],
      paginationDatas: {
        total: repair_commons.result[0].total
      },
    })
  })

  _onDelete = (code) => Swal.fire({
    title: "คุณแน่ใจหรือไม่ ?",
    text: "ยืนยันลบรายการนี้",
    icon: "warning",
    showCancelButton: true,
  }).then(({ value }) => value && this.setState({ loading: true, }, async () => {
    const res = await repair_common_model.deleteRepairCommonByCode(Number(code))
    if (res.code === 200) {
      Swal.fire({ title: 'ลบรายการแล้ว !', text: '', icon: 'success' })
      this._fetchData()
    } else {
      this.setState({ loading: false, }, () => {
        Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
      })
    }
  }))

  handleChangePagination = async (page, pageSize) => {
    try {
      this.setState({
        loading: true,
        pageno: page,
      });
      const property = Number(localStorage.getItem("propertyid"));
      const res = await await repair_common_model.getRepairCommonBy({
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

  render() {
    const { permission_add, permission_edit, permission_delete, } = this.props.PERMISSION
    const idproperty = localStorage.getItem("propertyid");


    return (
      <div>
        <Loading show={this.state.loading} />
        <Card className="cardTable">
          <CardHeader style={{ backgroundColor: '#634ae2' }}>
            <h3 className="text-header text-white">แจ้งซ่อมพื้นที่ส่วนกลาง </h3>
            {permission_add &&
              <Link to={`/properties/${idproperty}/repaircommon/insert`} className="btn btn-success float-right" >
                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มรายการ
              </Link>
            }
          </CardHeader>

          <CardBody>
            <DataTable
              onChange={this._fetchData}
              pagination={false}
              showRowNo={false}
              style={{ overFlow: 'auto' }}
              dataSource={this.state.dataSource.item}
              rowKey="id"
              columns={[
                {
                  title: "รหัสแจ้งซ่อม ",
                  dataIndex: "jobNo",
                  filterAble: true,
                  // ellipsis: true,
                  align: 'center',
                },



                {
                  title: "แจ้งโดย",
                  // ellipsis: true,                  
                  align: 'center',
                  render: (cell) => cell.user.userFullname
                },
                {
                  title: "รายละเอียด",
                  dataIndex: "description",
                  filterAble: true,
                  align: 'center',

                },
                {
                  title: "สถานะ",
                  dataIndex: "status",
                  ellipsis: true,
                  // width:100,           
                  filters: [
                    { value: "Waiting", text: "รอดำเนินการ" },
                    { value: "Process", text: "อยู่ระหว่างดำเนินการ" },
                    { value: "Done", text: "เสร็จสิ้น" },
                    { value: "Cancel", text: "ยกเลิก" },

                  ],
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
                  title: '',
                  dataIndex: '',
                  render: (cell) => {
                    const row_accessible = []

                    if (permission_edit) {
                      row_accessible.push(
                        <Link key="update" to={`/properties/${idproperty}/repaircommon/update/${cell.id}`} title="แก้ไขรายการ">
                          <button type="button" className="icon-button color-warning">
                            <i className="fa fa-pencil-square-o" aria-hidden="true" />
                          </button>
                        </Link>
                      )
                    }
                    if (permission_delete) {
                      row_accessible.push(
                        <button key="delete" type="button" className="icon-button color-danger" onClick={() => this._onDelete(cell.id)} title="ลบรายการ">
                          <i className="fa fa-trash" aria-hidden="true" />
                        </button>
                      )
                    }

                    return row_accessible
                  },
                  width: 80,
                },
              ]}
            />
          </CardBody>
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
    )
  }
}

export default View
