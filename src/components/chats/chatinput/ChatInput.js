import React, { useState } from 'react'
import firebase, { auth, db } from '../../../firebase/Firebase'
import TextField from '@material-ui/core/TextField'
import SendIcon from '@material-ui/icons/Send'
import SendImage from './sendimage/SendImage'
import ChatEmojis from './emoji/Emojis'

const ChatInput = ({ selectedChat, userProfile }) => {
    const [message, setMessage] = useState('')

    //getting document id of selected message
    const docId = selectedChat[0].chatId 

    const getInputText = (e) => {
        e.keyCode === 13 ? submitMessage(message, 'text') : setMessage(e.target.value)
    }

    const submitMessage = (message, type) => {
        if (message && message.replace(/\s/g, '').length > 0) { //checking if message isn't empty string or just spaces
            setMessage('')
            db.collection('chats').doc(docId)
                .set({
                    messages: firebase.firestore.FieldValue.arrayUnion({
                        sender: userProfile.id,
                        senderName : userProfile.userName,
                        message: message,
                        timeStamp: Date.now(),
                        messagetype: type
                    }),
                    messageRead: false
                }, { merge: true })

                .then((res) => {
                    if( userProfile.isActive === false){
                        db.collection("users").doc(auth.currentUser.uid).update({ //setting user active to online incase the dashboard components fails to run the active funcion
                            isActive: true,
                        })
                        .then(() => {
                            console.log('active')
                        })
                        .catch(error => console.log(error))
                    }

                })
        }
        else {
            //user trys to submit unvalid message, viberate for mobile phones.
            window.navigator.vibrate(200)
        }

    }


    // console.log(message)
    return (
        <div className="chat-input-container">
            <div className="chat-input-contents">
                <div className="image-emoji-container">
                    <SendImage submitMessage={submitMessage} />
                    <ChatEmojis setMessage={setMessage} />
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

            </div>
        </div>
    )
}


export default ChatInput