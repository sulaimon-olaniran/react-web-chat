import React from 'react'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Slide from '@material-ui/core/Slide'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));


const ViewImageComponent = ({ openModal, imageFile, closeModal }) => {
    const classes = useStyles()
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModal}
            onClose={closeModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Slide direction="up" in={openModal} mountOnEnter unmountOnExit>
                <div className="chat-image-view-container">
                    <div className="view-image-modal">
                        <img src={imageFile} alt="Viewed Img File" />
                    </div>
                    <Button
                        onClick={closeModal}
                        color="secondary"
                        variant="contained"
                    >
                        Close
                </Button>
                </div>

            </Slide>

        </Modal>
    )
}


export default ViewImageComponent