import React, { useContext } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import { ProfileContext } from '../../context/ProfileContext'

const AppLoader = () => {
    const { profileFetch, chatsFetch, authComplete, error, userProfile, chatMessages, isAuth } = useContext(ProfileContext)
    const authOutCome = !error ? <CheckCircleIcon className="success" /> : <ErrorOutlineIcon className="error" />
    const profileOutCome =  userProfile !== null ? <CheckCircleIcon className="success" /> : <ErrorOutlineIcon className="error"/>
    const chatsOutCome = chatMessages.length > 0 ? <CheckCircleIcon className="success" /> : <ErrorOutlineIcon className="error"/>
    return (
        <div className="app-loader-container">

            <div className="each-loader-container">
                <h1>Authenticating User</h1>
                { !isAuth ? <CircularProgress color="secondary" /> : authOutCome}
            </div>
            {
                authComplete && !error &&
                <React.Fragment>
                    <div className="each-loader-container">
                       <h1>Getting User Profile </h1>
                       {profileFetch ? <CircularProgress color="secondary" /> : profileOutCome }
                    </div>

                    <div className="each-loader-container">
                        <h1>Getting User chats</h1>
                        {chatsFetch ? <CircularProgress color="secondary" /> : chatsOutCome }
                    </div>
                </React.Fragment>
            }
        </div>
    )
}


export default AppLoader