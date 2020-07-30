import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/analytics'


const firebaseConfig = {
    apiKey: "AIzaSyBnif9OAVfx1XIZTYCJlMkyvxlHVZ21E2c",
    authDomain: "os-web-chat.firebaseapp.com",
    databaseURL: "https://os-web-chat.firebaseio.com",
    projectId: "os-web-chat",
    storageBucket: "os-web-chat.appspot.com",
    messagingSenderId: "967383852685",
    appId: "1:967383852685:web:29e18ad0ef780d455f64c4",
    measurementId: "G-LYJ2CNXLNF"
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()

export const db = firebase.firestore()
export const auth = firebase.auth()
export const storage = firebase.storage()
export const analytics = firebase.analytics()
export default firebase
