module.exports = function (req, res, next) {
  if (req.session.user && req.session.user.admin) {
    next()
  } else {
    res.status(403).send('For admin eyes only')
  }
}
