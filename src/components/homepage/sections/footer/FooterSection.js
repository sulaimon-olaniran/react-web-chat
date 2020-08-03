import React from 'react'


const FooterSection = () => {
    return (
        <div className="footer-section-container">
            <h1>Social Handles</h1>
            <div className="footer-social-links">

                <a href="https://wa.me/2348088614722" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-whatsapp" style={{color:"#4AC959"}} ></i>
                </a>

                <i className="fa fa-instagram" style={{color:"#F56040"}} ></i>

                <i className="fa fa-facebook" style={{color:"#4267B2"}}></i>

                <a href="https://twitter.com/Olami_dipupo" target="_blanak" rel="noopener noreferrer" >
                    <i className="fa fa-twitter" style={{color:"#1DA1F2"}} ></i>
                </a>

                <a href="https://www.linkedin.com/in/oladipupo-olaniran-479672187/" target="_blank" rel="noopener noreferrer" >
                    <i className="fa fa-linkedin" style={{color:"#405DE6"}} ></i>
                </a>

                <a href="https://github.com/sulaimon-olaniran" target="_blank" rel="noopener noreferrer" >
                    <i className="fa fa-github"style={{color:"#211F1F"}} ></i>
                </a>
            </div>
            <small>&#169; All rights reserved - <span className="span-text-style">OS-MESSENGER</span></small>
        </div>
    )
}

export default FooterSection