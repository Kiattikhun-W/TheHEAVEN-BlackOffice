import React, { Component } from 'react'
import Swal from 'sweetalert2'

import { AuthProvider } from '../../contexts/authContext'

import { AuthLoading } from './'

import GLOBAL from '../../GLOBAL'
import md5 from "md5"
import { UserModel, } from '../../models'

const user_model = new UserModel()

class Auth extends Component {
  state = {
    authcertifying: true,
    authenticated: false,
    permissions: [],
    user: {},
    idProp: ''
  }

  componentDidMount() {
    this._initiateAuthentication()
    this.setIdProp(localStorage.getItem("propertyid"))
  }

  _checkLogin = async ({ user_username, user_password, }) => {
    let username = user_username
    let password = md5(user_password)
    const res_login = await user_model.checkLogin({ username, password, })


    if (res_login.code !== 200) {
      this.setState({ authcertifying: false, }, () => {
        Swal.fire({ title: "ไม่สามารถล็อคอินได้ !", text: 'Username หรือ Password ไม่ถูกต้อง', icon: "error", })
      })
    } else {
      console.log(res_login.result[0].access_token)


      localStorage.setItem('Authorization', 'Bearer ' + res_login.result[0].access_token)
      GLOBAL.ACCESS_TOKEN = { 'Authorization': 'Bearer ' + res_login.result[0].access_token }
      try {
        console.log("else", GLOBAL.ACCESS_TOKEN)

        const user_profile = await user_model.getUserProfile()

        localStorage.setItem('session-user', JSON.stringify(user_profile.result[0]))
        console.log("user_profile", user_profile)


        this.setState({
          authcertifying: false,
          authenticated: true,
          user: user_profile.result[0],
        })
      } catch (e) {
        this.setState({
          authcertifying: false,
          // authenticated: true,

        }, () => {
          console.log("catch", e)
        })
      }
    }
  }

  _initiateAuthentication = async () => {
    const token_verify = await user_model.verifyToken()

    // console.log("token_verify",token_verify);
    if (token_verify.code !== 200) {
      this.setState({ authcertifying: false, })
    } else {

      let users = localStorage.getItem('session-user')
      this.setState({
        authcertifying: false,
        authenticated: true,
        user: JSON.parse(users)
      })

    }


  }
  setIdProp = (e) => {
    console.log('setId', e);
    this.setState({
      idProp: e
    })
  }

  _handleLogin = (data) => !this.state.authcertifying && this.setState({ authcertifying: true, }, () => this._checkLogin(data))

  _handleLogout = () => {
    try {
      localStorage.clear()
      window.location.reload()
    } catch (e) {
      console.log('_handleLogout ', e)
    }
  }

  render() {
    console.log("this.props.children", this.state)

    return (
      <AuthProvider
        value={{
          ...this.state,
          _handleLogin: this._handleLogin,
          _handleLogout: this._handleLogout,
          setIdProp: this.setIdProp,
          _initiateAuthentication: this._initiateAuthentication,
        }}
      >
        {this.state.authcertifying ? <AuthLoading /> : this.props.children}
      </AuthProvider>
    )
  }
}

export default Auth