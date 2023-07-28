import passport from "passport";
import googleOauth from 'passport-google-oauth2'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
const dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(dirname, '../../config/.env') })
const GoogleStrategy = googleOauth.Strategy;

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})


passport.use(new GoogleStrategy({
    clientID: process.env.googleClientID,
    clientSecret: process.env.googleClientSecret,
    callbackURL: process.env.googleCallbackURL,
    passReqToCallback: true
}, (request, accessToken, refreshToken, profile, done) => {
    done(null, profile)
    
}))