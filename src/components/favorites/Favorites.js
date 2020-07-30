import React, { useContext } from 'react'
import { FetchDataContext } from '../../context/FetchDataContext'
import EachUser from '../users/eachuser/EachUser'
import { ProfileContext } from '../../context/ProfileContext'


const FavoriteUsers = () => {
    const { appUsers } = useContext(FetchDataContext)
    const { userProfile } = useContext(ProfileContext)
    //console.log(userProfile)
    return (
        <div className="chat-users-container">
             <div className="users-listing-container">
            {
                appUsers.map((user) => {

                    return userProfile.favorites.includes(user.userName)
                        &&
                        <React.Fragment key={user.id}>
                           <EachUser user={user} />
                        </React.Fragment>
                })
            }
         </div>
        </div>
    )
}


export default FavoriteUsers