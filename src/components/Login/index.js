import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: 'rahul',
    password: 'rahul@2021',
    errMsg: '',
    errorOccure: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errMsg => {
    this.setState({errorOccure: true, errMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const option = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const apiurl = 'https://apis.ccbp.in/login'

    const response = await fetch(apiurl, option)
    const fetchDetail = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(fetchDetail.jwt_token)
    } else {
      this.onSubmitFailure(fetchDetail.error_msg)
    }
  }

  render() {
    const {username, password, errorOccure, errMsg} = this.state
    return (
      <div className="login-bg-container">
        <div className="login-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="web-logo-dimensions"
          />
          <form onSubmit={this.submitForm} className="form-container">
            <label htmlFor="username" className="name-password-para">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="input-ele"
              value={username}
              onChange={this.onChangeUsername}
              placeholder="username"
            />
            <label htmlFor="password" className="name-password-para">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="input-ele"
              value={password}
              onChange={this.onChangePassword}
              placeholder="password"
            />
            <button type="submit" className="login-button">
              Login
            </button>
            {errorOccure && <p className="error-msg">{errMsg}</p>}
            <p>
              By default, Developer Provided the username and password, Simply
              login
            </p>
            <p>If you change the username or password, it shows error</p>
          </form>
        </div>
      </div>
    )
  }
}
export default Login
