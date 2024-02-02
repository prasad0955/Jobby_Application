import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaStar, FaShoppingBag} from 'react-icons/fa'
import {BsSearch} from 'react-icons/bs'
import {IoLocation} from 'react-icons/io5'
import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobContext from '../../context/JobContext'

import './index.css'

const profileStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}
class Jobs extends Component {
  state = {
    name: '',
    profileImageUrl: '',
    shortBio: '',
    searchValue: '',
    activeEmployeeType: '',
    activeSalaryRangesList: '',
    jobsList: [],
    activeProfileStatus: profileStatus.loading,
    activejobsStatus: profileStatus.loading,
  }

  componentDidMount = () => {
    this.fetchUserProfile()
    this.fetchjobDetailsList()
  }

  fetchUserProfile = async () => {
    const profileUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileUrl, options)
    if (response.ok) {
      const fetchDetails = await response.json()
      const profileDetails = fetchDetails.profile_details
      const profile = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        name: profile.name,
        profileImageUrl: profile.profileImageUrl,
        shortBio: profile.shortBio,
        activeProfileStatus: profileStatus.success,
      })
    } else {
      this.setState({activeProfileStatus: profileStatus.failure})
    }
  }

  fetchjobDetailsList = async () => {
    const {activeEmployeeType, activeSalaryRangesList, searchValue} = this.state
    const jobListUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmployeeType}&minimum_package=${activeSalaryRangesList}&search=${searchValue}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobListUrl, options)
    if (response.ok) {
      const fetchJobDetails = await response.json()
      const {jobs} = fetchJobDetails
      const updatedJobs = jobs.map(item => {
        const updatedItem = {
          companyLogoUrl: item.company_logo_url,
          employmentType: item.employment_type,
          id: item.id,
          jobDescription: item.job_description,
          location: item.location,
          packagePerAnnum: item.package_per_annum,
          rating: item.rating,
          title: item.title,
        }
        return updatedItem
      })
      this.setState({
        jobsList: updatedJobs,
        activejobsStatus: profileStatus.success,
      })
    } else {
      this.setState({activejobsStatus: profileStatus.failure})
    }
  }

  getUserProfileDetails = () => {
    const {name, profileImageUrl, shortBio} = this.state
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h3 className="profile-heading-job">{name}</h3>
        <p className="short-para">{shortBio}</p>
      </div>
    )
  }

  getProfileFailureView = () => (
    <div className="profile-container">
      <button type="button" className="retry-button">
        Retry
      </button>
    </div>
  )

  getProfileData = () => {
    const {activeProfileStatus} = this.state
    switch (activeProfileStatus) {
      case profileStatus.loading:
        return this.loadingMethod()
      case profileStatus.success:
        return this.getUserProfileDetails()
      case profileStatus.failure:
        return this.getProfileFailureView()
      default:
        return null
    }
  }

  getEmployeementcheckboxex = employmentTypesList => {
    const onChnageEmploymentTypesList = async () => {
      const filteredList = employmentTypesList.filter(item => {
        const ele = document.getElementById(item.employmentTypeId)
        if (ele.checked === true) {
          return true
        }
        return false
      })
      const employeetypeList = filteredList.map(item => item.employmentTypeId)
      await this.setState({activeEmployeeType: employeetypeList.join(',')})
      this.componentDidMount()
    }
    return (
      <>
        <h3 className="employmentTypesList-heading">Type of Employment</h3>
        <ul className="employmentTypesList-ul">
          {employmentTypesList.map(item => (
            <li className="employmentTypesList-li" key={item.employmentTypeId}>
              <input
                type="checkbox"
                id={item.employmentTypeId}
                value={item.employmentTypeId}
                className="employmentTypesList-input-el"
                onChange={onChnageEmploymentTypesList}
              />
              <label
                htmlFor={item.employmentTypeId}
                className="employmentTypesList-label-el"
              >
                {item.label}
              </label>
            </li>
          ))}
        </ul>
      </>
    )
  }

  getsalaryRangesListcheckboxex = salaryRangesList => {
    const onChnageSalaryRangesList = async event => {
      await this.setState({activeSalaryRangesList: event.target.value})
      this.componentDidMount()
    }
    return (
      <>
        <h3 className="employmentTypesList-heading">Salary Range</h3>
        <ul className="employmentTypesList-ul">
          {salaryRangesList.map(item => (
            <li className="employmentTypesList-li" key={item.salaryRangeId}>
              <input
                type="radio"
                id={item.salaryRangeId}
                value={item.salaryRangeId}
                className="employmentTypesList-input-el"
                onClick={onChnageSalaryRangesList}
                name="salary"
              />
              <label
                htmlFor={item.salaryRangeId}
                className="employmentTypesList-label-el"
              >
                {item.label}
              </label>
            </li>
          ))}
        </ul>
      </>
    )
  }

  getjobList = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-img-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-image"
          />
          <h2 className="no-jobs-heading">No Jobs</h2>
          <p className="no-jobs-para">
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }
    return (
      <ul className="jobslist-ul-container">
        {jobsList.map(item => (
          <li className="jobslist-li-container" key={item.id}>
            <Link to={`/jobs/${item.id}`} className="jobitemdetails-link">
              <div className="job-logo-title-contsiner">
                <img
                  src={item.companyLogoUrl}
                  alt="company logo"
                  className="company-logo"
                />
                <div>
                  <h5 className="title-job-heading">{item.title}</h5>
                  <div className="star-container">
                    <FaStar className="start-icon" />
                    <p className="rating-para">{item.rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-package-container">
                <div className="job-location-container">
                  <IoLocation className="location-logo" />
                  <p className="location-para">{item.location}</p>
                  <FaShoppingBag className="jop-logo" />
                  <p className="employeement-type-para">
                    {item.employmentType}
                  </p>
                </div>
                <p>{item.packagePerAnnum}</p>
              </div>
              <hr className="hr-elememt" />
              <h4 className="description-heading">Description</h4>
              <p className="description-para">{item.jobDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  getjobsFailureView = () => (
    <div className="jobslist-ul-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className=""
      />
      <h2>Something went wrong</h2>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="retry-button">
        Retry
      </button>
    </div>
  )

  getjobListdata = () => {
    const {activejobsStatus} = this.state
    switch (activejobsStatus) {
      case profileStatus.loading:
        return this.loadingMethod()
      case profileStatus.success:
        return this.getjobList()
      case profileStatus.failure:
        return this.getjobsFailureView()
      default:
        return null
    }
  }

  onChangeSearchValue = async event => {
    await this.setState({searchValue: event.target.value})
  }

  clickSearchLogo = () => {
    this.setState({activejobsStatus: profileStatus.loading})
    this.componentDidMount()
  }

  loadingMethod = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {searchValue} = this.state
    return (
      <JobContext.Consumer>
        {value => {
          const {employmentTypesList, salaryRangesList} = value
          return (
            <>
              <Header />
              <div className="jobs-container">
                <div className="filter-container">
                  <div className="input-search-jobs-container">
                    <input
                      type="search"
                      placeholder="search"
                      className="input-search-jobs"
                      value={searchValue}
                      onChange={this.onChangeSearchValue}
                    />
                    <button
                      className="search-logo-image"
                      type="button"
                      aria-label="search-log1"
                      data-testid="searchButton"
                      onClick={this.clickSearchLogo}
                    >
                      <BsSearch className="search-icon" />
                    </button>
                  </div>
                  {this.getProfileData()}
                  {this.getEmployeementcheckboxex(employmentTypesList)}
                  <hr className="break-el" />
                  {this.getsalaryRangesListcheckboxex(salaryRangesList)}
                </div>
                <div className="jobs-list-search-bar-container">
                  <div className="input-search-jobs-container desktop-search-bar">
                    <input
                      type="search"
                      placeholder="search"
                      className="input-search-jobs"
                      value={searchValue}
                      onChange={this.onChangeSearchValue}
                    />
                    <button
                      className="search-logo-image"
                      type="button"
                      aria-label="search-log2"
                      data-testid="searchButton"
                      onClick={this.clickSearchLogo}
                    >
                      <BsSearch className="search-icon" />
                    </button>
                  </div>
                  {this.getjobListdata()}
                </div>
              </div>
            </>
          )
        }}
      </JobContext.Consumer>
    )
  }
}
export default Jobs
