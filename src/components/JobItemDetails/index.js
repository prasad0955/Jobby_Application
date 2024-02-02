import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaStar, FaShoppingBag, FaExternalLinkAlt} from 'react-icons/fa'
import {IoLocation} from 'react-icons/io5'

import Header from '../Header'

import './index.css'

const profileStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}
class JobItemDetails extends Component {
  state = {
    jobDetails: '',
    skills: [],
    similarJobs: [],
    isloading: profileStatus.loading,
    lifeAtCompany: '',
  }

  componentDidMount() {
    this.fetchItemDetails()
  }

  fetchItemDetails = async () => {
    this.setState({isloading: true})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const detailesUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(detailesUrl, options)
    if (response.ok) {
      const fetchDetails = await response.json()
      const obj = {
        jobDetails: fetchDetails.job_details,
        similarJobs: fetchDetails.similar_jobs,
      }
      const {jobDetails, similarJobs} = obj
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        lifeAtCompany: jobDetails.life_at_company,
        description: jobDetails.description,
        imageUrl: jobDetails.image_url,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        skills: jobDetails.skills,
        title: jobDetails.title,
      }
      const lifeAtCompany = {
        description: updatedJobDetails.lifeAtCompany.description,
        imageUrl: updatedJobDetails.lifeAtCompany.image_url,
      }
      const skills = updatedJobDetails.skills.map(item => ({
        imageUrl: item.image_url,
        name: item.name,
      }))
      const updatedSimilarJobs = similarJobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        rating: item.rating,
        title: item.title,
      }))
      const updatedJobDetail = {...updatedJobDetails, lifeAtCompany, skills}
      this.setState({
        jobDetails: updatedJobDetail,
        similarJobs: updatedSimilarJobs,
        skills,
        lifeAtCompany,
        isloading: profileStatus.success,
      })
    } else {
      this.setState({
        isloading: profileStatus.failure,
      })
    }
  }

  getskillset = () => {
    const {skills} = this.state
    return skills.map(item => (
      <li className="skill-li" key={item.name}>
        <img src={item.imageUrl} alt={item.name} className="skill-logo" />
        <p>{item.name}</p>
      </li>
    ))
  }

  getLifeAtCompany = () => {
    const {lifeAtCompany} = this.state
    const {description, imageUrl} = lifeAtCompany
    return (
      <>
        <h4>Life at company</h4>
        <div className="life-at-company-description-img">
          <p className="life-at-company-descritption">{description}</p>
          <img
            src={imageUrl}
            alt="life at company"
            className="life-at-company-image"
          />
        </div>
      </>
    )
  }

  getSimilarProducts = () => {
    const {similarJobs} = this.state
    console.log(similarJobs)
    return similarJobs.map(item => (
      <li className="similar-job-li-item" key={item.id}>
        <div className="job-logo-title-contsiner">
          <img
            src={item.companyLogoUrl}
            alt="similar job company logo"
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
        <h4>Description</h4>
        <p>{item.jobDescription}</p>
        <div className="location-package-container">
          <div className="job-location-container">
            <IoLocation className="location-logo" />
            <p className="location-para">{item.location}</p>
            <FaShoppingBag className="jop-logo" />
            <p className="employeement-type-para">{item.employmentType}</p>
          </div>
          <p>{item.packagePerAnnum}</p>
        </div>
      </li>
    ))
  }

  getJobDetailView = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    return (
      <>
        <div className="job-detail-container">
          <div className="job-logo-title-contsiner">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div>
              <h5 className="title-job-heading">{title}</h5>
              <div className="star-container">
                <FaStar className="start-icon" />
                <p className="rating-para">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-package-container">
            <div className="job-location-container">
              <IoLocation className="location-logo" />
              <p className="location-para">{location}</p>
              <FaShoppingBag className="jop-logo" />
              <p className="employeement-type-para">{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="hr-elememt" />
          <div className="website-link-container">
            <h4 className="description-heading">Description</h4>
            <div className="website-link-container">
              <a href={companyWebsiteUrl} className="website-link-heading">
                Visit
              </a>
              <FaExternalLinkAlt className="link-logo" />
            </div>
          </div>
          <p className="description-para">{jobDescription}</p>
          <h4>Skills</h4>
          <ul className="skill-ul-container">{this.getskillset()}</ul>
          {this.getLifeAtCompany()}
        </div>
        <ul className="similar-jobs-ul-container">
          {this.getSimilarProducts()}
        </ul>
      </>
    )
  }

  loadingMethod = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  jobDetailFailure = () => (
    <div className="jobslist-ul-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className=""
      />
      <h2>Oops! Something Went Wrong</h2>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="retry-button">
        Retry
      </button>
    </div>
  )

  jobDetailDtatView = () => {
    const {isloading} = this.state
    switch (isloading) {
      case profileStatus.loading:
        return this.loadingMethod()
      case profileStatus.success:
        return this.getJobDetailView()
      case profileStatus.failure:
        return this.jobDetailFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-detail-bg-container">
          {this.jobDetailDtatView()}
        </div>
      </>
    )
  }
}
export default JobItemDetails
