import React from 'react'
import Button from '@material-ui/core/Button'
import welcome_image_one from './assets/welcome_image_one.jpg'
import { NavLink } from 'react-router-dom'
import AboutSection from './sections/about/AboutSection'


const HomePage = () => {
    return (
        <div className="homepage-container">

            <div className="welcome-page">
                <div className="welcome-texts">
                    <h1>Welcome To OS-Chats</h1>
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

        </div>
    )
}

export default HomePage