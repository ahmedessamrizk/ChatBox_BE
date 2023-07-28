import joi from 'joi'

export const signUp = {
    body: joi.object().required().keys({
        firstName: joi.string().min(2).max(10).required(),
        lastName: joi.string().min(2).max(10).required(),
        userName: joi.string().min(3).max(20),
        phone: joi.string(),
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)).required().messages({
            'string.pattern.base': 'Minimum eight, at least one uppercase letter, one lowercase letter, one number and one special character'
        }),
        DOB: joi.date().required(),
    })
}

export const signIn = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)).required().messages({
            'string.pattern.base': 'Minimum eight, at least one uppercase letter, one lowercase letter, one number and one special character'
        }),
    })
}

export const confirmEmail = {
    params: joi.object().required().keys({
        token: joi.string().required(),
    })
}

export const sendCode = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
    })
}

export const recoverPassword = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
        code: joi.string().required(),
        newPassword: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)).required().messages({
            'string.pattern.base': 'Minimum eight, at least one uppercase letter, one lowercase letter, one number and one special character'
        }),

    })
}