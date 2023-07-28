import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
const dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(dirname, '../../config/.env') })

//This function to avoid writing try catch in its end point
export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            return next(new Error(error, { cause: 500 }))
        }

    }
}

export const globalErrorHandling = (err, req, res, next) => {
    if (err) {
        if (process.env.MODE === "DEV") {
            return res.status(err['cause'] || 500).json({ message: err.message, stack: err.stack })

        } else {
            return res.status(err['cause'] || 500).json({ message: err.message })
        }
    }
}