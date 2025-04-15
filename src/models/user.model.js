import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String
    }
},{
    timestamps: true
}
)

const User = mongoose.model('User', userSchema)
export default User;