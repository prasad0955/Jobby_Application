import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {MdLocalPostOffice} from 'react-icons/md'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onLogoutButton = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="navbar-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo-header"
        />
      </Link>
      <ul className="ul-container">
        <li>
          <Link to="/">
            <AiFillHome className="home-logo-mobile" />
          </Link>
        </li>
        <li>
          <Link to="/jobs">
            <MdLocalPostOffice className="jobs-logo-mobile" />
          </Link>
        </li>
        <li onClick={onLogoutButton}>
          <FiLogOut className="logout-logo-mobile" />
        </li>
      </ul>
      <ul className="ul-container-desktop">
        <li>
          <Link to="/">
            <li className="desktop-head-li">Home</li>
          </Link>
        </li>
        <li>
          <Link to="/jobs">
            <li className="desktop-head-li">Jobs</li>
          </Link>
        </li>
      </ul>
      <button
        onClick={onLogoutButton}
        type="button"
        className="logout-desktop-botton"
      >
        Logout
      </button>
    </nav>
  )
}
export default withRouter(Header)
