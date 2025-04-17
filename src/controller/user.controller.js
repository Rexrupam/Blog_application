import { app } from "../middleware/auth.middleware.js"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, sendEmailVerification, deleteUser } from "firebase/auth"
import User from "../models/user.model.js"

const auth = getAuth(app)

export const signup = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send("Email and password are required")
    }
    let user = await User.findOne({email})
    if(user){
        return res.status(409).json({message: "User already registered"})
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(userCredential.user)
        user = auth.currentUser
        const maxWaitTime = 30000; // 20 seconds max
        const checkInterval = 2000; // check every 2 seconds
        let waited = 0;
        const interval = setInterval(async () => {
            await user.reload();
            if (user.emailVerified) {
                clearInterval(interval);
                const databaseUser = await User.create({
                    email
                })
                if (!databaseUser) {
                    return res.status(500).json({ message: "Failed to save the user in database" })
                }
                await databaseUser.save({ validateBeforeSave: false })
                return res.status(200).json({ message: "User registered successfully", userCredential });
            }
            waited += checkInterval;
            if (waited >= maxWaitTime) {
                clearInterval(interval);
                await deleteUser(user);
                return res.status(400).json({ message: "Please verify your email within 30 seconds" });
            }
        }, checkInterval);

    } catch (error) {
        console.log("hello from catch")
        return res.status(500).send("Registration failed", error)
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send("Email and password are required")
    }
    const response = await signInWithEmailAndPassword(auth, email, password)
    const refreshToken = response.user.stsTokenManager.refreshToken
    const idToken = response._tokenResponse.idToken

    const user = await User.findOneAndUpdate({
         email: req.body?.email
    },{
      $set: {refreshToken: refreshToken}
    },
    {
        new: true
    }
     )
    if (!user) {
        return res.status(500).json({ message: "User is not registered with this email" })
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("idToken", idToken, options)
        .json({ response })
}

export const logout = async (req, res) => {
     const email = req.email
     if(!email){
        return res.status(401).send('Unauthorised access')
     }
     const logoutUser = await User.findOneAndUpdate(
        {email: req.email || email },
        {$unset:{refreshToken: 1}},
        {new: true}
     )
     if(!logoutUser){
        return res.status(500).json({message: "User logout faled"})
     }
     return res.status(200).json({message: "User logged out successfully", logoutUser})
}

export const healthCheck = async (req, res) => {
    return res.send({ message: "Ok" })
}