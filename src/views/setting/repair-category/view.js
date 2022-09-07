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

import { RepairCategoryModel, } from "../../../models"
import { Tag, Divider, Pagination } from 'antd';

const repair_category_model = new RepairCategoryModel()

class View extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      repair_categories: [],
      pageno: 1,
      paginationDatas: {
        total: "",
      },
      dataSource: [],
    }
  }

  componentDidMount() {
    this._fetchData()
  }

  _fetchData = () => this.setState({ loading: true, }, async () => {

    const repair_categories = await repair_category_model.getRepairCategoryBy({
      page: 1,
      limit: 10,
    })
    console.log(repair_categories)
    this.setState({
      loading: false,
      repair_categories: repair_categories.result[0],
      paginationDatas: {
        total: repair_categories.result[0].total,
      },
      dataSource: repair_categories.result[0],
    })
  })

  _onDelete = (code) => Swal.fire({
    title: "คุณแน่ใจหรือไม่ ?",
    text: "ยืนยันลบรายการนี้",
    icon: "warning",
    showCancelButton: true,
  }).then(({ value }) => value && this.setState({ loading: true, }, async () => {
    const res = await repair_category_model.deleteRepairCategoryByCode(Number(code))
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
      });
      const property = Number(localStorage.getItem("propertyid"));

      const res = await repair_category_model.getRepairCategoryBy({
        page: page === 0 ? 1 : page,
        limit: pageSize,
      });
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
        <Card className="cardTable">
          <CardHeader style={{ backgroundColor: '#634ae2' }}>
            <h3 className="text-header text-white">หมวดหมู่การซ่อม </h3>
            {permission_add &&
              <Link to={`/setting/repair-category/insert`} className="btn btn-success float-right" >
                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มหมวดหมู่การซ่อม
              </Link>
            }
          </CardHeader>
          <CardBody>
            <DataTable
              onChange={this._fetchData}
              showRowNo={false}
              pagination={false}
              dataSource={this.state.dataSource.item}
              rowKey="id"
              style={{ fontSize: '32px' }}
              columns={[
                {
                  title: "ชื่อ",
                  dataIndex: "categoryName",
                  filterAble: true,
                  ellipsis: true,
                  align: 'left',
                },
                // {
                //     title: "สถานะ",
                //     dataIndex: "repair_category_status",
                //     ellipsis: true,                  
                //     filters: [
                //       { text: 'ใช้งาน', value: 'Active', },
                //       { text: 'ไม่ใช้งาน', value: 'Inactive', },
                //     ],
                //     align: 'center',
                //     render:(cell)=>{
                //       return cell === 'Active'?<Tag color="success">Active</Tag>:<Tag color="error">Inactive</Tag>
                //     }
                // },


                {
                  title: '',
                  dataIndex: '',
                  render: (cell) => {
                    const row_accessible = []

                    if (permission_edit) {
                      row_accessible.push(
                        <Link key="update" to={`/setting/repair-category/update/${cell.id}`} title="แก้ไขรายการ">
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
