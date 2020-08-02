import React, { useContext } from 'react'
import { Route, Switch } from 'react-router-dom'
import HomePage from './homepage/HomePage'
import FormikSignUpPage from './Authentication/signup/SignUp'
import FormikSignInPage from './Authentication/signin/SignIn'
import DashBoard from './dashboard/DashBoard'
import EachUserProfile from './users/eachuser/userprofile/EachUserProfile'
import { FetchDataContext } from '../context/FetchDataContext'
import { ProfileContext } from '../context/ProfileContext'
import AppLoader from './loader/AppLoader'
import ChatBoard from './chats/chatboard/ChatBoard'
//import { auth } from '../firebase/Firebase'




const Components = () => {
    const {authComplete, loggedIn, error, isAuth } = useContext(ProfileContext)
    const { appUsers, openChat } = useContext(FetchDataContext)
    const text = "Authenticating User"
    const yes = true
    if ( !authComplete ) return <AppLoader loading={isAuth} error={error} text={text} />
    return (
        <React.Fragment>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/dashboard" component={ authComplete && DashBoard} />
                <Route exact path="/signup" component={() => <FormikSignUpPage users={appUsers} />} />
                <Route exact path="/signin" component={FormikSignInPage} />
            </Switch>
            { loggedIn && <EachUserProfile />}
            {openChat && <ChatBoard />}
        </React.Fragment>
    )
}


export default Components