const db = require('../../../connection');

const passport = require('passport');
var passportJWT = require("passport-jwt");
var JwtStrategy = passportJWT.Strategy;

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies.jwt;
    }
    return token;
};
// strategy for using web token authentication
var jwtOptions = {}
jwtOptions.jwtFromRequest = cookieExtractor;

jwtOptions.secretOrKey = process.env.JWT_SECRET;

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    
    db.query(`select email from users where email='${jwt_payload.email}'`,(err,row)=>{
        if(err) throw err;
        if (row[0].email) {
            next(null, row[0].email);
        } else {
            next(null, false);
        }
    });
});
module.exports = {strategy}
