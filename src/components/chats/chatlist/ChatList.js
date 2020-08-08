import React, { useContext } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { FetchDataContext } from '../../../context/FetchDataContext'
import moment from 'moment'
import DoneIcon from '@material-ui/icons/Done'
import { makeStyles } from '@material-ui/core/styles'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import { ProfileContext } from '../../../context/ProfileContext'

const useStyles = makeStyles((theme) => ({
    xsmall: {
        width: theme.spacing(2),
        height: theme.spacing(2),
    },
}));



const ChatList = () => {
    const { appUsers, setSelectedUser, setOpenChat } = useContext(FetchDataContext)
    const { chatMessages, userProfile } = useContext(ProfileContext)
    const classes = useStyles();

    const handleViewChatBoard = (user) => {
        setOpenChat(true)
        setSelectedUser(user)
    }

    //SORTING CHAT LIST FROM NEWEST CHATS TO THE OLDEST ONES
    const sortFunction = (a, b) => {
        //comparison checks for latest message time, if not availble uses the time chat was created at to compare
        const comparisonA = a.messages.length > 0 ? a.messages[a.messages.length - 1].timeStamp : a.createdAt 
        const comparisonB = b.messages.length > 0 ? b.messages[b.messages.length - 1].timeStamp : b.createdAt

        let comparisonStatus = 0 // to display true or false at the end

        if (comparisonA < comparisonB) {
            comparisonStatus = 1
        }
        else
            if (comparisonA > comparisonB) {
                comparisonStatus = -1
            }
        return comparisonStatus;
    }


    return (
        <div className="chats-list-container">
            {   //checking if user has any chats available
                chatMessages.length > 0 ?
                    <List>
                        {
                            chatMessages.sort(sortFunction).map((userChat) => { 
                                return userChat.interloctors.map((interloctor) => {
                                    if (interloctor !== userProfile.id) {
                                        //getting id from the chat that's not the current logged in user(the id of the user's friend)
                                        return appUsers.map((user) => {
                                            //console.log(user)

                                            if (user.id === interloctor) { //matching friend's id with his/her id from all the users(to gain access to the friend's information)
                                                return (
                                                    userChat.messages.length > 0 || userChat.createdBy === userProfile.id ?
                                                    //sending user to the chat board as selected user
                                                        <ListItem key={user.id} onClick={() => handleViewChatBoard(user)}>
                                                            <ListItemAvatar>
                                                                <Avatar src={user.displayImage} alt={user.userName.split('')[0]} />
                                                            </ListItemAvatar>

                                                            <ListItemText
                                                                primary={
                                                                    <div className="chat-list-name">
                                                                        <p>{user.userName}</p>
                                                                        <FiberManualRecordIcon
                                                                            className={user.isActive ? 'online' : 'offline'} />
                                                                    </div>
                                                                }
                                                                secondary={
                                                                    <Typography component="div">
                                                                        { //conditional rendering based on informations from message i.e if i sent the message i dont want to see something like unread msgs but want my friend to see it
                                                                            userChat.messages.length > 0 ?
                                                                                <span>
                                                                                    {userChat.messages[userChat.messages.length - 1].messagetype === "image" ?
                                                                                        <p style={{ color: "darkgreen" }}>
                                                                                            {userChat.messages[userChat.messages.length - 1].sender === userProfile.id ? "You" : user.userName} sent an image
                                                                                        </p>
                                                                                        :
                                                                                        <p>
                                                                                            {`${userChat.messages[userChat.messages.length - 1].message.substring(0, 20)}....`}

                                                                                            {userChat.messages[userChat.messages.length - 1].sender === userProfile.id && <DoneIcon className={classes.xsmall} />}

                                                                                            {userChat.messages[userChat.messages.length - 1].sender !== userProfile.id ?
                                                                                                userChat.messageRead === false && <span style={{ color: "red" }}>unread message(s)</span> : null
                                                                                            }
                                                                                        </p>
                                                                                    }
                                                                                    <small>{moment(userChat.messages[userChat.messages.length - 1].timeStamp).calendar()}</small>
                                                                                </span>
                                                                                :
                                                                                <small>Say hello to your new chat...</small>
                                                                        }
                                                                    </Typography>
                                                                }
                                                            />
                                                        </ListItem>
                                                        :
                                                        <ListItem key={user.id} onClick={() => handleViewChatBoard(user)}>
                                                            <ListItemAvatar>
                                                                <Avatar src={user.displayImage} alt={user.userName.split('')[0]} />
                                                            </ListItemAvatar>

                                                            <ListItemText
                                                                primary={
                                                                    <div className="chat-list-name">
                                                                        <p>{user.userName}</p>
                                                                        <FiberManualRecordIcon
                                                                            className={user.isActive ? 'online' : 'offline'} />
                                                                    </div>
                                                                }
                                                                secondary={
                                                                    <Typography component="div">
                                                                        {
                                                                            userChat.messages.length > 0 ?
                                                                                null
                                                                                :
                                                                                <small>{user.userName} wants to chat with you...</small>
                                                                        }
                                                                    </Typography>
                                                                }
                                                            />
                                                        </ListItem>

                                                )
                                            } else return null

                                        })
                                    } else {
                                        return null
                                    }
                                })
                            })

                        }
                    </List>
                    :
                    //just condtitioned component to display when user has no chat yet............
                    <div className="no-chats-content">
                        <div className="dark-overlay">
                            <h1>Welcome {userProfile.name}</h1>
                            <h2>Thank you for choosing OS-Messanger</h2>
                            
                            <p>
                                You currently have no chats,
                                please visit the Users section
                                and choose a user to chat with.
                            </p>

                            <p>
                                To edit your profile please click the
                                human icon at the top far left corner of your screen
                                and select profile.
                            </p>
                        </div>
                    </div>


            }


        </div>
    )



}


// const RenderOnZeroChats = () =>{

// }


export default ChatList