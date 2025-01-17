const User = require('../models/User');
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const { name, email, password } = req.body

    try {
        let user = await User.findOne({ email})

        if(user) {
            return res.status(400).json({ message: 'User alread exists'})
        }

        user = new User({name, email, password})

        await user.save()

        const payload = { user: {id: user.id }}

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'}, (err, token) => {
            if(err) throw err
            console.log(`User created: ${user.email}`)
            res.status(200).json({ token })
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
}

exports.login = async (req, res) => {
    const {email, password} = req.body

    try {
        let user = await User.findOne({email})

        if(!user) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        const isMatch = await user.matchPassword(password)

        if(!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const payload = { user: {id: user.id}}

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'}, (err, token) => {
            if (err) throw err
            console.log(`User logged in: ${user.email}`);
            res.status(200).json({token})
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
}