
export const checkUser = (user, checkFor = ['']) => {
    try {
        let err = false, cause = 400
        if(!user)
        {
            err = "not registered user", cause = 404;
            return { err, cause }
        }
        for (let i = 0; i < checkFor.length; i++) {
            if (checkFor[i] === "confirmEmail") {
                if (!user.confirmEmail) {
                    err = "Please confirm your email"
                    cause = 400
                    break;
                }
            } else {
                if (user[checkFor[i]]) {
                    err = `This User ${checkFor[i]} `
                    cause = 400
                    break;
                }
            }
        }

        return { err, cause }
    } catch (error) {
        console.log(error);
        return { err: "err while checking user", cause: 400 }
    }

}


