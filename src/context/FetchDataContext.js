import React, { createContext, useState, useEffect, useRef } from 'react'
import { db, auth } from '../firebase/Firebase'
//import { FullScreen, useFullScreenHandle } from "react-full-screen"

export const FetchDataContext = createContext()


const FetchDataContextProvider = ({ children }) => {
    const [appUsers, setAppUsers] = useState([]) //holding all users of the app

    const [messageNotifications, setMessageNotifications] = useState([]) //holds all messages notifications

    const [newNotification, setNewNotification] = useState(false) //handles new message notification true or false(didn't think of this name well)

    const [viewProfile, setViewProfile] = useState(false) //passed arround the app to handle the modal of viewing profile or not
    const [selectedUser, setSelectedUser] = useState({}) //passed arround the app as to know the selecteduser the logged in user wants to interact with
    const [openChat, setOpenChat] = useState(false) //handles opening and closing of chatboard

    const [openNotificationsDrawer, setOpenNotificationsDrawer] = useState(false) //handles opening and closing of notifications drawer
    const [userNotification, setUserNotification] = useState(false) //used to check if user has new notifactions to conditionally render the bell icon in dashboard component

    const [isDarkTheme, setIsDarkTheme] = useState(false) //handles team
    const mountedRef = useRef(true)

    const [profileUpdatesNotifications, setProfileUpdatesNotifications] = useState([]) //stores profile updates notifications
    const [userJoinsNotifications, setUserJoinsNotifications] = useState([]) //stores new user joining notifications

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
            })
            setAppUsers(users)
        })
    }





    const getMessageNotifications = () => {
        db.collection("message_notifications").orderBy('time', 'asc').onSnapshot(docs => {
            if (!mountedRef.current) return null
            const notifications = []
            setNewNotification(true)
            docs.forEach(doc => {
                notifications.push(doc.data())
            })
            setMessageNotifications(notifications)
        })
    }



    //this function is tricky, but i wrote it in order for each user to have their own specific notification and be able to interact with it uniquely
    const getNotifications = (collection, arrayFunction) => {
        //firstly gets current logged in notifications and store the IDs in an array
        db.collection('users').doc(auth.currentUser.uid).collection(collection)
            .onSnapshot(docs => {
                const currentNotifications = []
                docs.forEach(doc => {
                    currentNotifications.push(doc.data().id)
                })
               //then gets universal notification that is accessible by all users of the app
                return db.collection(collection).orderBy('time', 'desc')
                    .onSnapshot(docs => {
                        const availableNotifications = []
                        docs.forEach(doc => {
                            //checks if the universal has a new notificaton that isnt availble in the logged in user notifications data
                            //doing this so firebase doesn't overwrite or update the previous notifications data
                            if (!currentNotifications.includes(doc.data().id)) {
                                availableNotifications.push(doc.data())
                            }
                        })

                        if (availableNotifications.length > 0) {
                            //if there are new notification(s) from the universal notifications, go ahead and add it to the logged in user private notifications data
                            availableNotifications.forEach(notification => {
                                return db.collection('users').doc(auth.currentUser.uid).collection(collection)
                                    .doc(notification.id)
                                    .set(notification, {merge : true})
                                    .then(res => {
                                         //when that is all done, get the newly formed logged in user private notifications and set it in an arrray
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




