import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './style.css';
import  firebase  from '../../config/fbConfig';
import { now } from 'moment';

class UsersNavbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      thisUser: ''
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.fetchCurrentUser(this.props.auth)
      } else {
        // User not logged in or has just logged out.
      }
    });
  }

  componentWillReceiveProps(props) {
    this.fetchCurrentUser(props.auth)
  }

  fetchCurrentUser(auth) {
    let db = firebase.firestore()
    db.collection('users').where("myCellNumber", "==", auth.phoneNumber).get()
    .then(snapshot => {
      snapshot.forEach( doc => {
        this.setState({ thisUser: doc.id })
      })
    })
    .catch(error => {
      console.log('Error!', error)
    })
  }

  render() {
    const { thisUser } = this.state
    // console.log(thisUser)
    if (thisUser) {
      return (
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper black">
              <div className="container">
                <Link to={'/user/' + thisUser} className="brand-logo left"><img className="img-responsive" src="/img/textIcon.png" alt="logo"/></Link>
                <Link to='/posts' className="brand-logo center">MY RING</Link>
                <Link to='/jobs' className="brand-logo right dropdown-trigger" data-target="jobsDropdown"><img className="img-responsive" src="/img/jobIcon.png" alt="logo"/></Link>
              </div>
            </div>
          </nav>
        </div>
      )  
    }
    else {
      return (
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper black">
              <div className="container">
                <Link to={'/join/'} className="brand-logo left"><img className="img-responsive" src="/img/joinIcon.png" alt="logo"/></Link>
                <Link to='/posts' className="brand-logo center">RING</Link>
                <Link to='/jobs' className="brand-logo right dropdown-trigger" data-target="jobsDropdown"><img className="img-responsive" src="/img/jobIcon.png" alt="logo"/></Link>
              </div>
            </div>
          </nav>
        </div>
      )  
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.thisUser,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}

export default connect(mapStateToProps)(UsersNavbar)
