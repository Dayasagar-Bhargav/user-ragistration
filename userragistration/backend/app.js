require('dotenv').config();
const express = require('express');
const User = require("./dbconn")
const cors = require('cors');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cokkieParser = require('cookie-parser')


const app = express();
app.use(cors());
app.use(express.json());
app.use(cokkieParser())
const port = process.env.port || 5000;

console.log(process.env.S_KEY)

 

app.post('/ragistration', async (req, res) => {

    const { name, email, password } = req.body;
    // const s_password = await securePassword(password)
    // const s_password = await bcrypt.hash(password, 10)

    const data = await User.findOne({ email })

    if (data) {
        res.send({ message: "user already registered" })
    }
    else {
        const user = new User({
            name,
            email,
            password 
        })
        
        const token = await user.generateAuthToken()
        console.log('the token part' + token)

        res.cookie('jwtoken', token ,{
            expires: new Date(Date.now() + 20000),
            httpOnly: true
        });
      
        await user.save()
        res.send({status:200, message: "ragistration succesfull" })
    }
})

// const securePassword = async (password) => {
//     const hashPassword = await bcrypt.hash(password, 10)
//     console.log(hashPassword)
//     return hashPassword
// }

// --------------------------------------------------------------------login------------------------------------------------------------

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    const data = await User.findOne({ email })
    const token = await data.generateAuthToken()
    res.cookie('jwtoken', token ,{
        expires: new Date(Date.now() + 20000),
        httpOnly: true
    });
    if (data) {
        const checkPassword = await bcrypt.compare(password, data.password)
        if (checkPassword) {
            res.send({ message: 'login succesfull', user: data })
        }
        else {
            res.send({ message: ' password is incorrect' })
        }
    }
    else {
        res.send({ message: 'user is not ragistered' })
    }

})




app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})