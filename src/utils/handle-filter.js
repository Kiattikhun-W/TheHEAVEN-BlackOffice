const handleFilter = {
  inputFilter: (e) => {
    const { value, classList } = e.target

    if (classList.contains("float")) {
      return (/^-?\d*[.,]?\d*$/.test(value.replace(new RegExp(',', 'g'), '')))
    } else if (classList.contains("integer")) {
      return (/^\d*$/.test(value.replace(new RegExp(',', 'g'), '')))
    } else {
      return true
    }
  },
}

export default handleFilter