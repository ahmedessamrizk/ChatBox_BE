

export const paginate = (page, size) => {
    try {
        if(!page || page <= 0)
        {
            page = 1;
        }
        if(!size || size <= 0)
        {
            size = 2;
        }
        const skip = (page - 1) * size;
        return { limit: size, skip }
    } catch (error) {
        res.status(400).json({message: "catch error"})
    }
}