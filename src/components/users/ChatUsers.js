import React, { useContext } from 'react'
import { FetchDataContext } from '../../context/FetchDataContext'
import EachUser from './eachuser/EachUser'

const ChatUsers = () =>{
    const { appUsers } = useContext(FetchDataContext)
    //console.log(appUsers)

    return(
        <div className="chat-users-container">

            <div className="users-listing-container">
            {
                appUsers && appUsers.map((user) =>{
                    return(
                        <React.Fragment key={user.id}>
                           <EachUser user={user} />
                        </React.Fragment>
                    )
                })
            }
            </div>
        </div>
    )
}

export default ChatUsers