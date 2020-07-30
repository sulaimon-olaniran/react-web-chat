import React, { useContext } from 'react'
import UserImage from './image/UserImage'
import FormikUserDetails from './details/UserDetails'
import { ProfileContext } from '../../context/ProfileContext'
import { FetchDataContext } from '../../context/FetchDataContext'



const UserProfile = () =>{
    const { userProfile } = useContext(ProfileContext)
    const { appUsers } = useContext(FetchDataContext)
    return(
        <div className="user-profile-container">
            <div className="user-profile-image-container">
                <UserImage />
            </div>

            <div className="user-profile-details-container" >
                <FormikUserDetails profile={userProfile}  users={appUsers}/>
            </div>

        </div>
    )
}


export default UserProfile