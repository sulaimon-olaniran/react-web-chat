import React, { useContext, useState } from 'react'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import Backdrop from '@material-ui/core/Backdrop'
import { FetchDataContext } from '../../../../context/FetchDataContext'
import Slide from '@material-ui/core/Slide'
import Avatar from '@material-ui/core/Avatar'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ChatIcon from '@material-ui/icons/Chat'
import firebase, { db } from '../../../../firebase/Firebase'
import { ProfileContext } from '../../../../context/ProfileContext'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import moment from 'moment'
import ViewImageComponent from '../../../ViewImage'

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    large: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        cursor: "pointer"
    },
}))

//I JUST HAPPENED TO HAVE THIS COMPONENT HERE DEEP, BUT IT'S A VERY IMPORTANT COMPONENT OF THE APP....
//This component handles the modal that displays the user profile where othere users can then add user to favorite of begin chat with......


const EachUserProfile = () => {
    const classes = useStyles()
    const { viewProfile, setViewProfile, selectedUser, setOpenChat, setSelectedUser, themeClass } = useContext(FetchDataContext)
    const { userProfile, chatMessages } = useContext(ProfileContext)
    const userArray = [] //array of current users in the chat(their IDs is being selected)
    const userNamesArray = [] //username of current users in the chat

    userArray.push(selectedUser.id) //pushing friend's id to userArray
    userProfile && userArray.push(userProfile.id) //pushing logged in user id to user arry

    userNamesArray.push(selectedUser.userName)
    userNamesArray.push(userProfile.userName)

    const [viewProfileImage, setViewProfileImage] = useState(false) //viewing/opening of selected user profile image

    const openProfileImage = () => setViewProfileImage(true)
    const closeProfileImage = () => setViewProfileImage(false)


    const handleCloseProfile = () => {
        setViewProfile(false)
    }


    const openchatFromUsers = () => {
        const docId = userArray.sort().join(':') //forming a docId for messages with both users IDs alphabetically

        const arrayOfChatIds = [] // array to hold all availbale chats in the databaser

        chatMessages.length > 0 && chatMessages.forEach(message => { //mapping throuhg current chats in database
            arrayOfChatIds.push(message.chatId) //pushing current chats id to array
        })
       
        //checking if both users already have a chat together or not
        if (chatMessages.length > 0) {
            if (arrayOfChatIds.includes(docId)) {  //if they do have a chat together, just open up their chats in chat board
                setViewProfile(false)
                setOpenChat(true)
                setSelectedUser(selectedUser)
            }

            else {//else create their chats
                db.collection('chats').doc(docId).set({
                    createdBy: userProfile.id,
                    createdAt: Date.now(),
                    chatId: docId,
                    messageRead: false,
                    interloctors: userArray,
                    userNames : userNamesArray,
                    messages: []
                })
                    .then(() => {
                        setViewProfile(false)
                        setOpenChat(true)
                        setSelectedUser(selectedUser)
                    })

            }
        }
        else { //if user has no active chats, just go on and create the chat
            db.collection('chats').doc(docId).set({
                createdBy: userProfile.id,
                createdAt: Date.now(),
                chatId: docId,
                messageRead: false,
                interloctors: userArray,
                userNames : userNamesArray,
                messages: []
            })
                .then(() => {
                    setViewProfile(false)
                    setOpenChat(true)
                    setSelectedUser(selectedUser)
                })
        }


    }


    const addUserToFavorites = () => { //function to add user to favorite lists of logged in user..
        const id = userProfile && userProfile.id
        db.collection('users').doc(id)
            .set({
                favorites: firebase.firestore.FieldValue.arrayUnion(selectedUser.id)

            }, { merge: true })
    }



    const removeUserFromFavorites = () => { //function to remove user to favorite lists of logged in user..
        const id = userProfile && userProfile.id
        db.collection('users').doc(id)
            .set({
                favorites: firebase.firestore.FieldValue.arrayRemove(selectedUser.id)
            }, { merge: true })
    }
    
    //conditionally coloring the love icon based on if user is in favorites list or not
    const favColor = userProfile && userProfile.favorites.length > 0 && userProfile.favorites.includes(selectedUser.id) ? 'favorite' : 'not-favorite'

    //conditionally passing function to favorites button based on if user is already favorite or not
    const currentFunction = userProfile && userProfile.favorites.length > 0 && userProfile.favorites.includes(selectedUser.id) ? removeUserFromFavorites : addUserToFavorites

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={viewProfile}
                onClose={handleCloseProfile}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Slide direction="up" in={viewProfile} mountOnEnter unmountOnExit>
                    <div className={`user-profile-view ${themeClass}`}>
                        <Avatar alt="Remy Sharp" src={selectedUser.displayImage} className={classes.large}
                            onClick={selectedUser.displayImage !== '' ? openProfileImage : null} />
                        <div className="user-profile-details">
                            <p>{selectedUser.name} ({selectedUser.userName}) <FiberManualRecordIcon className={selectedUser.isActive ? 'online' : 'offline'} /></p>
                            {selectedUser.isActive === false && <small>Last seen; {moment(selectedUser.lastSeen).calendar()}</small>}
                            {selectedUser.state !== '' && selectedUser.country !== '' && <p>{selectedUser.state}, {selectedUser.country}</p>}
                            {selectedUser.about !== '' && <p>{selectedUser.about}</p>}
                        </div>
                        {
                            userProfile && selectedUser.userName !== userProfile.userName
                            &&
                            <div className="profile-actions-container">
                                <FavoriteIcon className={favColor} onClick={currentFunction} />
                                <ChatIcon onClick={openchatFromUsers} />
                            </div>
                        }
                    </div>
                </Slide>

            </Modal>
            <ViewImageComponent
                openModal={viewProfileImage}
                closeModal={closeProfileImage}
                imageFile={selectedUser.displayImage}
            />
        </div>
    )
}

export default EachUserProfile