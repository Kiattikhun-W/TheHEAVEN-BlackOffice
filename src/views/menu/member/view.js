import React from "react"
import {
  Card,
  CardBody,
  CardHeader,
  FormGroup,
} from "reactstrap"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"

import { Loading, DataTable } from "../../../components/heaven-strap"
import { Pagination } from 'antd'
import { MemberModel, UnitMemberModel } from "../../../models"

const unit_member_model = new UnitMemberModel()

class View extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      members: [],
      pageno: 1,
      dataSource: [],
      paginationDatas: {
        total: "",
      },
    }
  }

  componentDidMount() {
    this._fetchData()
  }

  _fetchData = () => this.setState({ loading: true, }, async () => {
    const idproperty = Number(localStorage.getItem("propertyid"));

    const members = await unit_member_model.getUnitMemberWebBy({
      propertyId: idproperty
    })


    console.log("members", members?.result[0].item)
    this.setState({
      loading: false,
      members,
      paginationDatas: {
        total: members?.result[0].total
      },
      dataSource: members?.result[0]
    })
  })

  handleChangePagination = async (page, pageSize) => {
    try {
      this.setState({
        loading: true,
        pageno: page,
      });
      const property = Number(localStorage.getItem("propertyid"));
      const res = await unit_member_model.getUnitMemberWebBy({
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

  _onDelete = (arrDel) => Swal.fire({
    title: "คุณแน่ใจหรือไม่ ?",
    text: "ยืนยันลบรายการนี้",
    icon: "warning",
    showCancelButton: true,
  }).then(({ value }) => value && this.setState({ loading: true, }, async () => {
    console.log("arrDel", arrDel)
    let res = null
    for (let del of arrDel) {
      res = await unit_member_model.deleteUnitMemberByCode(Number(del.id))
    }
    if (res.code === 200) {
      Swal.fire({ title: 'ลบรายการแล้ว !', text: '', icon: 'success' })
      this._fetchData()
    } else {
      this.setState({ loading: false, }, () => {
        Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
      })
    }


  }))

  render() {
    const { permission_add, permission_edit, permission_delete, } = this.props.PERMISSION
    const idproperty = localStorage.getItem("propertyid");

    return (
      <div>
        <Loading show={this.state.loading} />
        <Card>
          <CardHeader style={{ backgroundColor: '#634ae2' }}>
            <h3 className="text-header text-white">ลูกบ้าน </h3>
            {/* {permission_add &&
              <Link to={`/properties/${idproperty}/member/insert`} className="btn btn-success float-right" >
                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มลูกบ้าน
              </Link>
            } */}
          </CardHeader>

          <CardBody>
            <DataTable
              onChange={this._fetchData}
              showRowNo={false}
              pagination={false}
              dataSource={this.state.dataSource.item}
              rowKey="id"
              columns={[

                {
                  title: "ชื่อ",
                  // filterAble: true,
                  ellipsis: true,
                  render: (cell) => cell.firstname + " " + cell.lastname
                },
                {
                  title: "ยูนิต",
                  // filterAble: true,
                  ellipsis: true,
                  render: (cell) => {
                    return cell.unitUser.map(item => {
                      return item.unit.unitName + " "
                    });
                  }
                },

                {
                  title: '',
                  dataIndex: '',
                  render: (cell) => {
                    const row_accessible = []

                    if (permission_edit) {
                      row_accessible.push(
                        <Link key="update" to={`/properties/${idproperty}/member/update/${cell.id}`} title="แก้ไขรายการ">
                          <button type="button" className="icon-button color-warning">
                            <i className="fa fa-pencil-square-o" aria-hidden="true" />
                          </button>
                        </Link>
                      )
                    }
                    if (permission_delete) {
                      row_accessible.push(
                        <button key="delete" type="button" className="icon-button color-danger" onClick={() => this._onDelete(cell.unitUser)} title="ลบรายการ">
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
