import React, { useState, useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import PeopleIcon from '@material-ui/icons/People'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ChatIcon from '@material-ui/icons/Chat'
import Avatar from '@material-ui/core/Avatar'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import PersonTwoToneIcon from '@material-ui/icons/PersonTwoTone'
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone'
import UserProfile from '../profile/UserProfile'
import { auth, db } from '../../firebase/Firebase'
import ChatList from '../chats/chatlist/ChatList'
import ChatUsers from '../users/ChatUsers'
import FavoriteUsers from '../favorites/Favorites'
import { ProfileContext } from '../../context/ProfileContext'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { FetchDataContext } from '../../context/FetchDataContext'
import { makeStyles } from '@material-ui/core/styles'


const DashBoard = ({ history }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [mainComponent, setMainComponent] = useState("chats")
    const { profileLoading, chatLoading, userProfile, getUserProfile, getUserChats } = useContext(ProfileContext)
    const { handleTheme, isDarkTheme, themeClass } = useContext(FetchDataContext)

    const useStyles = makeStyles({
        paper: {
            background: isDarkTheme ? "rgb(0, 0, 14)" : "rgb(207, 236, 246)",
            color: isDarkTheme ? "rgb(215, 240, 248)" : "rgb(0, 0, 37)"
        }
    });

    const styles = useStyles()

    // useEffect(() =>{
    //       getUserProfile()
    //       getUserChats()
    // }, [])

    const handleMainComponent = (component) => {
        setMainComponent(component)
        //console.log(component)
        setAnchorEl(null)
    }

    const openAnchorEl = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const closeAnchorEl = () => {
        setAnchorEl(null)
    };

    const logUserOut = () => {
        console.log("hello")
        setAnchorEl(null)
        auth.signOut()
        history.push('/')
    }

    //conditionally rendering components to main screen based on button clicked
    let mainComponentDisplayed = null

    switch (mainComponent) {
        case 'profile':
            mainComponentDisplayed = <UserProfile />;
            break;
        case 'chats':
            mainComponentDisplayed = <ChatList />;
            break;
        case 'users':
            mainComponentDisplayed = <ChatUsers />;
            break;
        case 'favorites':
            mainComponentDisplayed = <FavoriteUsers />;
            break;
        default:
            mainComponentDisplayed = <ChatList />;

    }

    if (auth.currentUser === null) return <Redirect to="/signin" />
    if (profileLoading || chatLoading) return <h1>Dashboard loading</h1>
    return (
        <div className={`dashboard-container ${themeClass}`}>

            <div className="dashboard-links">
                <Button ><Avatar onClick={openAnchorEl} sizes="small" src={userProfile && userProfile.displayImage} /></Button>
                <Button onClick={() => handleMainComponent("chats")}>Chats <ChatIcon fontSize="small" /></Button>
                <Button onClick={() => handleMainComponent("favorites")}>Favorites <FavoriteIcon fontSize="small" /></Button>
                <Button onClick={() => handleMainComponent("users")}>Users <PeopleIcon fontSize="small" /></Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={closeAnchorEl}
                    classes={{ paper: styles.paper }}
                >
                    <MenuItem onClick={() => handleMainComponent("profile")} > <PersonTwoToneIcon fontSize="small" /> Profile</MenuItem>
                    <FormControlLabel
                        control={<Switch fontSize="small" color="default" checked={isDarkTheme} onChange={handleTheme} />}
                        label="Theme"
                        labelPlacement="top"
                        fontSize="small"
                        onClick={closeAnchorEl}
                    />
                    <MenuItem onClick={logUserOut} > <LockTwoToneIcon fontSize="small" /> Log Out</MenuItem>
                </Menu>

            </div>

            <main className={`${themeClass}`}>
                {mainComponentDisplayed}
            </main>
        </div>
    )
}

export default DashBoard