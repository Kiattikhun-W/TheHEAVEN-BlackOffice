import {
    CheckCircleOutlined,
    InfoCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    Button,
    DatePicker,
    Drawer,
    Form,
    Input,
    Modal,
    Switch,
    Space
} from "antd";
import CIcon from '@coreui/icons-react'

import { Loading, DataTable, Select } from '../../../../components/heaven-strap'
import { numberFormat, timeFormat, } from '../../../../utils'
import {
    CBadge,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CProgress,
    CRow,
    CCallout
} from '@coreui/react'
import {
    Col,
    Row,
    FormGroup
} from "reactstrap";
import moment from "moment";
import React, { useEffect, useRef, useState, lazy } from "react";
import { RepairCommonModel, TransferProofModel } from '../../../../models'
import Swal from 'sweetalert2'
import {
    useHistory,
} from "react-router-dom";
const WidgetsDropdown = lazy(() => import('./widgets/WidgetsDropdown.js'))

const transfer_proof_model = new TransferProofModel()
const repair_common_model = new RepairCommonModel()


const DisplayPropertyInfo = (props) => {
    const history = useHistory();
    const [propertyId, setPropertyId] = useState('')
    const [transferPending, setTransferPending] = useState(0)
    const [repairCommon, setRepairCommon] = useState(0)


    useEffect(() => {
        setPropertyId(props.propertyId);
        _fetchData()
    }, [props.propertyId])
    const _fetchData = async () => {
        let transfers = await transfer_proof_model.getTransferProofBy({
            propertyId: props.propertyId,
            status: 'Pending',
            limit: 500,
        })
        let repair_commons = await repair_common_model.getRepairCommonBy({
            propertyId: props.propertyId,
            status: 'Waiting',
            limit: 500,
        })
        setTransferPending(transfers.result[0].total)
        setRepairCommon(repair_commons.result[0].total)
    }

    return (
        <>
            <CRow>
                <CCol xs="12" md="12" xl="12">
                    <CRow>
                        {/* <h1>id:{props.propertyId}</h1> */}
                        <CCol sm="6">
                            <CCallout color="info">
                                <h5 className="text-muted">รายการแจ้งซ่อมส่วนกลางที่รอดำเนินการ</h5>
                                {/* <br /> */}
                                <strong className="h5">{repairCommon} รายการ</strong>
                            </CCallout>
                        </CCol>
                        <CCol sm="6">
                            <CCallout color="danger">
                                <h5 className="text-muted">รายการตรวจสอบค่าใช้จ่ายที่รอตรวจสอบ</h5>
                                {/* <br /> */}
                                <strong className="h5">{transferPending} รายการ</strong>
                            </CCallout>
                        </CCol>
                    </CRow>
                    <hr className="mt-0" />
                    {/* graph */}
                    {/* <CCol md="12" className="d-flex justify-content-end mb-3">
                        <Select
                            options={
                                [
                                    { label: "- ระบุแบบสอบถาม -", value: "" },
                                    ...surveys.map((item) => ({
                                        label: item.survey_name,
                                        value: item.survey_code,
                                    })),
                                ]
                            }
                            className="text-center w-25"
                            value={surveyId}
                            onChange={(e) => _handleSurvey(e)}
                        />
                    </CCol> */}

                    <WidgetsDropdown propertyId={propertyId} />
                    {/* graph */}

                </CCol>
            </CRow>

            <br />


        </>
    )
};

export default DisplayPropertyInfo;
