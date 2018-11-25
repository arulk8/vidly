let admin = (req, res, next) => {
  if (!req.user.isAdmin) {
    res
      .status(403)
      .send(
        "Access Denied. you don't have sufficient previladge to perform this action"
      );
    return false;
  }
  next();
};

module.exports = admin;
// 400 - bad request, 401- unauthorized, 403- forbidden,
// 409-conflict,500-internal error,200 - ok
// 400 to 499 expected error. other are un expected error
// expected error - invalid id, already deleted, invalid data
// unexpected - bugs in backend, DB error,network problem, invalid url.
