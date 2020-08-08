import React, { useState } from 'react'
import { storage } from '../../../../firebase/Firebase'
//import ImageIcon from '@material-ui/icons/Image'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import Backdrop from '@material-ui/core/Backdrop'
import Slide from '@material-ui/core/Slide'
import Button from '@material-ui/core/Button'
//import LinearProgress from '@material-ui/core/LinearProgress'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}



const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    large: {
        width: theme.spacing(20),
        height: theme.spacing(20),
    },
}))


const SendImage = ({ submitMessage }) => {
    const classes = useStyles()
    const [selectedImage, setSelectedImage] = useState(null) //holds the chosen image file from folder
    const [imagePreview, setImagePreview] = useState(null) //holds local created url so user can preview image before uploading
    const [openPreview, setOpenPreview] = useState(false) 
    const [uploadProgress, setUploadProgress] = useState(0) //progress upload of image
    const [imageSent, setImageSent] = useState(false)  //alert to display if image was successfully sent


    const handleOnChange = (e) => {
        if (e.target.files[0]) {
            setSelectedImage(e.target.files[0])
            setImagePreview(URL.createObjectURL(e.target.files[0])) //creats a local url for image previewing
        }
        setOpenPreview(true)
    }

    const handleClosePreview = () => {
        setOpenPreview(false)
        imagePreview !== null && URL.revokeObjectURL(imagePreview)
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setImageSent(false)
      }

    const uploadImageToStorage = () => {
        const uploadTask = storage.ref(`chatImages/${selectedImage.name}`).put(selectedImage)

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setUploadProgress(progress)
            },

            error => {
                console.log(error)
            },

            () => {
                storage.ref('chatImages').child(selectedImage.name).getDownloadURL()
                    .then(url => {
                        console.log(url)
                        submitMessage(url, 'image') //sends image to database with imageurl and type of message as Image
                        setImageSent(true)
                        setTimeout(() => {
                            handleClosePreview()   //close image preview after image sent
                        }, 500);
                    })
            }
        )
    }

    return (
        <div>
            <label className="image-send">
                <input type="file" onChange={handleOnChange} accept='image/png, .jpg, .jpeg, image/gif' />
                {/* <ImageIcon /> */}
                <span role="img" aria-label="tongouee" className="wave-icon" >📁</span>
            </label>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openPreview}
                onClose={handleClosePreview}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Slide direction="left" in={openPreview} mountOnEnter unmountOnExit>
                    <div className="preview-image-container">
                        <div className="previewed-image">
                            <img src={imagePreview} alt="Preview_IMG" />
                        </div>
                        <div className="buttons-container">
                            <Button onClick={uploadImageToStorage} color="primary" variant="contained">Send Image</Button>
                            <Button onClick={handleClosePreview} color="secondary" variant="contained">Cancel</Button>
                        </div>
                        {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
                    </div>
                </Slide>

            </Modal>

            <Snackbar open={imageSent} autoHideDuration={1000} onClose={handleCloseAlert}
                anchorOrigin={{
                    vertical: 'top',
                   horizontal: 'center'
                }}
            >
                <Alert onClose={handleCloseAlert} severity="success">
                    Image Sent!
                 </Alert>
            </Snackbar>
        </div>
    )
}

export default SendImage