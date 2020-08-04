import React, { createContext, useState, useEffect, useRef } from 'react'
import { db, auth } from '../firebase/Firebase'

export const ProfileContext = createContext()

const ProfileContextProvider = ({ children }) => {
    const [profileFetch, setProfileFetch] = useState(false)
    const [profileLoading, setProfileLoading] = useState(false)
    const [userProfile, setUserProfile] = useState({})

    const [chatsFetch, setChatsFetch] = useState(false)
    const [chatLoading, setChatLoading] = useState(false)
    const [chatMessages, setChatMessages] = useState([])

    const [loggedIn, setLoggedIn] = useState(false)
    const [isAuth, setIsAuth] = useState(false)
    const [authComplete, setAuthComplete] = useState(false)
    const [error, setError] = useState(false)

    const mountedRef = useRef(true)

    const setUserActiveFalse = () => {
        db.collection("users").doc(auth.currentUser.uid).update({
            isActive: false,
            lastSeen : Date.now()
        })
            .then(() => {
                console.log('bye bye ohhh ohh')
            })
            .catch(error => console.log(error))
    }

    window.onbeforeunload = function () {
        setUserActiveFalse()
        console.log(auth.currentUser.uid)
    }

    const authUser = () => {
        return new Promise(function (resolve, reject) {
            auth.onAuthStateChanged(user => {
                if (user) {
                    resolve(user)
                }
                reject("not logged in")
            })
        })
    }



    const getUserProfile = () => {
        setProfileFetch(true)
        setProfileLoading(true)
        const userId = auth.currentUser && auth.currentUser.uid
        userId && db.collection("users").doc(userId).onSnapshot(snapshot => {
            if (!mountedRef.current) return null
            setUserProfile(snapshot.data())
            setProfileFetch(false)
            setTimeout(() => {
                setLoggedIn(true)
                setProfileLoading(false)
            }, 1500);
        })
    }

    const getUserChats = () => {
        setChatsFetch(true)
        setChatLoading(true)
        db.collection("chats")
            .where('interloctors', 'array-contains', auth.currentUser.uid)
            .onSnapshot(docs => {
                //console.log(docs)
                if (!mountedRef.current) return null
                let chats = []
                docs.forEach(doc => {
                    chats.push(doc.data())
                })
                setChatMessages(chats)
                setChatsFetch(false)
                setTimeout(() => {
                    setChatLoading(false)
                }, 1500);
            })
    }


    const setUserActiveTrue = () => {
        db.collection("users").doc(auth.currentUser.uid).update({
            isActive: true,
        })
            .then(() => {
                console.log('active')
            })
            .catch(error => console.log(error))
    }


    useEffect(() => {
        authUser().then((user) => {
            setIsAuth(true)
            setTimeout(() => {
                setAuthComplete(true)
                getUserProfile()
                getUserChats()
            }, 1000)

        }, (error) => {
            setError(true)
            setIsAuth(true)
            console.log(error)
            setTimeout(() => {
                setAuthComplete(true)
            }, 1000);
        });

        return () => {
            mountedRef.current = false
           // console.log('hello world')
        }

    }, [])

    return (
        <ProfileContext.Provider value={{
            userProfile, chatMessages, profileFetch, getUserProfile, chatsFetch,
            authComplete, loggedIn, error, profileLoading, chatLoading, isAuth,
            getUserChats, setUserActiveTrue
        }}>
            {children}
        </ProfileContext.Provider>
    )
}



export default ProfileContextProvider