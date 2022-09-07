import React from "react"
import { Input } from "reactstrap"

import { Select } from "../../../../components/heaven-strap"

// import { PayrollDefaultModel } from "../../../../models"
import { numberFormat, handleFilter } from '../../../../utils'
// const payroll_default_model = new PayrollDefaultModel()

class ExpenseList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payroll_type: '',
      expense_lists: [],
      //   payroll_defaults: [],
    };
  }

  componentDidMount() {
    this._fetchData()
  }

  componentDidUpdate(props_old) {
    if (props_old.expense_lists !== this.props.expense_lists) {
      this.setState({
        expense_lists: this.props.expense_lists || [],
      })
    }
  }

  _fetchData = async () => {
    // const payroll_defaults = await payroll_default_model.getPayrollDefaultBy();


    // this.setState({
    //   expense_lists: this.props.expense_lists || [],
    // })
  }

  _addRow = () => this.setState((state) => ({
    expense_lists: [
      ...state.expense_lists,
      {
        expense_list_id: new Date().getTime().toString(),
        expense_list_price: 0,
        expense_list_name: '',
        expense_list_unit: 0,
        expense_list_total: 0,

      },
    ],
  }))

  _deleteRow = (idx) => this.setState(state => {
    state.expense_lists.splice(idx, 1)

    return {
      expense_lists: state.expense_lists,
    }
  }, () => {
    this._refreshData()
  })

  _handleListChange = (name, e, idx) => {
    if (handleFilter.inputFilter(e)) {
      let { expense_lists } = this.state

      expense_lists[idx][name] = e.target.value

      if (name === 'expense_list_unit' || name === 'expense_list_price') {
        const { expense_list_unit, expense_list_price, } = expense_lists[idx]

        const list_unit = numberFormat.toFloat(expense_list_unit)
        const list_price = numberFormat.toFloat(expense_list_price)

        expense_lists[idx].expense_list_total = numberFormat.decimalFix((list_unit * list_price), 2)
      }


      this.setState({
        expense_lists,
      }, () => {
        this._refreshData()
      })
    }
  }

  _refreshData = () => {
    this.props.onRefresh({
      expense_lists: this.state.expense_lists,
    })
  }

  render() {


    return (
      <div>
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th className="text-center" width={48}>
                ลำดับ
              </th>
              <th className="text-center" >
                รายการ
              </th>
              <th className="text-center" width={140} >
                ราคาต่อหน่วย
              </th>
              <th className="text-center" width={140} >
                หน่วยที่ใช้
              </th>
              <th className="text-center" width={140} >
                รวมเงิน(บาท)
              </th>
              <th className="text-center" width={40}></th>
            </tr>
          </thead>
          <tbody>
            {this.state.expense_lists.map((item, idx) =>
              <tr key={idx}>
                <td className="align-middle text-center">{idx + 1}</td>
                <td>
                  <Input
                    type="text"
                    className="text-center"
                    value={item.expense_list_name}
                    onChange={(e) => this._handleListChange('expense_list_name', e, idx)}
                    required
                  />
                </td>
                <td>
                  <Input
                    type="text"
                    className="integer text-center"
                    value={item.expense_list_unit}
                    onChange={(e) => this._handleListChange('expense_list_unit', e, idx)}
                  />
                </td>
                <td>
                  <Input
                    type="text"
                    className="float text-center"
                    value={item.expense_list_price}
                    onChange={(e) => this._handleListChange('expense_list_price', e, idx)}
                  />
                </td>
                <td>
                  <Input
                    type="text"
                    className="float text-center"
                    value={item.expense_list_total}
                    readOnly

                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="icon-button color-danger"
                    onClick={() => this._deleteRow(idx)}
                    title="ลบรายการ"
                  >
                    <i className="fa fa-times-circle fa-2x" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="8" align="center">
                <span className="text-button" onClick={this._addRow}>
                  <i className="fa fa-plus" aria-hidden="true" /> เพิ่มรายการ
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }
}

export default ExpenseList