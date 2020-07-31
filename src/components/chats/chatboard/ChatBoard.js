import React, { useRef, useContext } from 'react'
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
//import { FullScreen, useFullScreenHandle } from "react-full-screen"

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
    const { selectedUser, openChat, setOpenChat, chatThemeClass } = useContext(FetchDataContext)
    const { userProfile, chatMessages } = useContext(ProfileContext)
    const classes = useStyles()
    const chatContainer = useRef(null)
    const [sticky] = useSticky()
    const scrollToBottom = useScrollToBottom()

    const getSelectedChat = (chat) => {
        return chat.interloctors.includes(selectedUser.id)
    }

    const closeChatBoard = () => {
        setOpenChat(false)
    }

    const selectedChat = chatMessages.filter(getSelectedChat)
    //console.log(selectedChat)
    const container = chatContainer.current

    return (
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
                            <Avatar alt="Remy Sharp" src={selectedUser.displayImage} className={classes.small} />
                            <p>
                                {selectedUser.userName}
                                <FiberManualRecordIcon className={selectedUser.isActive ? 'online' : 'offline'} />                                      
                            </p>
                        </div>
                    </div>
                    <div className="chat-board-messages"  >
                        <ScrollToBottom className="messages-container" >
                            {
                                selectedChat.length > 0 && selectedChat[0].messages.map((message, i) => {
                                    const alignMessage = message.sender.toLowerCase() === userProfile.userName.toLowerCase() ? "align-message-right" : "align-message-left"
                                    return (
                                        <div className={`each-message-container ${alignMessage}`} key={i} >
                                            <div className={`each-board-message`}>
                                                <p >{message.message} {message.sender === userProfile.userName && <DoneIcon className={classes.xsmall} />} </p>
                                                <small>{moment(message.timeStamp).fromNow()}</small>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            { !sticky && <button onClick={ scrollToBottom }>Click</button> }
                        </ScrollToBottom>
                        <ChatInput userName={userProfile && userProfile.userName} friendName={selectedUser && selectedUser.userName} selectedChat={selectedChat} />
                    </div>
                </div>
            </Slide>

        </Modal>
    )
}

export default ChatBoard