import React, { useContext, useEffect } from 'react'
import { FetchDataContext } from '../../context/FetchDataContext'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import { ProfileContext } from '../../context/ProfileContext'
import EachNotification from './eachnotification/EachNotification'
import { db } from '../../firebase/Firebase'


const Notifications = () => {
    const { openNotificationsDrawer, setOpenNotificationsDrawer, userNotification,
        setUserNotification, profileUpdatesNotifications, userJoinsNotifications } = useContext(FetchDataContext)

    const { userProfile } = useContext(ProfileContext)

    const filterFunction = (notification) => {
        if (userProfile.favorites && userProfile.favorites.length > 0) {
            return notification.userName !== userProfile && userProfile.id && userProfile.favorites.includes(notification.userId)
        }
        else {
            return null
        }
    }

    // console.log(userProfile)

    const filteredProfileNotification = profileUpdatesNotifications.filter(filterFunction)
    //console.log(filteredProfileNotification)

    const userNotifications = userJoinsNotifications.concat(filteredProfileNotification)

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

    //console.log(userNotifications.length)

    useEffect(() => {
        sortedUserNotifications !== undefined &&
        sortedUserNotifications[0].seen === false ? setUserNotification(true) : setUserNotification(false)

        const collection = sortedUserNotifications[0].title
        const docId = sortedUserNotifications[0].id

        if (openNotificationsDrawer && userNotification ) {
            db.collection('users').doc(userProfile.id).collection(collection).doc(docId)
                .update({
                    seen: true
                })
                .then(res => {
                    console.log('updated before clicked on')
                })
        }

    }, [sortedUserNotifications])


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