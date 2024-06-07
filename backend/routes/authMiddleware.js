module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('User is authenticated');
        return next();
    }
    console.log('User is not authenticated');
    res.status(401).send({ message: 'Unauthorized' });
};