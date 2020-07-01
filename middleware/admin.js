
module.exports = function (req, res, next) {
    // auth.js middleware  send req.user 

    //401 Unauthorized : use when user tries to access protected resourse
    // that does not provide validate json token
    //403 Forbidden
    if (!req.user.isAdmin) return res.status(403).send('Access denied.');

    next();
}