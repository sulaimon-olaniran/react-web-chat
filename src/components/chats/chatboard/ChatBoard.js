import React, { useContext, useState, useEffect } from 'react'
import ChatInput from '../chatinput/ChatInput'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import { FetchDataContext } from '../../../context/FetchDataContext'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Slide from '@material-ui/core/Slide'
import moment from 'moment'
import DoneIcon from '@material-ui/icons/Done'
import { ProfileContext } from '../../../context/ProfileContext'
import ScrollToBottom, { useSticky, useScrollToBottom } from 'react-scroll-to-bottom'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import { db } from '../../../firebase/Firebase'
import ViewImageComponent from '../../ViewImage'

//THIS COMPONENT HOLDS THE CHATTING DISPLAY ITSELF

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
        cursor: "pointer"
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
    const [sticky] = useSticky()
    const scrollToBottom = useScrollToBottom()

    const [viewImageModal, setViewImageModal] = useState(false) //handles viewing profile from the chat board, if true modal would open with user profile displayed
    const [selectedImg, setSelectedImg] = useState(null) //holds image of the profile user is trying to view


    //function for filtering out the selected chats from lists of availble user chats
    const getSelectedChat = (chat) => {
        return chat.interloctors.includes(selectedUser.id)
    }

    //function for closing chatboard
    const closeChatBoard = () => {
        setOpenChat(false) //this function was gotten from context
    }

    const closeImageModal = () => {
        setViewImageModal(false)
    }

    const openImageModal = (image) => {
        setViewImageModal(true) // opens modal
        setSelectedImg(image) // and sets image state with image url from profile of user being chatted with
    }

    //variable holding the filtered(selected) chat
    const selectedChat = chatMessages.filter(getSelectedChat)


    useEffect(() => {
        //setting message read to true once receiver opens chat board
        if (
            openChat === true && selectedChat[0].messages[selectedChat[0].messages.length - 1].sender !== undefined &&
            selectedChat[0].messages[selectedChat[0].messages.length - 1].sender !== userProfile.id
        ) {
            db.collection("chats").doc(selectedChat[0].chatId).update({
                messageRead: true,
            })
                .then(() => {
                    console.log('changed message read to true ohhhhhhh')
                })
                .catch(error => console.log(error))
        }
    }, [selectedChat, userProfile.id, openChat])


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
                                    onClick={() => setViewProfile(true)}
                                />
                                <span>
                                    <p> {selectedUser.userName}<FiberManualRecordIcon className={selectedUser.isActive ? 'online' : 'offline'} /></p>
                                    {selectedUser.isActive === false ? <small>Last seen; {moment(selectedUser.lastSeen).calendar()}</small>
                                        : <small style={{ color: 'darkgreen', fontSize: "1rem" }}>Active</small>}
                                </span>
                            </div>

                        </div>

                        <div className="chat-board-messages"  >
                            <ScrollToBottom className="messages-container" >
                                {
                                    selectedChat.length > 0 ? selectedChat[0].messages.map((message, i) => {
                                        //aligning message left or right based on sender of the message
                                        const alignMessage = message.sender === userProfile.id ? "align-message-right" : "align-message-left"
                                        return (
                                            <div className={`each-message-container ${alignMessage}`} key={i} >
                                                {
                                                    message.messagetype === "image" ?
                                                        //if message type is image, display an image shaped div not a text shaped div in the chat
                                                        <div className="message-type-image">
                                                            <img src={message.message} alt="Img File" onClick={() => openImageModal(message.message)} />
                                                            <small>{moment(message.timeStamp).fromNow()}</small>

                                                            {/* modal to view image sent in chats */}
                                                            <ViewImageComponent
                                                                openModal={viewImageModal}
                                                                closeModal={closeImageModal}
                                                                imageFile={selectedImg}
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
                            <ChatInput selectedChat={selectedChat} userProfile={userProfile} />
                        </div>
                    </div>
                </Slide>

            </Modal>


        </React.Fragment>
    )
}

export default ChatBoard