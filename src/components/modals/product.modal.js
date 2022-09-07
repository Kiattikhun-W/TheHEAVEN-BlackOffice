import React from 'react'
import {
  Button,
  Col,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap'

import { DataTable, } from '../heaven-strap'

import { numberFormat, } from '../../utils'

import { RepairZoneModel } from '../../models'

const repair_zone = new RepairZoneModel()

class RepairZoneModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_loading: true,
      data_buffers: [],
      repair_zones: [],
    }
  }

  componentDidUpdate(props_old) {
    if (!props_old.is_show && this.props.is_show) {
      this.setState({ data_buffers: [], }, () => {
        this._fetchData()
      })
    }
  }

  _fetchData = (params = { pagination: { current: 1, pageSize: 20, } }) => this.setState({ is_loading: true, }, async () => {
    const { non_codes, } = this.props

    const repair_zones = await repair_zone.getRepairZoneBy({
      non_codes,
      params,
    })

    this.setState({
      is_loading: false,
      repair_zones: repair_zones.result[0],
    })
  })

  _handleConfirm = () => this.props.onConfirm(this.state.data_buffers)
  _handleClose = () => this.props.onClose()

  render() {
    return (
      <Modal size="xl" centered isOpen={this.props.is_show} toggle={this._handleClose}>
        <ModalHeader toggle={this._handleClose}>เลือกรายการ</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={12}>
              <FormGroup>
                <div className="alert-box alert-info" style={{ height: 36, padding: 8, }}>ทั้งหมด : {this.state.repair_zones.total} รายการ</div>
              </FormGroup>
            </Col>
          </Row>
          <DataTable
            loading={this.state.is_loading}
            onChange={this._fetchData}
            dataSource={this.state.repair_zones.item}
            setProps={{
              rowSelection: {
                type: "checkbox",
                preserveSelectedRowKeys: true,
                onChange: (selectedRowKeys, selectedRows) => this.setState({ data_buffers: selectedRows, }),
              },
            }}
            rowKey="id"
            columns={[

              {
                title: "สินค้า",
                dataIndex: "zoneName",
                filterAble: true,
                ellipsis: true,
              },

            ]}
          />
        </ModalBody>
        <ModalFooter>
          <div className="flex-grow-1 alert-success" style={{ height: 36, padding: 8, }}>เลือก : {this.state.data_buffers.length} รายการ</div>
          <Button type="button" color="primary" onClick={this._handleConfirm}>ยืนยันรายการ</Button>
          <Button type="button" onClick={this._handleClose}>ยกเลิก</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default RepairZoneModal