import React, { createContext, useState, useEffect, useRef } from 'react'
import { db, auth } from '../firebase/Firebase'
//import { FullScreen, useFullScreenHandle } from "react-full-screen"

export const FetchDataContext = createContext()


const FetchDataContextProvider = ({ children }) => {

    const [usersFetch, setUsersFetch] = useState(true)
    const [appUsers, setAppUsers] = useState([])

    const [messageNotifications, setMessageNotifications] = useState([])

    const [newNotification, setNewNotification] = useState(false)

    const [viewProfile, setViewProfile] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})
    const [openChat, setOpenChat] = useState(false)

    const [openNotificationsDrawer, setOpenNotificationsDrawer] = useState(false)
    const [userNotification, setUserNotification] = useState(false)

    const [isDarkTheme, setIsDarkTheme] = useState(false)
    const mountedRef = useRef(true)

    const [profileUpdatesNotifications, setProfileUpdatesNotifications] = useState([])
    const [userJoinsNotifications, setUserJoinsNotifications] = useState([])

    const handleTheme = () => {
        setIsDarkTheme(!isDarkTheme)
    }

    const themeClass = isDarkTheme ? "dark-theme" : "light-theme"
    const chatThemeClass = isDarkTheme ? "chat-dark-theme" : "chat-light-theme"



    const getAppUsers = () => {
        db.collection("users").onSnapshot(docs => {
            if (!mountedRef.current) return null
            const users = []
            docs.forEach(doc => {
                users.push(doc.data())
                setUsersFetch(false)
            })
            setAppUsers(users)
            //console.log(users)
        })
    }





    const getMessageNotifications = () => {
        db.collection("message_notifications").orderBy('time', 'asc').onSnapshot(docs => {
            if (!mountedRef.current) return null
            const notifications = []
            setNewNotification(true)
            docs.forEach(doc => {
                notifications.push(doc.data())
                setUsersFetch(false)
            })
            setMessageNotifications(notifications)
            //console.log(users)
        })
    }




    const getNotifications = (collection, arrayFunction) => {
        db.collection('users').doc(auth.currentUser.uid).collection(collection)
            .onSnapshot(docs => {
                const currentNotifications = []
                docs.forEach(doc => {
                    currentNotifications.push(doc.data().id)
                })

                return db.collection(collection).orderBy('time', 'desc')
                    .onSnapshot(docs => {
                        const availableNotifications = []
                        docs.forEach(doc => {
                            if (!currentNotifications.includes(doc.data().id)) {
                                availableNotifications.push(doc.data())
                            }
                        })

                        if (availableNotifications.length > 0) {
                            availableNotifications.forEach(notification => {
                                return db.collection('users').doc(auth.currentUser.uid).collection(collection)
                                    .doc(notification.id)
                                    .set(notification, {merge : true})
                                    .then(res => {
                                         //console.log('added the final notifications')
                                        return db.collection('users').doc(auth.currentUser.uid).collection(collection)
                                            .onSnapshot(docs => {
                                                const notifications = []
                                                docs.forEach(doc => {
                                                    notifications.push(doc.data())
                                                })

                                                arrayFunction(notifications)
                                            })
                                    })

                            })
                        }
                        else{
                            return db.collection('users').doc(auth.currentUser.uid).collection(collection)
                            .onSnapshot(docs => {
                                const notifications = []
                                docs.forEach(doc => {
                                    notifications.push(doc.data())
                                })
                                arrayFunction(notifications)
                            })
                        }
                    })


            })
    }




    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                getAppUsers()
                getMessageNotifications()
                //getNewUserJoinedNotifications()
                //getProfileUpdatesNotifications()
                getNotifications('profile_notification', setProfileUpdatesNotifications)
                getNotifications('newUser_notification', setUserJoinsNotifications)
            }
        })

        return () => {
            mountedRef.current = false
        }
    }, [])







    return (
        <FetchDataContext.Provider value={{
            viewProfile, setViewProfile, selectedUser, handleTheme, isDarkTheme,
            setSelectedUser, openChat, setOpenChat, appUsers, themeClass, chatThemeClass,
            messageNotifications, newNotification, setNewNotification, openNotificationsDrawer,
            setOpenNotificationsDrawer, userNotification, setUserNotification, profileUpdatesNotifications,
            userJoinsNotifications

        }}>
            {children}
        </FetchDataContext.Provider>
    )

}


export default FetchDataContextProvider





























    // const getProfileUpdatesNotifications = () => {
    //     db.collection("profile_notification").orderBy('time', 'desc').onSnapshot(docs => {
    //         if (!mountedRef.current) return null
    //         docs.forEach(doc => {
    //             const data = doc.data()

    //             return db.collection('users').doc(auth.currentUser.uid).collection("profile_notification")
    //                 .doc(doc.data().id)
    //                 .set(data, { merge: true })
    //                 .then(res => {

    //                     return db.collection('users').doc(auth.currentUser.uid).collection('profile_notification')
    //                         .onSnapshot(docs => {
    //                             const notifications = []
    //                             docs.forEach(doc => {
    //                                 notifications.push(doc.data())
    //                                 console.log(doc.data().id)
    //                             })
    //                             //console.log(notifications)
    //                             setProfileUpdatesNotifications(notifications)
    //                         })
    //                 })
    //         })

    //     })
    // }



    
    // const getNewUserJoinedNotifications = () => {
    //     db.collection("newUser_notification").orderBy('time', 'desc').onSnapshot(docs => {
    //         if (!mountedRef.current) return null

    //         docs.forEach(doc => {
    //             const data = doc.data()
    //             return db.collection('users').doc(auth.currentUser.uid).collection("newUser_notification")
    //                 .doc(doc.data().id)
    //                 .set(data, { merge: true })
    //                 .then(res => {
    //                     return db.collection('users').doc(auth.currentUser.uid).collection('newUser_notification')
    //                         .onSnapshot(docs => {
    //                             const notifications = []
    //                             docs.forEach(doc => {
    //                                 notifications.push(doc.data())
    //                             })
    //                             //console.log(notifications)
    //                             setUserJoinsNotifications(notifications)
    //                         })
    //                 })
    //         })
    //     })
    // }




