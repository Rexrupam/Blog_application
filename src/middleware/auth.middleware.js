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

const decoded = Buffer.from(process.env.serviceAccount, "base64").toString("utf-8");
const serviceAccount = JSON.parse(decoded)

 admin.initializeApp({

   credential: admin.credential.cert(serviceAccount)

 });


const app = initializeApp(firebaseConfig)

const verifyIdToken = async(req,res,next)=>{
     const token = req.cookies?.idToken
     if(!token){
      return res.status(401).send('Unauthorised access')
     }
       const decodedToken = await admin.auth().verifyIdToken(token)
  
       if(!decodedToken){
        return res.status(500).json({message: "Failed to decode the token"})
       }
      req.email = decodedToken.email
      next()
}

export {app, verifyIdToken}
