import { roles } from "../../../DB/models/user.model.js";


export const userRoles = {
    update: [roles.admin, roles.superAdmin, roles.user],
    getProfile: [roles.admin, roles.superAdmin, roles.user],
    signout: [roles.admin, roles.superAdmin, roles.user],
    getUsers: [roles.admin, roles.superAdmin, roles.user],
    removeUser: [roles.admin, roles.superAdmin, roles.user],
    add: [roles.admin, roles.superAdmin, roles.user],
    deleteOrBlockUser: [roles.superAdmin]
}