import React, { createContext, useState, useEffect, useRef } from 'react'
import { db, auth } from '../firebase/Firebase'
//import { FullScreen, useFullScreenHandle } from "react-full-screen"

export const FetchDataContext = createContext()


const FetchDataContextProvider = ({ children }) => {

    const [usersFetch, setUsersFetch] = useState(true)
    const [appUsers, setAppUsers] = useState([])

    const [viewProfile, setViewProfile] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})
    const [openChat, setOpenChat] = useState(false)

    const [isDarkTheme, setIsDarkTheme] = useState(false)
    const mountedRef = useRef(true)

    const handleTheme = () => {
        setIsDarkTheme(!isDarkTheme)
    }

    const themeClass = isDarkTheme ? "dark-theme" : "light-theme"
    const chatThemeClass = isDarkTheme ? "chat-dark-theme" : "chat-light-theme"

    const getAppUsers = () => {
        db.collection("users").onSnapshot(docs => {
            if (!mountedRef.current) return null
            let users = []
            docs.forEach(doc => {
                users.push(doc.data())
                setUsersFetch(false)
            })
            setAppUsers(users)
            //console.log(users)
        })
    }


    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                getAppUsers()
            }
        })

        return () => {
            mountedRef.current = false
        }
    }, [])

    return (
        <FetchDataContext.Provider value={{
            viewProfile, setViewProfile, selectedUser, handleTheme, isDarkTheme,
            setSelectedUser, openChat, setOpenChat, appUsers, themeClass, chatThemeClass

        }}>
            {children}
        </FetchDataContext.Provider>
    )

}


export default FetchDataContextProvider








































    // const getChatMessages = () => {
    //     const userId = auth.currentUser && auth.currentUser.uid
    //     db.collection("chats")
    //         .where('interloctors', 'array-contains', 'Abioye')
    //         .onSnapshot(docs => {
    //             //console.log(docs)
    //             if (!mountedRef.current) return null
    //             let chats = []
    //             docs.forEach(doc => {
    //                 chats.push(doc.data())
    //             })
    //             setChatMessages(chats)
    //             setMessageFetch(false)
    //             console.log(chats)

    //             return mountedRef.current && db.collection("users").doc(userId).set({
    //                 isActive : true
    //             }, { merge : true} )
    //         })

    // }