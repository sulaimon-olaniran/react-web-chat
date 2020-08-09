import React, { useEffect } from 'react'
import Button from '@material-ui/core/Button'
import welcome_image_one from './assets/welcome_image_one.jpg'
import { NavLink } from 'react-router-dom'
import AboutSection from './sections/about/AboutSection'
import FooterSection from './sections/footer/FooterSection'
import { auth, db } from '../../firebase/Firebase'


const HomePage = () => {
    //setting user active status to offline once they on the homepage(no more on dashboard )
    const setUserActiveFalse = () => {
        db.collection("users").doc(auth.currentUser.uid).update({
            isActive: false,
            lastSeen : Date.now()
        })
            .then(() => {
                //console.log('user-logged-off')
            })
            .catch(error => console.log(error))
    }


    useEffect(() =>{
        auth.currentUser !== null && setUserActiveFalse()
    }, [])


    return (
        <div className="homepage-container">

            <div className="welcome-page">
                <div className="welcome-texts">
                    <h1>Welcome To <span>OS-Messenger</span></h1>
                    <p>Get ready to meet new amazing friends on the web</p>
                    <NavLink exact to="/dashboard">
                        <Button variant="contained" color="primary">Start Chatting</Button>
                    </NavLink>
                </div>

                <div className="welcome-image">
                    <img src={welcome_image_one} alt="Welcome" />
                </div>

            </div>

            <AboutSection />
            <FooterSection />

        </div>
    )
}

export default HomePage