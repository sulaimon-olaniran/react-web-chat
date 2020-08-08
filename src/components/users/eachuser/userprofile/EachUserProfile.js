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


const EachUserProfile = () => {
    const classes = useStyles()
    const { viewProfile, setViewProfile, selectedUser, setOpenChat, setSelectedUser, themeClass } = useContext(FetchDataContext)
    const { userProfile, chatMessages } = useContext(ProfileContext)
    const userArray = []
    const userNamesArray = []
    userArray.push(selectedUser.id)
    userProfile && userArray.push(userProfile.id)

    userNamesArray.push(selectedUser.userName)
    userNamesArray.push(userProfile.userName)

    const [viewProfileImage, setViewProfileImage] = useState(false)

    const openProfileImage = () => setViewProfileImage(true)
    const closeProfileImage = () => setViewProfileImage(false)


    const handleCloseProfile = () => {
        setViewProfile(false)
    }


    const openchatFromUsers = () => {
        const docId = userArray.sort().join(':')
        const arrayOfChatIds = []

        chatMessages.length > 0 && chatMessages.forEach(message => {
            arrayOfChatIds.push(message.chatId)
        })

        if (chatMessages.length > 0) {
            if (arrayOfChatIds.includes(docId)) {
                //console.log("chat already exists")
                setViewProfile(false)
                setOpenChat(true)
                setSelectedUser(selectedUser)
            }

            else {
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
                        //console.log("i went on to create the chat")
                    })

            }
        }
        else {
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
                    //console.log("i created the new chat,not him")
                })
        }


    }


    const addUserToFavorites = () => {
        const id = userProfile && userProfile.id
        db.collection('users').doc(id)
            .set({
                favorites: firebase.firestore.FieldValue.arrayUnion(selectedUser.id)

            }, { merge: true })
    }



    const removeUserFromFavorites = () => {
        const id = userProfile && userProfile.id
        db.collection('users').doc(id)
            .set({
                favorites: firebase.firestore.FieldValue.arrayRemove(selectedUser.id)
            }, { merge: true })
    }

    const favColor = userProfile && userProfile.favorites.length > 0 && userProfile.favorites.includes(selectedUser.id) ? 'favorite' : 'not-favorite'
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