import React, { useState } from 'react'
import { storage, db, auth } from '../../../../firebase/Firebase'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import { green } from '@material-ui/core/colors'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import CheckIcon from '@material-ui/icons/Check'
import SaveIcon from '@material-ui/icons/Save'
import Avatar from '@material-ui/core/Avatar'
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}))

//COMPONENT FOR UPLOADING PROFILE IMAGE TO FIREBASE,,, JUST SOME FIREBASE FUNCTIONS AND MATERIAL UI UPLOAD SUCCESS COMPONENT...................

const DisplayImageUpload = ({ photo }) => {
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState('')
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);


    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    })


    const handleChange = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
            setPreview(URL.createObjectURL(e.target.files[0]))
        }
    }

    const userId = auth.currentUser && auth.currentUser.uid

    const handleSubmit = () => {
       // console.log("Uploaded")
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        setLoading(true)
        setSuccess(false)
        uploadTask.on('state_changed',

            (snapshot) => {

            },
            (error) => {
                console.log(error)
            },

            () => {
                storage.ref('images').child(image.name).getDownloadURL()
                    .then(url => {
                        return db.collection("users").doc(userId && userId).update({
                            displayImage: url
                        })
                    }).then(() => {
                        //console.log("Upload sucessful")
                        setSuccess(true)
                        setLoading(false)

                    })
                    .catch((error) =>{
                        console.log(error)
                    })
            }
        )
    }


    return (
        <div className="upload-image-container">

            <div className="upload-image-div">
                <label className="file" >
                    <input type="file" onChange={handleChange} accept="image/png, .jpeg, .jpg, image/gif" />
                    <p>CHOOSE IMAGE <InsertPhotoIcon /></p>
                </label>

            </div>

            <div className="image-display-con">

                <div className="uploaded-image">
                    <Avatar src={preview} alt="Preview" />
                </div>

            </div>

            <div className={classes.root}>
                <div className={classes.wrapper}>
                    <Fab
                        aria-label="save"
                        color="primary"
                        className={buttonClassname}
                        disabled={image === null || loading}
                        onClick={handleSubmit}
                    >
                        {success ? <CheckIcon /> : <SaveIcon />}
                    </Fab>
                    {loading && <CircularProgress size={68} className={classes.fabProgress} />}
                </div>
                <div className={classes.wrapper}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={buttonClassname}
                        disabled={image === null || loading}
                        onClick={handleSubmit}
                    >
                        Upload Image
                     </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
            </div>


        </div>
    )
}

export default DisplayImageUpload