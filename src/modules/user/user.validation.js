import joi from 'joi'

export const updateProfile = {
    body: joi.object().required().keys({
        firstName: joi.string().min(2).max(10),
        lastName: joi.string().min(2).max(10),
        phone: joi.string(),
        gender: joi.string(),
        DOB: joi.date(),
    })
}

export const deleteUser = {
    params: joi.object().required().keys({
        userId: joi.string().min(24).max(24).required(),
    })
}

export const unDeleteUser = {
    params: joi.object().required().keys({
        userId: joi.string().min(24).max(24).required(),
    })
}

export const blockUser = {
    params: joi.object().required().keys({
        userId: joi.string().min(24).max(24).required(),
    })
}

export const unBlockUser = {
    params: joi.object().required().keys({
        userId: joi.string().min(24).max(24).required(),
    })
}

export const addRole = {
    params: joi.object().required().keys({
        userId: joi.string().min(24).max(24).required(),
    }),
    body: joi.object().required().keys({
        role: joi.string().required()
    })
}

export const addFollowing = {
    params: joi.object().required().keys({
        userId: joi.string().min(24).max(24).required(),
    })
}

export const removeFollowing = {
    params: joi.object().required().keys({
        userId: joi.string().min(24).max(24).required(),
    })
}

export const getProfile = {
    params: joi.object().required().keys({
        id: joi.string().min(24).max(24),
    })
}

export const addToWishList = {
    params: joi.object().required().keys({
        gameId: joi.string().min(24).max(24),
    })
}

export const updatePassword = {
    body: joi.object().required().keys({
        oldPassword: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)).required().messages({
            'string.pattern.base': 'Minimum eight, at least one uppercase letter, one lowercase letter, one number and one special character'
        }),
        newPassword: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)).required().messages({
            'string.pattern.base': 'Minimum eight, at least one uppercase letter, one lowercase letter, one number and one special character'
        })
    })
}

export const getUsers = {
    query: joi.object().required().keys({
        userNameQ: joi.string()
    })
}