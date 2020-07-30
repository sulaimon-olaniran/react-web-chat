import React, { createContext, useState, useEffect, useRef } from 'react'
import { db, auth } from '../firebase/Firebase'

export const FetchDataContext = createContext()


const FetchDataContextProvider = ({ children }) => {
    // const [checkingAuth, setCheckAuth] = useState(true)
    // const [isLoggedIn, setIsLoggedIn] = useState(false)

    // const [profileFetch, setProfileFetch] = useState(true)
    // const [userProfile, setUserProfile] = useState()

    // const [usersFetch, setUsersFetch] = useState(true)
     const [appUsers, setAppUsers] = useState([])

    // const [messageFetch, setMessageFetch] = useState(true)
    // const [chatMessages, setChatMessages] = useState([])

    const [showComponent, setShowComponent] = useState(false)

    const [viewProfile, setViewProfile] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})
    const [openChat, setOpenChat] = useState(false)


    const mountedRef = useRef(true)

    //function to check if user in logged in

    const isUserLoggedIn = () => {
        return new Promise(function (resolve, reject) {
            auth.onAuthStateChanged(user => {
                if (user) {
                    resolve(user)
                }
                reject("not logged in")
            })
        })
    }
    

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


    const FetchDataFromFirebase = () => {
        isUserLoggedIn().then((user) => {
            setIsLoggedIn(true)
            setCheckAuth(false)
            //getUserProfile()
            //getChatMessages()
        },

            (error) => {
                setCheckAuth(false)
                setIsLoggedIn(false)
                setShowComponent(true)
            }
        )

    }

    window.onbeforeunload = function(){
        db.collection("users").doc(auth.currentUser.uid).set({
            isActive : false
        }, { merge : true} )
    }


    useEffect(() => {      
        getAppUsers()
        auth.onAuthStateChanged(user => {
            if (!mountedRef.current) return null
            if (user) {
                getUserProfile()
            } else {
                setFetching(false)     
            }
        })



        FetchDataFromFirebase()
        return () => {
            mountedRef.current = false
            
        }
    }, [])

    return (
        <FetchDataContext.Provider value={{
            appUsers, userProfile, checkingAuth, showComponent,
            chatMessages, viewProfile, setViewProfile, selectedUser,
            setSelectedUser, openChat, setOpenChat, isLoggedIn

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