const userRoute = require("./user.route.js");
const categoryRoute = require("./category.route.js");
const bookRoute = require("./book.route.js");
const sildeRoute = require("./slide.route.js");
const libraryRoute = require("./library.route.js");
const authRoute = require("./auth.route.js");
const authController = require("../controllers/auth.controller.js");
const { isAuthenticated, isAuthenticatedTrue } = require("../middelwares/auth.middelwares.js");

function route(app){
    app.use("/user", isAuthenticated, userRoute);
    app.use("/category", isAuthenticated, categoryRoute);
    app.use("/book", isAuthenticated, bookRoute);
    app.use("/slide", isAuthenticated, sildeRoute);
    app.use("/library", isAuthenticated, libraryRoute);
    app.use("/login", isAuthenticatedTrue, authRoute);
    app.use("/logout", isAuthenticated, authController.logout);
    app.route("/password")
    .get(isAuthenticated, authController.password) 
    .post(isAuthenticated, authController.submitChangePassword); 
}

module.exports = route