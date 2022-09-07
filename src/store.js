import { createStore } from 'redux'

let now = new Date(), y = now.getFullYear(), m = now.getMonth()

const initialState = {
  date_start: new Date(y, m, 1),
  date_end: new Date(y, m + 1, 0),
  sidebarShow: 'responsive'
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store