const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { v4: uuidv4 } = require('uuid')
admin.initializeApp(functions.config().firebase)



const handleNewNotification = ((notification, docId, collection) =>{
    return admin.firestore().collection(collection).doc(docId).set(notification)
    .then(doc => {
        return console.log(doc)
    })
})

exports.newUserAdded = functions.firestore.document('users/{userId}').onCreate(doc =>{
   const user = doc.data()
   const docId = uuidv4()
   const notification = {
       content : `${user.name} Joined OS-Messenger`,
       user : `${user.firstName} ${user.lastName}`,
       userId : user.id,
       userName : user.userName,
       time : admin.firestore.FieldValue.serverTimestamp(),
       viewed: false,
       seen : false,
       title : 'newUser_notification',
       id: docId
   }

   return handleNewNotification(notification, docId, 'newUser_notification')
})

exports.profileEdited = functions.firestore.document('users/{userId}').onUpdate(doc =>{
    const user = doc.after.data()
    const before = doc.before.data()
    let content = null
    if(before.userName !== user.userName){
        content = `${before.userName } changed username to ${user.userName}`
    }
    else if(before.firstName !== user.firstName || before.lastName !== user.lastName){
        content = `${user.userName} updated Name`
    }
    else if(before.state !== user.state || before.country !== user.country){
        content = `${user.userName} updated location`
    }
    else if( before.about !== user.about){
        content = `${user.userName} updated bio`
    }
    else if(before.dispayImage !== user.dispayImage){
       content = `${user.userName} updated display image`
    }
    else{
        content = "updated profile"
    }

    const docId = uuidv4()

    const notification = {
        content : content,
        user : `${user.firstName} ${user.lastName}`,
        userId : user.id,
        userName : user.userName,
        time : admin.firestore.FieldValue.serverTimestamp(),
        viewed : false,
        seen : false,
        id : docId,
        title : 'profile_notification'
    }

    //only run this cloud function if these conditions are true, dont want it running everytime a user active status changes

    if( before.userName !== user.userName || before.firstName !== user.firstName || 
        before.lastName !== user.lastName || before.dispayImage !== user.dispayImage
        || before.state !== user.state || before.country !== user.country ||
        before.about !== user.about
        ){
        return handleNewNotification(notification, docId, 'profile_notification')
    }
    else{
        return null
    }
 
    
 })

exports.newMessages = functions.firestore.document('chats/{chatId}').onWrite((change, context) => {
    const message = change.after.data()
   
    const docId = uuidv4()
   
    const notification = {
        content: `New message from ${message.messages[message.messages.length - 1].senderName}`,
        sender: message.messages[message.messages.length - 1].sender,
        chatId: message.chatId,
        time: message.messages[message.messages.length - 1].timeStamp,
        seen: false,
        id : docId,
        userNames : message.userNames,
        usersId : message.interloctors
    }

    if( message.messageRead === false){

    return handleNewNotification(notification, docId, 'message_notifications')
    }

    else{
        return null
    }


})




