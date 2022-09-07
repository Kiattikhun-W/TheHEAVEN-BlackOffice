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

import { FacilityBookModel, } from "../../../models"
import { Tag, Divider, Pagination } from 'antd';
import { timeFormat, } from '../../../utils'

const facility_book_model = new FacilityBookModel()

class View extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            facility_books: [],
            dataSource: [],
            pageno: 1,
            paginationDatas: {
                total: "",
            },
        }
    }

    componentDidMount() {
        this._fetchData()

    }

    _fetchData = () => this.setState({ loading: true, }, async () => {
        const idproperty = localStorage.getItem("propertyid");

        const facility_books = await facility_book_model.getFacilityBookBy({
            propertyId: idproperty
        })

        console.log(facility_books)

        this.setState({
            loading: false,
            facility_books,
            dataSource: facility_books.result[0],
            paginationDatas: {
                total: facility_books.result[0].total,
            },

        })
    })

    _onDelete = (code) => Swal.fire({
        title: "คุณแน่ใจหรือไม่ ?",
        text: "ยืนยันลบรายการนี้",
        icon: "warning",
        showCancelButton: true,
    }).then(({ value }) => value && this.setState({ loading: true, }, async () => {
        const res = await facility_book_model.deleteFacilityBookByCode(Number(code))
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

            const res = await facility_book_model.getFacilityBookBy({
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
                        <h3 className="text-header text-white">จองพื้นที่ส่วนกลาง </h3>
                        {permission_add &&
                            <Link to={`/properties/${idproperty}/facilitybook/insert`} className="btn btn-success float-right" >
                                <i className="fa fa-plus" aria-hidden="true" /> เพิ่มจองพื้นที่ส่วนกลาง
                            </Link>
                        }
                    </CardHeader>
                    <CardBody>
                        <DataTable
                            onChange={this._fetchData}
                            showRowNo={false}
                            dataSource={this.state.dataSource.item}
                            bordered={false}
                            pagination={false}
                            rowKey="id"
                            columns={[
                                {
                                    title: "ชื่อสถานที่",
                                    dataIndex: ["facilityZone", "facilityName"],
                                    ellipsis: true,
                                    width: 160,
                                    align: 'center',
                                },

                                {
                                    title: "วันที่จอง",
                                    dataIndex: "bookDate",
                                    ellipsis: true,
                                    align: 'center',
                                    render: (cell) => {
                                        return (
                                            <>
                                                {timeFormat.showFullDateTH(cell)}
                                            </>
                                        )
                                    }
                                },

                                {
                                    title: "เวลาเริ่มจอง",
                                    dataIndex: "bookStarttime",
                                    ellipsis: true,
                                    align: 'center',
                                    render: (cell) => {
                                        return (
                                            <>
                                                {String(cell).length === 1
                                                    ? `0${cell}:00`
                                                    : `${cell}:00`}
                                            </>
                                        )

                                    }

                                },
                                {
                                    title: "ถึงเวลา",
                                    dataIndex: "bookEndtime",
                                    ellipsis: true,
                                    align: 'center',
                                    render: (cell) => {
                                        return (
                                            <>
                                                {String(cell).length === 1
                                                    ? `0${cell}:00`
                                                    : `${cell}:00`}
                                            </>
                                        )
                                    }

                                },
                                {
                                    title: "ผู้เข้าใช้งาน",
                                    dataIndex: "bookParticipant",
                                    filterAble: true,
                                    ellipsis: true,
                                    width: 120,
                                    align: 'center',
                                },
                                {
                                    title: "สถานะ",
                                    dataIndex: "bookStatus",
                                    filterAble: true,
                                    ellipsis: true,
                                    align: 'center',
                                    render: (cell) => {
                                        return cell === 'Checkin' ?
                                            <Tag color="success">เช็คอิน</Tag> :
                                            cell === 'Waiting' ?
                                                <Tag color="blue">รอเช็คอิน</Tag> : <Tag color="error">ยกเลิก</Tag>
                                    }

                                },
                                {
                                    title: "จองโดย",
                                    dataIndex: ["unitUser", "user"],
                                    filterAble: true,
                                    width: 150,
                                    align: 'left',
                                    render: (cell) => cell.firstname + " " + cell.lastname
                                },

                                {
                                    title: '',
                                    dataIndex: '',
                                    render: (cell) => {
                                        const row_accessible = []

                                        if (permission_edit) {
                                            row_accessible.push(
                                                <Link key="update" to={`/properties/${idproperty}/facilitybook/update/${cell.id}`} title="ดูรายละเอียด">
                                                    <button type="button" className="icon-button color-primary">
                                                        <i className="fa fa-search" aria-hidden="true" />
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
