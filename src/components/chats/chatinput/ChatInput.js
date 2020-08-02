import React, { useState } from 'react'
import firebase, { db } from '../../../firebase/Firebase'
import TextField from '@material-ui/core/TextField'
import SendIcon from '@material-ui/icons/Send'
import SendImage from './sendimage/SendImage'
import ChatEmojis from './emoji/Emojis'
//import TextareaAutosize from '@material-ui/core/TextareaAutosize'

const ChatInput = ({ userName, selectedChat }) => {
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState(null)
    const [openEmoji, setOpenEmoji] = useState(false)
    const docId = selectedChat[0].interloctors.sort().join(':')

    const getInputText = (e) => {
        e.keyCode === 13 ? submitMessage(message, 'text') : setMessage(e.target.value)
        e.keyCode === 13 ? submitMessage() : setMessageType('text')
    }

    //const messageValidity = (message) => message && message.replace(/\s/g, '').length

    const submitMessage = (message, type) => {
        if (message && message.replace(/\s/g, '').length > 0) {
            setMessage('')
            db.collection('chats').doc(docId)
                .set({
                    messages: firebase.firestore.FieldValue.arrayUnion({
                        sender: userName,
                        message: message,
                        timeStamp: Date.now(),
                        messagetype: type
                    }),
                    messageRead: false
                }, { merge: true })
                .then((res) => {
                })
        }
        else {
            window.navigator.vibrate(200)
            console.log("message not valid")
            console.log(message)
        }

    }


    const handleOpenEmoji = () => {
        setOpenEmoji(true)
    }

    // console.log(message)
    return (
        <div className="chat-input-container">
            <div className="chat-input-contents">
                <div className="image-emoji-container">
                    <SendImage setMessageType={setMessageType} setMessage={setMessage} submitMessage={submitMessage} />
                    <span role="img" aria-label="tongouee" className="wave-icon" >😊</span>
                </div>
                <div className="input-text-container">
                    <TextField id="outlined-basic" variant="outlined" placeholder="type your message..."
                        onChange={getInputText}
                        value={message}
                        autoComplete="off"
                        onKeyUp={(e) => getInputText(e)}
                    />
                </div>
                <div className="send-icon-container">
                    <SendIcon onClick={() => submitMessage(message, 'text')} />
                </div>

                <ChatEmojis openEmoji={openEmoji} setOpenEmoji={setOpenEmoji} setMessage={setMessage} />
            </div>
        </div>
    )
}


export default ChatInput