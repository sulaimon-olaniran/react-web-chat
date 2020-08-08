import React, { useState } from 'react'
import emoji from 'emoji.json'
import Slide from '@material-ui/core/Slide'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));


const ChatEmojis = ({ setMessage }) => {
    const classes = useStyles()
    const [emojiGroup, setSelectedEmojiGroup] = useState([])
    const [openEmoji, setOpenEmoji] = useState(false)


    const handleOpenEmoji = () => {
        setOpenEmoji(true)
    }
    

    //I plan on creating an array with these and just mapping in the future......................
    //Filtering smileys based on categories....................................
    const smileys_emotion = emoji.filter(emoji => emoji.group.includes('Smileys & Emotion'))

    const people_body = emoji.filter(emoji => emoji.group.includes('People & Body'))

    const animals_nature = emoji.filter(emoji => emoji.group.includes('Animals & Nature'))

    const food_drink = emoji.filter(emoji => emoji.group.includes('Food & Drink'))

    const travel_places = emoji.filter(emoji => emoji.group.includes('Travel & Places'))

    const objects = emoji.filter(emoji => emoji.group.includes('Objects'))

    const symbols = emoji.filter(emoji => emoji.group.includes('Symbols'))

    const flags = emoji.filter(emoji => emoji.group.includes('Flags'))

    let selectedEmojiGroup = null

    //displaying current emoji group based on selected emoji
    switch (emojiGroup) {
        case 'Smileys & Emotion':
            selectedEmojiGroup = smileys_emotion;
            break;
        case 'People & Body':
            selectedEmojiGroup = people_body;
            break;
        case 'Animals & Nature':
            selectedEmojiGroup = animals_nature;
            break;
        case 'Travel & Places':
            selectedEmojiGroup = travel_places;
            break;
        case 'Food & Drink':
            selectedEmojiGroup = food_drink;
            break;
        case 'Objects':
            selectedEmojiGroup = objects;
            break;
        case 'Flags':
            selectedEmojiGroup = flags;
            break;
        case 'Symbols':
            selectedEmojiGroup = symbols;
            break;
        default:
            selectedEmojiGroup = smileys_emotion;

    }

    const emojiHeaders = [smileys_emotion, people_body, animals_nature, food_drink, travel_places, objects, flags, symbols] //each emoji shown as header on top of emojis group

    const handleCloseEmoji = () => {
        setOpenEmoji(false)
    }

    return (
        <React.Fragment>
            <span role="img" aria-label="tongouee"
                className="wave-icon"
                onClick={handleOpenEmoji}
            >
                😊
            </span>
            {/* modal that holds emoji options.................................. */}
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openEmoji}
            onClose={handleCloseEmoji}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Slide direction="up" in={openEmoji} mountOnEnter unmountOnExit>
                <div className="emojis-container">
                    <div className="emojis-headers">
                        {
                            emojiHeaders.map((header, i) => {
                                return (
                                    <span onClick={() => setSelectedEmojiGroup(header[0].group)} key={i}>
                                        {header[0].char}
                                    </span>
                                )
                            })
                        }
                    </div>
                    <div className="selected-emojis">
                        {
                            selectedEmojiGroup.map(emoji => {
                                return (
                                    <span key={emoji.codes} onClick={() => setMessage(prev => prev.concat(emoji.char))}>
                                        {emoji.char}
                                    </span>
                                )
                            })
                        }
                    </div>

                </div>
            </Slide>
        </Modal>
        </React.Fragment>
    )
}

export default ChatEmojis
