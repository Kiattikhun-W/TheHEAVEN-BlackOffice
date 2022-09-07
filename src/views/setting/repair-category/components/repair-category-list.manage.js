import React from "react"

import { ProductModal, } from "../../../../components/modals"

import { numberFormat, } from "../../../../utils"

import { RepairCategoryListModel, } from "../../../../models"

const repair_category_list_model = new RepairCategoryListModel()

class RepairCategoryManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      product_modal: { is_show: false, },
      index_buffers: [],
      repair_category_lists: [],
    }
  }

  componentDidUpdate(props_old) {
    if (!props_old.repair_category_code && this.props.repair_category_code) {
      this._fetchData()
    }
  }

  _fetchData = async () => {
    const { repair_category_code } = this.props

    const repair_category_lists = await repair_category_list_model.getRepairCategoryListBy({ repair_category_code })

    console.log("repair_category_lists",repair_category_lists)

    this.setState({
      repair_category_lists: repair_category_lists.data,
    }, () => {
      this._refreshData()
    })
  }

  _addRow = (rows) => this.setState(state => ({
    product_modal: { ...state.product_modal, is_show: false, },
    repair_category_lists: [...state.repair_category_lists, ...rows],
  }), () => this._refreshData())

  _deleteRow = (idx) => this.setState(state => {
    state.repair_category_lists.splice(idx, 1)

    return {
      repair_category_lists: state.repair_category_lists,
    }
  }, () => {
    this._refreshData()
  })

  _openModal = () => this.setState(state => ({ product_modal: { ...state.product_modal, is_show: true, }, }))
  _closeModal = () => this.setState(state => ({ product_modal: { ...state.product_modal, is_show: false, }, }))

  _refreshData = () => this.props.onRefresh({
    repair_category_lists: this.state.repair_category_lists,
  })

  render() {
    return (
      <>
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th className="text-center" width={36}>ลำดับ </th>
              {/* <th className="text-center" width={140}>รหัส</th> */}
              <th className="text-center">พื้นที่</th>
              <th className="text-center" width={48}></th>
            </tr>
          </thead>
          <tbody>
            {this.state.repair_category_lists.map((item, idx) => (
              <tr key={idx}>
                <td className="text-center">{idx + 1}</td>
                <td>{item.zoneName}</td>
                <td className="text-center">
                  <button type="button" className="icon-button color-danger" onClick={() => this._deleteRow(idx)} title="ลบรายการ">
                    <i className="fa fa-times-circle" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} align="center">
                <span className="text-button" onClick={this._openModal}>
                  <i className="fa fa-plus" aria-hidden="true" /> เพิ่มรายการ
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
        <ProductModal
          is_show={this.state.product_modal.is_show}
          non_codes={this.state.repair_category_lists.map(item => item.repair_zone_code)}
          onConfirm={this._addRow}
          onClose={this._closeModal}
        />
      </>
    )
  }
}

export default RepairCategoryManage