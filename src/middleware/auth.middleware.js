import { initializeApp } from "firebase/app";
import admin from "firebase-admin"

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

admin.initializeApp({
  credential: admin.credential.applicationDefault(), // or use a service account
});

const app = initializeApp(firebaseConfig)

const verifyIdToken = async(req,res)=>{
    const token = req.cookies?.idToken
    
    if(!token){
      return res.status(401).send('Unauthorised access')
    }
    const decodedToken = await admin.auth().verifyIdToken(token)

    if(!decodedToken){
      return res.status(500).json({message: "Failed to decode the token"})
    }
    console.log(decodedToken)
   next()
}

export {app, verifyIdToken}
