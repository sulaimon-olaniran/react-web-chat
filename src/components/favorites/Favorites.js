import React, { useContext } from 'react'
import { FetchDataContext } from '../../context/FetchDataContext'
import EachUser from '../users/eachuser/EachUser'
import { ProfileContext } from '../../context/ProfileContext'


const FavoriteUsers = () => {
    const { appUsers } = useContext(FetchDataContext)
    const { userProfile } = useContext(ProfileContext)
    
    //just getting favorite lists and making use of the already created users component to display favorites friends of user
    return (
        <div className="chat-users-container">
            {
                userProfile.favorites.length > 0 ?
                    <div className="users-listing-container">
                        {
                            appUsers.map((user) => {

                                return userProfile.favorites.includes(user.id)
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
                            <p>To get notifications from a user, they need to be added to your favorites list</p>
                            <p>Please head over to users sections to add a user as your favorite by clicking on the love icon.</p>
                        </div>
                    </div>
            }
        </div>
    )
}


export default FavoriteUsers