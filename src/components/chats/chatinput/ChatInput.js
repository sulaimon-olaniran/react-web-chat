import React, { useState } from 'react'
import firebase, { db } from '../../../firebase/Firebase'
import TextField from '@material-ui/core/TextField'
import SendIcon from '@material-ui/icons/Send';

const ChatInput = ({ userName, selectedChat }) => {
    const [message, setMessage] = useState('')
    const docId = selectedChat[0].interloctors.sort().join(':')

    const getInputText = (e) => {
        e.keyCode === 13 ? submitMessage() : setMessage(e.target.value)
    }

    const messageValidity = (message) => message && message.replace(/\s/g, '').length

    const submitMessage = () => {
        if(messageValidity(message)){
        setMessage('')
        db.collection('chats').doc(docId)
            .set({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: userName,
                    message: message,
                    timeStamp: Date.now()
                }),
                messageRead: false
            }, { merge: true })
            .then((res) => {
            })
        }
        else{
            window.navigator.vibrate(200)
        }

    }

    // console.log(message)
    return (
        <div className="chat-input-container">
            <div className="chat-input-contents">
                <TextField id="outlined-basic" variant="outlined" placeholder="type your message..." 
                    onChange={getInputText} 
                    value={message}
                    autoComplete="off"
                    autoCapitalize="on"
                    onKeyUp={(e) => getInputText(e)}
                />
                <SendIcon onClick={submitMessage} />
            </div>
        </div>
    )
}


export default ChatInput