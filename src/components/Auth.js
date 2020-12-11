import React, { Component } from 'react'
import axios from 'axios'

class Auth extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      email: '',
      password: '',
      revealed: false,
      loginError: false,
      registerError: false,
    }
  }

  componentDidMount() {
    axios
      .get('/auth/user')
      .then((res) => {
        this.setState({
          username: res.data.email,
          revealed: true,
        })
      })
      .catch(() => {
        this.setState({
          username: 'No username found',
        })
      })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  register = () => {
    this.setState({
      loginError: false,
      registerError: false,
    })
    const { email, password } = this.state
    axios
      .post('/auth/register', { email, password })
      .then((res) => {
        this.setState({
          username: res.data.email,
          email: '',
          password: '',
          revealed: true,
        })
      })
      .catch(() => {
        this.setState({
          email: '',
          password: '',
          registerError: true,
        })
      })
  }

  login = () => {
    this.setState({
      loginError: false,
      registerError: false,
    })
    const { email, password } = this.state
    axios
      .post('/auth/login', { email, password })
      .then((res) => {
        this.setState({
          username: res.data.email,
          email: '',
          password: '',
          revealed: true,
        })
      })
      .catch(() => {
        this.setState({
          email: '',
          password: '',
          loginError: true,
        })
      })
  }

  logout = () => {
    axios.delete('/auth/logout').then(() => {
      this.setState({
        username: 'No user logged in',
        revealed: false,
        loginError: false,
        registerError: false,
      })
    })
  }

  render() {
    return (
      <div className="auth">
        <h1>Current user: {this.state.username}</h1>
        <div className="auth-box">
          <input
            name="email"
            onChange={this.handleChange}
            placeholder="email"
            value={this.state.email}
          />
          <input
            name="password"
            onChange={this.handleChange}
            placeholder="password"
            type="password"
            value={this.state.password}
          />
          {this.state.loginError && (
            <p className="error">Incorrect email or password</p>
          )}
          {this.state.registerError && (
            <p className="error">User already exists</p>
          )}
          <div className="button-box">
            <button onClick={this.register} className="auth-button">
              Register
            </button>
            <button onClick={this.login} className="auth-button">
              Login
            </button>
          </div>
          <button onClick={this.logout} className="auth-button">
            Logout
          </button>
        </div>
        <div
          className={`secret-stuff ${
            this.state.revealed ? 'revealed' : 'hidden'
          }`}
        ></div>
      </div>
    )
  }
}
export default Auth
