
const role = (access) => {
    return function(req, res, next) {
        try {
            if(access.includes(req.jwt.role)) {
                next()
            } else {
                throw { message : 'PERMISION_NOT_ALLOWED'}
            }
        } catch(err) {
            return res.status(401).json({
                status: false,
                message: err.message
            })
        }
    }
}

export default role