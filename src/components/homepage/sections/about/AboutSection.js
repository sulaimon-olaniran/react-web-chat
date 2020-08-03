import React from 'react'
import { NavLink } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import signup_image from './assets/signup_image.png'


const AboutSection = () => {
    return (
        <div className="about-section-container">
            <div className="about-section-description">
                <div className="description-text-container">
                    <h1>Join <span>OS-MESSANGER</span> Today</h1>
                    <p>
                        <NavLink exact to="/dashboard"> <Button color="primary">Sign Up</Button></NavLink>Today
                        and gain access to multiple users on the web, make new friends from all around the world
                        and have a great experience of the chatting world.
                    </p>
                </div>

                <div className="description-image-container">
                    <div className="each-image-container">
                        <img src={signup_image} alt="IMG_FILE" />
                    </div>
                    <div className="each-image-container">
                        <img src={signup_image} alt="IMG_FILE" />
                    </div>
                </div>

            </div>

            <div className="about-section-description">
                <div className="description-text-container">
                    <h1>Witness great chat experiences with amazing people</h1>
                    <p>
                        View different users, select your favorites, chat with
                        multiple people, get your first date, your fiance, new boss,
                        new best friend, have fun!
                    </p>
                </div>

                <div className="description-image-container">
                    <div className="each-image-container">
                        <img src={signup_image} alt="IMG_FILE" />
                    </div>
                    <div className="each-image-container">
                        <img src={signup_image} alt="IMG_FILE" />
                    </div>
                </div>
                <div className="button-link-container">
                <NavLink exact to="/dashboard" >
                        <Button variant="contained" color="primary">Start Chatting</Button>
                </NavLink>
                </div>

            </div>

        </div>
    )
}


export default AboutSection