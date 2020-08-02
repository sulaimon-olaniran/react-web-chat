import React, { useContext } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
//import { ProfileContext } from '../../context/ProfileContext'

const AppLoader = ({loading, error, text}) => {
   // const { profileFetch, chatsFetch, authComplete, error, userProfile, chatMessages, isAuth } = useContext(ProfileContext)
    const outcome = !error ? <CheckCircleIcon className="success" /> : <ErrorOutlineIcon className="error" />
    return (
        <div className="app-loader-container">
            <div className="each-loader-container">
                <h1>{text}</h1>
                { !loading ? <CircularProgress color="secondary" /> : outcome}
            </div>
        </div>
    )
}


export default AppLoader