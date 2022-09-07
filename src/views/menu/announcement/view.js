import React from "react"
import {
    CardBody,
    CardHeader,
    FormGroup,
} from "reactstrap"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import { Loading, DataTable } from "../../../components/heaven-strap"

import { AnnouncementModel, } from "../../../models"
import { Tag, Divider, Button, Pagination, Card, } from 'antd';

const announcement_model = new AnnouncementModel()

class View extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            announcements: [],
            dataSource: [],
            index_buffers: [],
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

        const announcements = await announcement_model.getAnnouncementBy({
            propertyId: idproperty
        })
        this.setState({
            loading: false,
            announcements,
            dataSource: announcements.result[0],
            paginationDatas: {
                total: announcements.result[0].total
            }
        })
    })

    _onDelete = (code) => Swal.fire({
        title: "คุณแน่ใจหรือไม่ ?",
        text: "ยืนยันลบรายการนี้",
        icon: "warning",
        showCancelButton: true,
    }).then(({ value }) => value && this.setState({ loading: true, }, async () => {
        const res = await announcement_model.deleteAnnouncementByCode(Number(code))
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
            const res = await announcement_model.getAnnouncementBy({
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
    _sendLine = async () => {
        const { value } = await Swal.fire({
            title: "คุณแน่ใจหรือไม่ ?",
            text: "ยืนยันการส่งแจ้งเตือนไลน์",
            icon: "warning",
            showCancelButton: true,
        })
        console.log("index", this.state.index_buffers)
        value && this._checkSendLine() && this.setState({ loading: true }, async () => {
            let res = await announcement_model.sendAnnouncementLine({
                announcementData: this.state.index_buffers
            })
            if (res.code === 200) {
                window.location.reload()
                // this._fetchData()
                // this.setState({
                //   index_buffers:[]
                // })
            } else {
                this.setState({ loading: false }, () => {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด !",
                        text: "ไม่สามารถดำเนินการได้ !",
                        icon: "error",
                    });
                });
            }
        })

    }
    _checkSendLine = () => {
        if (this.state.index_buffers.length === 0) {
            Swal.fire({ text: "โปรดเลือกรายการ", icon: "warning" });
            return false;
        }
        else {
            return true
        }
    }

    render() {
        const { permission_add, permission_edit, permission_delete, } = this.props.PERMISSION
        const idproperty = localStorage.getItem("propertyid");


        return (

            <div>
                <Loading show={this.state.loading} />
                <Card className="cardTable" style={{ borderRadius: '12px' }}>
                    <CardHeader style={{ backgroundColor: '#634ae2' }}>
                        <h3 className="text-header text-white">ประกาศ </h3>
                        {permission_add &&
                            <Link to={`/properties/${idproperty}/announcement/insert`} className="btn btn-success float-right" >
                                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มประกาศ
                            </Link>
                        }

                    </CardHeader>

                    <Button type="primary" size="large" className="float-right mr-3 mt-2 mb-2" style={{ backgroundColor: "rgb(62, 211, 82)", color: "#fff", border: "rgb(62, 211, 82)" }}
                        onClick={this._sendLine} >Line</Button>
                    <DataTable
                        onChange={this._fetchData}
                        showRowNo={false}
                        dataSource={this.state.dataSource.item}
                        pagination={false}
                        bordered={false}
                        setProps={{ rowSelection: { type: "checkbox", onChange: (selectedRowKeys, selectedRows) => this.setState({ index_buffers: selectedRows, },) } }}
                        rowKey="announcement_id"
                        columns={[

                            // {
                            //   title: "ชื่อเจ้าของยูนิต",
                            //   dataIndex: "member_name",
                            //   filterAble: true,
                            //   ellipsis: true,
                            // },
                            {
                                title: "รายละเอียด",
                                dataIndex: "announcement_desc",
                                filterAble: true,
                                ellipsis: true,
                                align: 'center'
                            },
                            // {
                            //     title: "ประเภทเบอร์",
                            //     dataIndex: "type",

                            //     ellipsis: true,
                            //     render: (cell) => {
                            //         return cell === 'Internal' ? <div>เบอร์ภายใน</div> : <div>เบอร์ภายนอก</div>

                            //     },
                            //     filters: [
                            //         { text: 'เบอร์ภายใน', value: 'Internal', },
                            //         { text: 'เบอร์ภายนอก', value: 'External', },
                            //     ],

                            // },
                            {
                                title: '',
                                dataIndex: '',
                                render: (cell) => {
                                    const row_accessible = []

                                    // if (permission_edit) {
                                    //     row_accessible.push(
                                    //         <Link key="update" to={`/properties/${idproperty}/announcement/update/${cell.id}`} title="แก้ไขรายการ">
                                    //             <button type="button" className="icon-button color-warning">
                                    //                 <i className="fa fa-pencil-square-o" aria-hidden="true" />
                                    //             </button>
                                    //         </Link>
                                    //     )
                                    // }
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
