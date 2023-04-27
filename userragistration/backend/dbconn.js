require ('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


mongoose.connect(process.env.DB)
    .then(() => console.log('connected to mongodb'))
    .catch((err) => console.log(err))

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id)
        const token = jwt.sign({ _id: this._id.toString() }, process.env.S_KEY)
        console.log(token)
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token;
    }
    catch (err) {
        console.log(err)
    }
}

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        // console.log(`uncsafe password is ${this.password}`)
        this.password = await bcrypt.hash(this.password, 10)
        // console.log(`safe password is ${this.password}`)
    }
    next()
})



const User = mongoose.model('User', userSchema)

module.exports = User





