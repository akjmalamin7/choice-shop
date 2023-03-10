const { Schema, model } = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

const userSchema = Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true })

userSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        _id: this.id,
        email: this.email,
        role: this.role,
        name: this.name
    }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })

    return token;
}

const validUser = user => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    })
    return schema.validate(user)
}

module.exports.User = model('User', userSchema)
module.exports.validate = validUser