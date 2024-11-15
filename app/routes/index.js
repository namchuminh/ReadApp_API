const userRoute = require("./user.route.js");
const categoryRoute = require("./category.route.js");
const bookRoute = require("./book.route.js");
const sildeRoute = require("./slide.route.js");
const libraryRoute = require("./library.route.js");

function route(app){
    app.use("/user", userRoute);
    app.use("/category", categoryRoute);
    app.use("/book", bookRoute);
    app.use("/slide", sildeRoute);
    app.use("/library", libraryRoute);

}

module.exports = route