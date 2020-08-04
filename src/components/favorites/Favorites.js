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
            {
                userProfile.favorites.length > 0 ?
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
                    :
                    <div className="no-user-available">
                        <div className="dark-overlay">
                            <h1>You currently have no favorite user(s)</h1>
                            <p>Please head over to users sections to add a user as your favorite by clicking on the love icon.</p>
                        </div>
                    </div>
            }
        </div>
    )
}


export default FavoriteUsers