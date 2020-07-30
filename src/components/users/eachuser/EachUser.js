import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import { FetchDataContext } from '../../../context/FetchDataContext'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
}))


const EachUser = ({ user }) =>{
    const classes = useStyles();
    const { setViewProfile, setSelectedUser } = useContext(FetchDataContext)
    const handleProfileView = () =>{
        setViewProfile(true)
        setSelectedUser(user)
        console.log('hello')
    }
    return(
        <div className="each-user-container">
           <Avatar alt="Remy Sharp" src={user.displayImage} className={classes.large} onClick={handleProfileView} />
            <p>{user.userName}</p>
        </div>
    )
}

export default EachUser