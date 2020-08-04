import React, { useRef, useContext, useState, useEffect } from 'react'
import ChatInput from '../chatinput/ChatInput'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import { FetchDataContext } from '../../../context/FetchDataContext'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Slide from '@material-ui/core/Slide'
import Button from '@material-ui/core/Button'
import moment from 'moment'
import DoneIcon from '@material-ui/icons/Done'
import { ProfileContext } from '../../../context/ProfileContext'
import ScrollToBottom, { useSticky, useScrollToBottom } from 'react-scroll-to-bottom'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import { db } from '../../../firebase/Firebase'
import ViewImageComponent from '../../ViewImage'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(6),
        height: theme.spacing(6),
        cursor : "pointer"
    },
    xsmall: {
        width: theme.spacing(2),
        height: theme.spacing(2),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

const ChatBoard = () => {
    const { selectedUser, openChat, setOpenChat, chatThemeClass, setViewProfile } = useContext(FetchDataContext)
    const { userProfile, chatMessages } = useContext(ProfileContext)
    const classes = useStyles()
    //const chatContainer = useRef(null)
    const [sticky] = useSticky()
    const scrollToBottom = useScrollToBottom()

    const [viewImageModal, setViewImageModal] = useState(false)
    const [selectedImg, setSelectedImg] = useState(null)

    const getSelectedChat = (chat) => {
        return chat.interloctors.includes(selectedUser.id)
    }

    const closeChatBoard = () => {
        setOpenChat(false)
    }

    const closeImageModal = () => {
        setViewImageModal(false)
    }

    const openImageModal = (image) => {
        setViewImageModal(true)
        setSelectedImg(image)
    }

    const selectedChat = chatMessages.filter(getSelectedChat)


    useEffect(() => {
        db.collection("chats").doc(selectedChat[0].chatId).update({
            messageRead: true,
        })
            .then(() => {
                console.log('read now true')
            })
            .catch(error => console.log(error))
    }, [])


    return (
        <React.Fragment>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openChat}
                onClose={closeChatBoard}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Slide direction="down" in={openChat} mountOnEnter unmountOnExit>
                    <div className={`chat-board-container ${chatThemeClass}`}>

                        <div className="chat-board-title">
                            <ArrowBackIcon onClick={closeChatBoard} fontSize="large" />

                            <div className="chat-board-title-profile">
                                <Avatar alt="Remy Sharp" src={selectedUser.displayImage} className={classes.small}
                                  onClick={ () => setViewProfile(true)}
                                />
                                <span>
                                    <p> {selectedUser.userName}<FiberManualRecordIcon className={selectedUser.isActive ? 'online' : 'offline'} /></p>
                                    {selectedUser.isActive === false ? <small>Last seen; {moment(selectedUser.lastSeen).calendar()}</small> 
                                    : <small style={{color:'darkgreen', fontSize:"1rem"}}>Active</small>}
                                </span>
                            </div>

                        </div>

                        <div className="chat-board-messages"  >
                            <ScrollToBottom className="messages-container" >
                                {
                                    selectedChat.length > 0 ? selectedChat[0].messages.map((message, i) => {
                                        const alignMessage = message.sender.toLowerCase() === userProfile.userName.toLowerCase() ? "align-message-right" : "align-message-left"
                                        return (
                                            <div className={`each-message-container ${alignMessage}`} key={i} >
                                                {
                                                    message.messagetype === "image" ?
                                                        //console.log(message.message)
                                                        <div className="message-type-image">
                                                            <img src={message.message} alt="Img File" onClick={() => openImageModal(message.message)} />
                                                            <small>{moment(message.timeStamp).fromNow()}</small>

                                                            <ViewImageComponent 
                                                                openModal = {viewImageModal}
                                                                closeModal = {closeImageModal}
                                                                imageFile = {selectedImg}
                                                            />
                                                            
                                                        </div>
                                                        :
                                                        <div className={`each-board-message`}>
                                                            <p >{message.message} {message.sender === userProfile.userName && <DoneIcon className={classes.xsmall} />} </p>
                                                            <small>{moment(message.timeStamp).fromNow()}</small>
                                                        </div>
                                                }

                                            </div>
                                        )
                                    })
                                        :
                                        <p>Let {selectedUser.userName} know you're interested in a chat by sending the first message</p>
                                }
                                {!sticky && <button onClick={scrollToBottom}>Click</button>}
                            </ScrollToBottom>
                            <ChatInput userName={userProfile && userProfile.userName} friendName={selectedUser && selectedUser.userName} selectedChat={selectedChat} />
                        </div>
                    </div>
                </Slide>

            </Modal>


        </React.Fragment>
    )
}

export default ChatBoard