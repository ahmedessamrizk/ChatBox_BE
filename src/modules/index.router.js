import authRouter from './auth/auth.router.js'
import userRouter from './user/user.router.js'
import conversationRouter from './conversation/conversation.router.js'
import groupRouter from './group/group.router.js'
import messageRouter from './message/message.router.js'
import cors from 'cors'
import express from 'express'
import passport from 'passport'
import { connectDB } from '../../DB/connection.js'
import { globalErrorHandling } from '../middleware/asyncHandler.js'



export const appRouter = (app) => {
    app.use(express.json({}));
    app.use(express.urlencoded({ extended: true }))
    app.use(passport.initialize())
    app.use(cors({}));

    //Base URL
    const baseURL = process.env.BASEURL

    //Api Setup
    app.use(`${baseURL}/auth`, authRouter);
    app.use(`${baseURL}/user`, userRouter);
    app.use(`${baseURL}/conversation`, conversationRouter);
    app.use(`${baseURL}/message`, messageRouter);
    app.use(`${baseURL}/group`, groupRouter);

    //Invalid routing
    app.use('*', (req, res, next) => {

        // app.use(morgan("dev"))

        //res.status(404).json({ message: "Invalid Routing" })
        next(Error("404 Page not found In-valid Routing or method", { cause: 404 }))
    })

    //Error handling  
    app.use(globalErrorHandling);

    //Connection on DB
    connectDB();

    /*  if needed
    import path from 'path'
    import { fileURLToPath } from 'url'
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    dotenv.config({ path: path.join(dirname, '.import { passport } from 'passport';
/config/.env') })
    */
}
