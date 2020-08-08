import React, { useContext, useEffect } from 'react'
import { FetchDataContext } from '../../context/FetchDataContext'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import { ProfileContext } from '../../context/ProfileContext'
import EachNotification from './eachnotification/EachNotification'
import { db } from '../../firebase/Firebase'


const Notifications = () => {
    const { 
        openNotificationsDrawer, setOpenNotificationsDrawer, userNotification,
        setUserNotification, profileUpdatesNotifications, userJoinsNotifications } 
    = useContext(FetchDataContext)

    const { userProfile } = useContext(ProfileContext)
   

    //filter function getting notifications of only user's favorites from list of all users.........................................
    const filterFunction = (notification) => {
        if (userProfile.favorites && userProfile.favorites.length > 0) {
            return notification.userName !== userProfile && userProfile.id && userProfile.favorites.includes(notification.userId)
        }
        else {
            return null
        }
    }


    const filteredProfileNotification = profileUpdatesNotifications.filter(filterFunction)
    

    const userNotifications = userJoinsNotifications.concat(filteredProfileNotification) // adding both new users notifications together with filtered profile updates notifications
    

    //sorting notification based on time from newest to oldest
    const sortFunction = (a, b) => {
        const comparisonA = a.time
        const comparisonB = b.time

        let comparisonStatus = 0

        if (comparisonA < comparisonB) {
            comparisonStatus = 1
        }
        else
            if (comparisonA > comparisonB) {
                comparisonStatus = -1
            }
        return comparisonStatus;
    }

    const sortedUserNotifications = userNotifications && userNotifications.sort(sortFunction)


    useEffect(() => {
        //checking if there's notifications available and if the notifications slider has been opened since the latest notification
        sortedUserNotifications !== undefined &&
        sortedUserNotifications[0].seen === false ? setUserNotification(true) : setUserNotification(false)

        const collection = sortedUserNotifications[0].title
        const docId = sortedUserNotifications[0].id

        if (openNotificationsDrawer && userNotification ) {
            //setting the latest notification seen to true if notifications slider was openned
            db.collection('users').doc(userProfile.id).collection(collection).doc(docId)
                .update({
                    seen: true
                })
                .then(res => {
                    //console.log(res)
                })
        }

    }, [sortedUserNotifications, openNotificationsDrawer, setUserNotification, userNotification, userProfile.id])


    return (
        <SwipeableDrawer
            anchor="right"
            open={openNotificationsDrawer}
            onClose={() => setOpenNotificationsDrawer(false)}
            onOpen={() => setOpenNotificationsDrawer(true)}
        >
            {
                userNotifications && sortedUserNotifications.map((notification, i) => {
                    return (
                        <React.Fragment key={i}>
                            <EachNotification notification={notification} />
                        </React.Fragment>
                    )
                })
            }
        </SwipeableDrawer>
    )
}


export default Notifications