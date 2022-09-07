import { createContext } from "react"

export const authContext = createContext({
  authcertifying: true,
  authenticated: false,
  permissions: [],
  user: {},
  _handleLogin: () => { },
  _handleLogout: () => { },
  setIdProp: () => { },
  _initiateAuthentication: () => { },
})


export const AuthProvider = authContext.Provider
export const AuthConsumer = authContext.Consumer