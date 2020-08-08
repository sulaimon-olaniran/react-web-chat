import React, { useState, useContext, useEffect, useRef } from 'react'
import { Redirect, NavLink } from 'react-router-dom'
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
import HomeIcon from '@material-ui/icons/Home'
import { auth, db } from '../../firebase/Firebase'
import ChatList from '../chats/chatlist/ChatList'
import ChatUsers from '../users/ChatUsers'
import FavoriteUsers from '../favorites/Favorites'
import { ProfileContext } from '../../context/ProfileContext'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { FetchDataContext } from '../../context/FetchDataContext'
import { makeStyles } from '@material-ui/core/styles'
import AppLoader from '../loader/AppLoader'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import NotificationsIcon from '@material-ui/icons/Notifications';


const DashBoard = ({ history }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [mainComponent, setMainComponent] = useState("chats") //on render dashboard would display the chats component
    const { profileLoading, chatLoading, userProfile, getUserProfile, getUserChats, setUserActiveTrue } = useContext(ProfileContext)
    const { handleTheme, isDarkTheme, themeClass, setOpenNotificationsDrawer, userNotification } = useContext(FetchDataContext)
    const mountedRef = useRef(true)
    const useStyles = makeStyles({
        paper: {
            background: isDarkTheme ? "rgb(0, 0, 14)" : "rgb(207, 236, 246)",
            color: isDarkTheme ? "rgb(215, 240, 248)" : "rgb(0, 0, 37)"
        }
    });

    const styles = useStyles()

    useEffect(() => {
        //fetching user's profile when dashboard mounts and setting user active status online.............
        auth.onAuthStateChanged(user => {
            if (!mountedRef.current) return null
            if (user) {
                if (userProfile !== null) {
                    getUserProfile()
                    getUserChats()
                    setUserActiveTrue()
                }
            } else {
                //setFetching(false)     
            }
        })

        return () => {
            mountedRef.current = false
        }

    }, [getUserChats, getUserProfile, setUserActiveTrue, userProfile])


    //function to switch component to be active on dashboard rendered screen
    const handleMainComponent = (component) => {
        setMainComponent(component)
        setAnchorEl(null)
    }


    const openAnchorEl = (event) => {
        setAnchorEl(event.currentTarget)
    }


    const closeAnchorEl = () => {
        setAnchorEl(null)
    };


    //logging user out of firebase and setting user active status offline..............
    const logUserOut = () => {
        db.collection("users").doc(auth.currentUser.uid).update({
            isActive: false,
            lastSeen: Date.now()
        })
            .then(() => {
                console.log('bye bye ohhh ohh')
                auth.signOut()
                history.push('/')
                setAnchorEl(null)
            })
            .catch(error => console.log(error))

    }

    //conditionally rendering components to main screen based on selected string from switch(chats renders chat, profile renders profile)//// felt using link would make it less user friendly

    let mainComponentDisplayed = null
    let activeClassName = null

    switch (mainComponent) {
        case 'profile':
            mainComponentDisplayed = <UserProfile />
            activeClassName = "profile"
            break;
        case 'chats':
            mainComponentDisplayed = <ChatList />
            activeClassName = "chats"
            break;
        case 'users':
            mainComponentDisplayed = <ChatUsers />
            activeClassName = "users"
            break;
        case 'favorites':
            mainComponentDisplayed = <FavoriteUsers />
            activeClassName = "favorites"
            break;
        default:
            mainComponentDisplayed = <ChatList />
            activeClassName = "chats"

    }
   


    const notifcationClass = userNotification ? 'new-notification' : null //conditionally setting notification classname if there's new notifications

    const loading = profileLoading || chatLoading ? true : false
    const error = userProfile !== null ? false : true
    const text = "Fetching User Profile"



    if (profileLoading || chatLoading) return <AppLoader error={error} loading={loading} text={text} /> //checking if profile fetching is going on
    if (auth.currentUser === null) return <Redirect to="/signin" /> //redirect user if user isn't logged in


    return (
        <div className={`dashboard-container ${themeClass}`}>

            <div className="dashboard-links">
                <Button ><Avatar onClick={openAnchorEl} size="small" src={userProfile && userProfile.displayImage} /></Button>

                <Button onClick={() => handleMainComponent("chats")}
                    className={activeClassName === "chats" ? "chats" : null}
                >Chats <ChatIcon fontSize="small" /></Button>

                <Button onClick={() => handleMainComponent("favorites")}
                    className={activeClassName === "favorites" ? "favorites" : null}
                >Favs<FavoriteIcon fontSize="small" /></Button>

                <Button onClick={() => handleMainComponent("users")}
                    className={activeClassName === "users" ? "users" : null}
                >Users <PeopleIcon fontSize="small" /></Button>

                <div className = {notifcationClass}>
                    <Button onClick={() => setOpenNotificationsDrawer(true)}>
                        {userNotification ? <NotificationsActiveIcon fontSize="small" /> : <NotificationsIcon  fontSize="small"/>}
                    </Button>
                </div>

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
                    />

                    <MenuItem onClick={() => handleMainComponent("profile")} >
                        <NavLink to="/"> <HomeIcon fontSize="small" /> Home</NavLink>
                    </MenuItem>


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