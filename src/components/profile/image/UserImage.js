import React, { useState, useContext } from 'react'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import { makeStyles } from '@material-ui/core/styles'
import Zoom from '@material-ui/core/Zoom'
import Avatar from '@material-ui/core/Avatar'
import DisplayImageUpload from './imageupload/ImageUpload'
import { ProfileContext } from '../../../context/ProfileContext'
import ViewImageComponent from '../../ViewImage'


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}));

const DisplayImage = () => {
    const classes = useStyles()
    const [imageModal, setImageModal] = useState(false)
    const { userProfile } = useContext(ProfileContext)

    const openImageModal = () => {
        setImageModal(true)
    }
    const closeImageModal = () => {
        setImageModal(false)
    }

    const [viewProfileImage, setViewProfileImage] = useState(false)

    const openProfileImage = () => setViewProfileImage(true)
    const closeProfileImage = () => setViewProfileImage(false)


    return (
        <div className="profile-picture-container" >
            <div className="profile-image-container" >
                <Avatar src={userProfile.displayImage} alt="Display_IMG"
                   onClick ={ userProfile.displayImage !== "" ? openProfileImage : null}
                />
            </div>

            <Button color="secondary" variant="contained" onClick={openImageModal}  >Change Image</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={imageModal}
                onClose={closeImageModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Zoom in={imageModal} style={{ transitionDelay: imageModal ? '1500ms' : '0ms' }} >
                    <React.Fragment>
                        <DisplayImageUpload />
                    </React.Fragment>
                </Zoom>
            </Modal>

            <ViewImageComponent 
              openModal={viewProfileImage}
              closeModal={closeProfileImage}
              imageFile={userProfile.displayImage}
            />
        </div>
    )
}

export default DisplayImage