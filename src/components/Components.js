import React, { useContext, useRef } from 'react'
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
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { db } from '../firebase/Firebase'
import incoming_message from './assets/incoming_message.wav'
import Notifications from './notifications/Notifications'
//import { auth } from '../firebase/Firebase'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}


const Components = () => {
    const { authComplete, loggedIn, error, isAuth, userProfile, profileLoading } = useContext(ProfileContext)
    const { appUsers, openChat, messageNotifications, newNotification, setNewNotification, selectedUser } = useContext(FetchDataContext)
    const incomingMessage = useRef()
    const text = "Authenticating User"

    const filterFunction = (notification) => {
        return notification.seen === false && notification.usersId.includes(userProfile.id) && notification.sender !== userProfile.id 
    }
    const filteredNotifications = messageNotifications.length > 0 ? messageNotifications.filter(filterFunction) : null
    //console.log(filteredNotifications)

    const setNotifactionToSeen = () =>{
        filteredNotifications && filteredNotifications.forEach(each => {
            return (
                db.collection('message_notifications').doc(each.id)
                    .update({
                        seen: true
                    })
                    .then((res) => {
                        setNewNotification(false)
                    })
            )
        })
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotifactionToSeen()
    }

    if (!authComplete) return <AppLoader loading={isAuth} error={error} text={text} />
    return (
        <React.Fragment>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/dashboard" component={authComplete && DashBoard} />
                <Route exact path="/signup" component={() => <FormikSignUpPage users={appUsers} />} />
                <Route exact path="/signin" component={FormikSignInPage} />
            </Switch>
            {loggedIn && <EachUserProfile />}
            {openChat && <ChatBoard />}
            {loggedIn && !profileLoading && <Notifications />}

            {
                filteredNotifications && filteredNotifications.map((notification, i) => {
                    if (openChat === true && notification.usersId.includes(selectedUser.id)) {
                        setNotifactionToSeen()
                    }
                    else {
                        incomingMessage.current && incomingMessage.current.play()
                       
                        return (
                            <Snackbar open={newNotification === true && notification.seen === false} autoHideDuration={2000} onClose={handleCloseAlert}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center'
                                }}
                                key={i}
                            >
                                <Alert onClose={handleCloseAlert} severity="success">
                                    {notification.content}
                                </Alert>
                            </Snackbar>)
                    }
                })
            }
            <audio src={incoming_message} ref={incomingMessage} ></audio>
        </React.Fragment>
    )
}


export default Components