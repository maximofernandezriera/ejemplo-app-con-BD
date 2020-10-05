import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

  // Initialize Firebase with maxfernandez@gmail.com account
  var config = {
	apiKey: "AIzaSyAU4YfSndA0m3iiQRLclXlFBI3A7pR7WRY",
    authDomain: "calories-8374d.firebaseapp.com",
    databaseURL: "https://calories-8374d.firebaseio.com",
    projectId: "calories-8374d",
    storageBucket: "calories-8374d.appspot.com",
    messagingSenderId: "1096933033674",
    appId: "1:1096933033674:web:f983aec561711a4e"
  };
  firebase.initializeApp(config);

  export const provider = new firebase.auth.GoogleAuthProvider();
  export const auth = firebase.auth()
  export default firebase;