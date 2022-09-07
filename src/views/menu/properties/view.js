import React from "react"
import {
    Card,
    CardBody,
    CardHeader,
} from "reactstrap"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"

import { Loading, DataTable } from "../../../components/heaven-strap"
import { changePropertiesId } from "../../../containers/access-menu";
import { AuthConsumer, } from '../../..//contexts/authContext'

import { PropertiesModel, } from "../../../models"
import { Pagination } from 'antd';

const properties_model = new PropertiesModel()

class View extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            properties: [],
            pageno: 1,
            dataSource: [],
            paginationDatas: {
                total: 0,
            }
        }
    }

    componentDidMount() {
        this._fetchData()

    }

    _fetchData = () => this.setState({ loading: true, }, async () => {
        const properties = await properties_model.getPropertiesBy({
            page: 1,
            limit: 10
        })

        console.log("properties", properties)

        this.setState({
            loading: false,
            properties: properties?.result[0],
            dataSource: properties?.result[0],
            paginationDatas: {
                total: properties?.result[0]?.total
            }
        })
    })

    _onDelete = (code) => Swal.fire({
        title: "คุณแน่ใจหรือไม่ ?",
        text: "ยืนยันลบรายการนี้",
        icon: "warning",
        showCancelButton: true,
    }).then(({ value }) => value && this.setState({ loading: true, }, async () => {
        const res = await properties_model.deletePropertiesByCode(Number(code))
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
            const res = await properties_model.getPropertiesBy({
                page: page === 0 ? 1 : page,
                limit: pageSize,
            });
            console.log("res", page)

            if (res.code === 200) {
                this.setState({
                    dataSource: res?.result[0],
                    loading: false,
                    pageno: page,
                    paginationDatas: {
                        total: res?.result[0]?.total,
                    },
                });
            }
        } catch (error) { }
    };

    render() {
        const { permission_add, permission_edit, permission_delete, } = this.props.PERMISSION


        return (

            <AuthConsumer>
                {({ idProp, setIdProp }) => (
                    <div>
                        <Loading show={this.state.loading} />
                        <Card className="cardTable" style={{ borderRadius: '12px' }}>
                            <CardHeader style={{ backgroundColor: '#634ae2' }}>
                                <h3 className="text-header text-white">โครงการ </h3>
                                {permission_add &&
                                    <Link to={`/manage-menu/properties/insert`} className="btn btn-success float-right" >
                                        <i className="fa fa-plus" aria-hidden="true" /> เพิ่มโครงการ
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
                                    rowKey="properties_code"
                                    onRow={(row) => ({
                                        onDoubleClick: () => {
                                            setIdProp(row.properties_code)
                                            localStorage.setItem("propertyid", row.properties_code);
                                            changePropertiesId(row.properties_code)
                                            this.props.history.push(`/properties/${row.properties_code}/unit`)
                                        }
                                    })}
                                    columns={[
                                        {
                                            title: "ชื่อโครงการ",
                                            dataIndex: "propertyName",
                                            filterAble: true,
                                            ellipsis: true,
                                            align: 'center',

                                        },
                                        {
                                            title: '',
                                            dataIndex: '',
                                            render: (cell) => {
                                                const row_accessible = []

                                                if (permission_edit) {
                                                    row_accessible.push(
                                                        <Link key="update" to={`/manage-menu/properties/update/${cell.properties_code}`} title="แก้ไขรายการ">
                                                            <button type="button" className="icon-button color-warning">
                                                                <i className="fa fa-pencil-square-o" aria-hidden="true" />
                                                            </button>
                                                        </Link>
                                                    )
                                                }
                                                if (permission_delete) {
                                                    row_accessible.push(
                                                        <button key="delete" type="button" className="icon-button color-danger" onClick={() => this._onDelete(cell.properties_code)} title="ลบรายการ">
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
                )}
            </AuthConsumer>
        )
    }
}

export default View
