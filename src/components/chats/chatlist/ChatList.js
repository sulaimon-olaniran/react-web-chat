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

    //const setActiveColor = online ? "online" : "offline"

    return (
        <div className="chats-list-container">
            <List>
                {
                    chatMessages.map((userChat) => {
                        return userChat.interloctors.map((interloctor) => {
                            if (interloctor !== userProfile.id) {
                                //console.log(inter)
                                return appUsers.map((user) => {
                                    //console.log(user)

                                    if (user.id === interloctor) {
                                        return (
                                            userChat.messages.length > 0 || userChat.createdBy === userProfile.userName ?
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
                                                                        <span>
                                                                            <p>
                                                                                {`${userChat.messages[userChat.messages.length - 1].message.substring(0, 20)}....`}
                                                                                {userChat.messages[userChat.messages.length - 1].sender === userProfile.userName && <DoneIcon className={classes.xsmall} />}
                                                                            </p>
                                                                            <small>{moment(userChat.messages[userChat.messages.length - 1].timeStamp).calendar()}</small>
                                                                        </span>
                                                                        :
                                                                        <small>Say hello to your new chat...</small>
                                                                }
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                                : null
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


        </div>
    )

}


export default ChatList