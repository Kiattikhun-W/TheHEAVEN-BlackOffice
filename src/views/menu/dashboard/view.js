import React, { lazy } from 'react'
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
import CIcon from '@coreui/icons-react'
import { Select } from '../../../components/heaven-strap'
import {
  Col,
  Row,
  FormGroup
} from "reactstrap";
import { useEffect, useState } from 'react'
import { PropertiesModel, UserModel } from '../../../models'
import DisplayPropertyInfo from './components/DisplayPropertyInfo'
import { Alert } from 'antd'

const WidgetsDropdown = lazy(() => import('./components//widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('./components//widgets/WidgetsBrand.js'))
const property_model = new PropertiesModel()
const user_model = new UserModel()
const Dashboard = () => {


  const [properties, setProperties] = useState([])
  const [propertyId, setPropertyId] = useState('')
  const [numOfActivate, setNumOfActivate] = useState(0)

  useEffect(() => {
    _fetchData()
  }, [])

  const _fetchData = async () => {
    const propertiesData = await property_model.getPropertiesBy({ limit: 500 })
    const userDatas = await user_model.getUserBy({ limit: 500, isActivate: false })
    setNumOfActivate(userDatas.result[0].total)
    setProperties(propertiesData.result[0].item)
  }

  const properties_options = [
    { label: "- ระบุโครงการ -", value: "" },
    ...properties.map((item) => ({
      label: item.propertyName,
      value: item.id,
    })),
  ];

  // const _displayTrezor = (id) => {

  // }

  return (


    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <CRow >
                <CCol md='9'>
                  <h3>The HEAVEN DASHBOARD</h3>
                </CCol>
                <CCol>
                  <FormGroup>
                    <Select
                      options={
                        [
                          { label: "- ระบุโครงการ -", value: "" },
                          ...properties.map((item) => ({
                            label: item.propertyName,
                            value: item.properties_code,
                          })),
                        ]
                      }
                      className="text-center w-100"
                      placeholder="Role"
                      value={propertyId}
                      onChange={(e) => setPropertyId(e)}
                    />
                  </FormGroup>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              {
                propertyId === '' ?
                  <>
                    <CRow>
                      <CCol xs="12" md="12" xl="12">
                        <CRow>
                          {/* <CCol sm="6">
                            <CCallout color="info">
                              <small className="text-muted">รายการแจ้งซ่อมที่รอแก้ไข</small>
                              <br />
                              <strong className="h4">9,123</strong>
                            </CCallout>
                          </CCol> */}
                          {/* <CCol sm="6">
                            <CCallout color="danger">
                              <small className="text-muted">ผู้ใช้ที่รออนุมัติ</small>
                              <br />
                              <strong className="h4">{numOfActivate} คน</strong>
                            </CCallout>
                          </CCol> */}
                        </CRow>
                        {/* <hr className="mt-0" /> */}
                        {/* <WidgetsDropdown /> */}
                        {numOfActivate !== 0 ? <Alert
                          message="กรุณาตรวจสอบ"
                          description={"มีผู้ใช้ที่รออนุมัติ " + numOfActivate + " คน"}
                          type="warning"
                          showIcon
                        /> : <Alert
                          message={"ในขณะนี้ไม่มีผู้ใช้ที่รออนุมัติ"}
                          description={"ไม่มีผู้ใช้ที่รออนุมัติ"}
                          type="success"
                          showIcon
                        />}

                      </CCol>
                    </CRow>
                  </>
                  // : propertyId === 'Trezor' ? null
                  : <DisplayPropertyInfo
                    propertyId={propertyId}
                  />
                // : null
              }
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
