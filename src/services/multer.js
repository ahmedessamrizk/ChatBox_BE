import multer from 'multer'

export const fileFormat = {
    image: ['image/png', 'image/jpeg', 'image/jif'],
    pdf: ['application/pdf']
}

export const HME = (err,req,res,next) => {
    if (err) {
        res.status(400).json({message: "multer error", err})
    } else {
        next()
    }
}

export const myMulter = (customValidation = fileFormat.image) => {
    const storage = multer.diskStorage({});
    function fileFilter (req, file, cb) {
        if(!customValidation.includes(file.mimetype))
        {
            cb("Invalid format", false)
        }
        else
        {
            cb(null, true);
        }
      }
    
      const upload = multer({ fileFilter, storage })
      return upload;
}