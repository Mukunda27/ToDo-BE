var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = "mason_mount_is_a special_player";

var strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {});

passport.use(strategy);
