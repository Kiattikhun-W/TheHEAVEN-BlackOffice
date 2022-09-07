import React from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  FormGroup,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Switch, Pagination } from 'antd';

import { DataTable, Loading, } from '../../../components/heaven-strap'

import { UserModel, } from '../../../models'

const user_model = new UserModel()

class View extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      users: [],
      dataSource: [],
      pageno: 1,
      paginationDatas: {
        total: 0,
      }
    }
  }

  componentDidMount() {
    this._fetchData()
  }

  _fetchData = () => this.setState({ loading: true, }, async () => {
    const users = await user_model.getUserBy({
      page: 1,
      limit: 10
    })

    this.setState({
      loading: false,
      users,
      dataSource: users.result[0],
      paginationDatas: {
        total: users.result[0].total,
      },
    })
  })

  _onDelete = (code) => Swal.fire({
    title: "คุณแน่ใจหรือไม่ ?",
    text: "ยืนยันลบรายการนี้",
    icon: "warning",
    showCancelButton: true,
  }).then(({ value }) => value && this.setState({ loading: true, }, async () => {
    const res = await user_model.deleteUserByCode(Number(code))

    if (res.code === 200) {
      Swal.fire({ title: 'ลบรายการแล้ว !', text: '', icon: 'success' })
      this._fetchData()
    } else {
      this.setState({ loading: false, }, () => {
        Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
      })
    }
  }))

  _handleApprove = async (event, cell) => {
    console.log("cell.lineUnit", cell)

    this.setState({ loading: true, }, async () => {
      const res = await user_model.updateUserBy(Number(cell.id), {
        isActivate: event,
        role: cell.role,
        firstname: cell.firstname,
        lastname: cell.lastname,
        username: cell.username,
        lineUserId: cell.lineUserId,
        phone: cell.phone,
        lineUnit: cell.lineUnit,
      })
      if (res.code === 200) {
        Swal.fire({ title: "บันทึกข้อมูลแล้ว !", icon: "success", }).then(() => this._fetchData())

      } else {
        this.setState({
          loading: false,
        }, () => {
          Swal.fire({ title: "เกิดข้อผิดพลาด !", text: "ไม่สามารถดำเนินการได้ !", icon: "error", })
        })
      }
    })
  }
  handleChangePagination = async (page, pageSize) => {
    try {
      this.setState({
        loading: true,
      });
      const property = Number(localStorage.getItem("propertyid"));

      const res = await user_model.getUserBy(({
        page: page === 0 ? 1 : page,
        limit: pageSize,
      }));
      console.log("page", page)

      console.log("respag", res.result[0]);
      if (res.code === 200) {
        this.setState({
          dataSource: res.result[0],
          loading: false,
          pageno: page,
          paginationDatas: {
            total: res.result[0].total,
          },
        });
      }
    } catch (error) { }
  };
  render() {
    const { permission_add, permission_edit, permission_delete, } = this.props.PERMISSION

    return (
      <div>
        <Loading show={this.state.loading} />
        <Card>
          <CardHeader style={{ backgroundColor: '#634ae2' }}>
            <h3 className="text-header text-white">ผู้ใช้ </h3>
            {permission_add &&
              <Link to={`/setting/user/insert`} className="btn btn-success float-right" >
                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มผู้ใช้
              </Link>
            }
          </CardHeader>
          <CardBody>
            <DataTable
              style={{ overFlow: 'auto' }}
              onChange={this._fetchData}
              showRowNo={false}
              dataSource={this.state.dataSource.item}
              pagination={false}
              rowKey='id'
              columns={[
                {
                  title: "ชื่อ",
                  dataIndex: "firstname",
                  filterAble: true,
                  ellipsis: true,
                  align: 'center'
                  // render:(cell)=>cell.firstname+ " "+cell.lastname
                },
                {
                  title: "นามสกุล",
                  dataIndex: "lastname",
                  filterAble: true,
                  ellipsis: true,
                  align: 'center'
                },
                {
                  title: "ตำแหน่ง ",
                  dataIndex: "role",
                  filterAble: true,
                  ellipsis: true,
                  align: 'center'
                },
                // {
                //   title: "ตำแหน่ง ",
                //   dataIndex: "role",
                //   filterAble: true,
                //   ellipsis: true,
                // },

                {
                  title: "สถานะ ",
                  ellipsis: true,
                  render: (cell) => {
                    // console.log(cell.id)
                    return cell.isActivate === true ? <Switch checkedChildren="อนุมัติ" unCheckedChildren="รออนุมัติ" defaultChecked onChange={(e) => this._handleApprove(e, cell)} /> :
                      <Switch checkedChildren="อนุมัติ" unCheckedChildren="รออนุมัติ" onChange={(e) => this._handleApprove(e, cell)} />

                  }
                },

                {
                  title: '',
                  dataIndex: '',
                  render: (cell) => {
                    const row_accessible = []

                    if (permission_edit) {
                      row_accessible.push(
                        <Link key="update" to={`/setting/user/update/${cell.id}`} title="แก้ไขรายการ">
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