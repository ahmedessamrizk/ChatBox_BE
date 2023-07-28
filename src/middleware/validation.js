const dataMethods = ['body', 'params', 'query', 'headers'];
import { asyncHandler } from './asyncHandler.js';

export const validation = (schema) => {
    return asyncHandler((req, res, next) => {
        // try {
        const errList = [];
        dataMethods.forEach(method => {
            if (schema[method]) {
                const validationResult = schema[method].validate(req[method], { abortEarly: false });
                if (validationResult?.error) {
                    errList.push(validationResult.error.details);
                }
            }
        });
        if (errList.length) {
            return res.status(400).json({ message: "Validation error", errList })
        } else {
            return next()
        }
        // } catch (error) {
        //     next(new Error('Validation error', {cause: 500}))
        // }
    })
}