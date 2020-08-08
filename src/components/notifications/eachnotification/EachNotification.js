import React, { useContext } from 'react'
import { db, auth } from '../../../firebase/Firebase'
import moment from 'moment'
import { FetchDataContext } from '../../../context/FetchDataContext'


const EachNotification = (notification) =>{
    const { appUsers, setViewProfile, setSelectedUser } = useContext(FetchDataContext)

    const filterFunction = (user) => {
        return user.id ===  notification.notification.userId || user.userName === notification.notification.userName
    }
    
    const selectedProfile = appUsers.filter(filterFunction)

    const collection = notification.notification.title //getting the notification collection from the notification(newuser_added or profile)
    const noteId = notification.notification.id //getting the unique id for the notification for updating it............
  
    //function for viewing users profile from notification slide bar.............
    const viewProfileFromNotification = () =>{
       setViewProfile(true)
       setSelectedUser(selectedProfile[0])
       const docId = auth.currentUser.uid

       db.collection('users').doc(docId).collection(collection).doc(noteId).update({
           viewed : true
       })
       .then(res =>{
           console.log('notification viewed')
       })
    }

    const notificationColor = notification.notification.viewed === false ? 'red' : null

    return(
        <div className="each-notification-container" onClick={viewProfileFromNotification}>
           <p style={{color : notificationColor}}>{notification.notification.content}</p>
           <small>{moment(notification.notification.time.toDate()).fromNow()}</small>
        </div>
    )
}

export default EachNotification