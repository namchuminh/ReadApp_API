const userRoute = require("./user.route.js");
const categoryRoute = require("./category.route.js");
const bookRoute = require("./book.route.js");
const sildeRoute = require("./slide.route.js");


function route(app){
    app.use("/user", userRoute);
    app.use("/category", categoryRoute);
    app.use("/book", bookRoute);
    app.use("/slide", sildeRoute);
}

module.exports = route