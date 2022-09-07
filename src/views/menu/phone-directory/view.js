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

import { PhoneDirectoryModel, } from "../../../models"
import { Tag, Divider, Button, Pagination } from 'antd';

const phone_directory_model = new PhoneDirectoryModel()

class View extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            phone_directories: [],
            dataSource: [],
            pageno: 1,
            paginationDatas: {
                total: 1,
            }
        }
    }

    componentDidMount() {
        this._fetchData()

    }

    _fetchData = () => this.setState({ loading: true, }, async () => {
        const idproperty = Number(localStorage.getItem("propertyid"));

        const phone_directories = await phone_directory_model.getPhoneDirectoryBy({
            propertyId: idproperty
        })
        this.setState({
            loading: false,
            phone_directories,
            dataSource: phone_directories?.result[0],
            paginationDatas: {
                total: phone_directories?.result[0]?.total
            }
        })
    })

    _onDelete = (code) => Swal.fire({
        title: "คุณแน่ใจหรือไม่ ?",
        text: "ยืนยันลบรายการนี้",
        icon: "warning",
        showCancelButton: true,
    }).then(({ value }) => value && this.setState({ loading: true, }, async () => {
        const res = await phone_directory_model.deletePhoneDirectoryByCode(Number(code))
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
            const res = await phone_directory_model.getPhoneDirectoryBy({
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
                <Card className="cardTable" style={{ borderRadius: '12px' }}>
                    <CardHeader style={{ backgroundColor: '#634ae2' }}>
                        <h3 className="text-header text-white">สมุดโทรศัพท์ </h3>
                        {permission_add &&
                            <Link to={`/properties/${idproperty}/phonedirectory/insert`} className="btn btn-success float-right" >
                                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มสมุดโทรศัพท์
                            </Link>
                        }
                    </CardHeader>
                    <CardBody>
                        <DataTable
                            onChange={this._fetchData}
                            showRowNo={false}
                            dataSource={this.state.dataSource.item}
                            pagination={false}
                            bordered={false}
                            rowKey="id"
                            columns={[

                                // {
                                //   title: "ชื่อเจ้าของยูนิต",
                                //   dataIndex: "member_name",
                                //   filterAble: true,
                                //   ellipsis: true,
                                // },
                                {
                                    title: "ชื่อสมุดโทรศัพท์",
                                    dataIndex: "phoneName",
                                    filterAble: true,
                                    ellipsis: true,
                                },
                                {
                                    title: "ประเภทเบอร์",
                                    dataIndex: "type",

                                    ellipsis: true,
                                    render: (cell) => {
                                        return cell === 'Internal' ? <div>เบอร์ภายใน</div> : <div>เบอร์ภายนอก</div>

                                    },
                                    filters: [
                                        { text: 'เบอร์ภายใน', value: 'Internal', },
                                        { text: 'เบอร์ภายนอก', value: 'External', },
                                    ],

                                },
                                {
                                    title: '',
                                    dataIndex: '',
                                    render: (cell) => {
                                        const row_accessible = []

                                        if (permission_edit) {
                                            row_accessible.push(
                                                <Link key="update" to={`/properties/${idproperty}/phonedirectory/update/${cell.id}`} title="แก้ไขรายการ">
                                                    <button type="button" className="icon-button color-warning">
                                                        <i className="fa fa-pencil-square-o" aria-hidden="true" />
                                                    </button>
                                                </Link>
                                            )
                                        }
                                        if (permission_delete) {
                                            row_accessible.push(
                                                <button key="delete" type="button" className="icon-button color-danger" onClick={() => this._onDelete(cell.id)} title="ลบรายการ">
                                                    <i className="fa fa-trash " aria-hidden="true" />
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
