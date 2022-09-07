const numberFormat = {
  toInt: (number) => number ? ~~+number.toString().replace(new RegExp(',', 'g'), '') : 0,
  toFloat: (number) => number ? +number.toString().replace(new RegExp(',', 'g'), '') : 0,
  decimalFix: (number, decimal, nzero = true) => {
    number = numberFormat.toFloat(number)

    return !nzero && number === 0 ? '' : number.toFixed(decimal).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }
}

export default numberFormat