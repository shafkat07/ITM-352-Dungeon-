//server for nintendo switch games store
const querystring = require('querystring'); //require that the server responds to any errors 

var fs = require('fs'); //variable for loading the node.js file system module
var express = require('express'); //express package; allows us to use tools from express
var myParser = require("body-parser"); //takes query string
var cookieParser = require('cookie-parser');
var products = require("./public/product.js"); //take data from products.js in the public folder
var qs = require('querystring'); //querystring needed in order to initiate functions
var user_product_quantities = {}; //defines user_products_quantities as a variable that requests the query string of product quantity

//borrowed code from Lab13
var app = express(); //variable for express
app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json()); //use json

//borrowed code from Lab15
var session = require('express-session'); //EX2 new middleware
app.use(session({ secret: "ITM352 rocks!" })); //use sessions

app.all('*', function (request, response, next) { //respond to HTTP request by sending type of request and the path of request
    console.log(request.method + ' to ' + request.path, request.session.id);
    next(); //calls middleware function
});
app.use(cookieParser());

//SHOPPING CART CODE//

//help from Dr. Port's office hours
//creates session for when "loading" items in webpage
//add_to_cart is a function in the products_page
app.post('/add_to_cart', function (request, response) {
    console.log('add to cart:', request.body);
    if (typeof request.session.cart == 'undefined') { //if there's nothing in the cart, show blank
        request.session.cart = [];
    }
    request.session.cart.push(request.body); //push json file information
    response.json("{'result': 'okay'}");
});

//help from Prof. Kazman's office hours --> for loop
app.get('/cart', function (request, response) {
    console.log('modify cart:', request.body); //modify cart is supposed to be a function to allow user to change quantity, but I was unsuccessful
    //creates a string
    //putting cart page here
    str = `
    
    <head>
    <link href="https://fonts.googleapis.com/css?family=Work+Sans:400,600" rel="stylesheet">
    <link href="index.css" rel="stylesheet">
    <link href="display.css" rel="stylesheet">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=<device-width>, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    </head>

    <body>

    <header>
        <div class="container">
            <nav>
                <ui>
                    <li><a href="/index.html">Home</a></li>
                    <li><a href="/about.html">About</a></li>
                    <li><a href="/product_display.html">Products</a></li>
                    <li><a href="/contact.html">Contact</a></li>
                    <li><a href="/login.html">Login</a></li>
                    <li><a href="/registration.html">Get Started</a></li>
                    <li><a href="/cart">Cart</a></li>
                </ui>
            </nav>
        </div>
    </header>

    <h1 style="text-align:center">Jaren's Stuffed Animal Store</h1>
        <u>
            <h3 style="text-align:center">Shopping Cart</h3>
        </u>
        <main>
    <form action="invoice.html" method="GET">`;
    //for loop gets item quantity from products_display and saves it for the cart
    for (i = 0; i < request.session.cart.length; i++) {
        idx = request.session.cart[i].p_index; //saves product_info --> p_index as variable idx
        p_qty = request.session.cart[i].p_quantity; //saves product_quantity --> p_index as variable p_quantity
        str += `<h2 style="text-align:center">${products[idx].toy}</h2>`; //show name of product in cart when added
        str += `<h2 style="text-align:center"><img src="${products[idx].image}"></h2>`; //show image of product in cart when added
        str += `<h2 style="text-align:center"><p class="price">$${products[idx].price}</p></h2>`; //show price of product in cart when added
        str += `<label>Quantity:   </label><input type="text" value="${p_qty}" onkeyup="checkQuantityTextbox(this);"disabled>`; //displays quantity chosen from products_display page and show here
    }
    str += `
    </main>
    <footer>
        <div>
            <h2 style="text-align:center"><strong><input type="submit" value="Purchase!" name="purchase_submit"></strong></h2>
        </div> 
        </form>  
    </footer>
    </body>
        `;
    response.send(str); //send string
});

//borrowed code from Assignment1 example from Dr. Port and added
//intercept purchase submission form, if good give an invoice, otherwise send back to order page
//Note: Unsuccessful when trying to send invoice, just redirects to cart again
app.get("/invoice.html", function (request, response) { //get invoice page
    //quantity data in query string
    user_product_quantities = request.query;
    //check if quantity data is valid
    params = request.query;
    console.log(params);
    if (typeof params['purchase_submit'] != 'undefined') {
        has_errors = false; //assume that the quantities are valid
        total_qty = 0; //need to check if something was selected so we will look if the total > 0
        for (i = 0; i < products.length; i++) { //checking each of the products in the array
            if (typeof params[`quantity${i}`] != 'undefined') {  //quantity is not undefined, then go to next statement
                a_qty = params[`quantity${i}`];
                total_qty += a_qty;
                if (!isNonNegInt(a_qty)) {
                    has_errors = true; //if data is invalid
                }
            }
        }
        console.log(has_errors, total_qty);
        //request to look at query list/data
        qstr = querystring.stringify(request.query);
        //respond to errors
        if (has_errors || total_qty == 0) {
            //if quantity data is not valid, send them back to cart page
            qstr = querystring.stringify(request.query);
            response.redirect("cart?" + qstr);
        } else { //all good to go!
            response.redirect("invoice.html?" + qstr); //if quantity data is valid send to invoice page
        }
    }
});

//checking that data is valid
//borrowed code from Lab13/Assigment1
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (q == "") { q = 0; }
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

//borrowed from Lab14

fs = require('fs'); //loads the node.js file system module

var filename = 'user_data.json'; //will take the file name in the ''

if (fs.existsSync(filename)) { //we load in users_reg_data from the json file
    stats = fs.statSync(filename);

    console.log(filename); //returns user_data

    data = fs.readFileSync(filename, 'utf-8'); //read the file synchronously until the file comes back

    users_reg_data = JSON.parse(data) //will convert data (string) into an object or an array

    console.log(users_reg_data);
    //will show grader since that's the password for itm352 user
    //has to follow identifier rueles

} else {
    console.log(filename + 'does not exist!');
    //if file name does not exist, return this
    //ex:if we change var filename = 'zuser_data.json'; will return zuser_data.jsondoes not exist!
}

//LOGIN CODE//
//worked with code from Lab14
app.post("/login.html", function (request, response) {
    //process login form POST and redirect to logged in page if ok, back to login page if not
    //if I have post, below will load
    console.log(user_product_quantities);
    the_username = request.body.username; //define the_username, request username 
    the_username = request.body.username.toLowerCase(); //makes username case insensitive
    console.log(the_username, "Username is", typeof (users_reg_data[the_username]));
    //validate login data
    if (typeof users_reg_data[the_username] != 'undefined') { //data we loaded in the file
        if (users_reg_data[the_username].password == request.body.password) { //making sure that the password inputted is the same as password saved in the user data
            /*response.cookie('username', the_username, { maxAge: 600 * 1000 }); //session will last for 10 minutes or 600 seconds then redirected to the home page
            response.redirect('index.html?' + `&username=${the_username}`); */ //if all good, send back to index page
            response.cookie('username', the_username, { maxAge: 60 * 1000 * 10 }).redirect("/index.html?");
            return;
        }
        else {
            error = "Invalid Password"; //if password does not exist, will show message (connected to login page)
        }
    }
    else {
        error = "Invalid Username"; //if username does not exit, will show message (connected to login page)
    }
    request.query.error = error; 
    request.query.StickyLoginUser = the_username;
    qstring = querystring.stringify(request.query);
    response.redirect('/login.html?error=' + error);//if username doesn't exist then return to login page (with alert box)
}
);

//REGISTRATION CODE//
//worked with code from Lab14
app.post("/registration.html", function (request, response) {
    //process a simple register form
    console.log(user_product_quantities);

    //variable for re-enter password validation
    var p = request.body.password; //variable for password, p for password
    var cp = request.body.repeat_password; //variable for repeat password, cp for check password

    username = request.body.username; //save new user to file name (users_reg_data)
    username = request.body.username.toLowerCase(); //makes username case insensitive
    errors = {};//checks to see if username already exists

    //username validation
    if (typeof users_reg_data[username] != 'undefined') {
        errors.username_error = "Username is Already in Use."; //error message if username already exist (connected to registration page)
    }
    if ((/[a-z0-9]+/).test(request.body.username) == false) {
        errors.username_error = "Numbers and Letters only"; //error message if there are other special symbols other than numbers and symbols (connected to registration page)
    }
    if ((username.length > 10) == true) {
        errors.username_error = "Username is too long - 10 characters max"; //error message if number of characters is longer than 10 (connected to registration page)
    }
    if ((username.length < 4) == true) {
        errors.username_error = "Username is too short - 4 characters minimmum"; //error message if number of characters is shorter than 4 (connected to registration page)
    }

    fullname = request.body.fullname;//save new user to file name (users_reg_data)
    //fullname validation
    if ((/[a-zA-Z]/).test(request.body.fullname) == false) {
        errors.fullname_error = "Only use letters"; //error message if special characters are used and/or a space is missing (connected to registration page)
    }

    if ((fullname.length > 30) == true) {
        errors.fullname_error = "Please make your full name shorter - 30 characters max"; //error message if number of characters is longer than 30 (connected to registration page)
    }

    email = request.body.email;
    //email validation
    if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email) == false) {
        errors.email_error = "Please enter a proper email"; //error message if proper email is not used (connected to registration page)
    }

    console.log(errors, users_reg_data);
    //if there are 0 errors and repeat_password is equal to password, request all registration info
    if ((Object.keys(errors).length == 0) & (p == cp)) {
        users_reg_data[username] = {};
        users_reg_data[username].username = request.body.username
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email;
        users_reg_data[username].fullname = request.body.fullname;

        fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //saves/writes registaration data into the user_data json file
        response.redirect("/login.html?"); //if all good, redirect to login then have them log in
    } else {
        qstring = qs.stringify(request.body) + "&" + qs.stringify(errors); //puts errors into a query string
        response.redirect('/registration.html?' + qstring); //if there are errors, send back to registration page to retype
    }
});

//borrowed code from Lab13
//will go grab files from public folder
app.use(express.static('./public'));
//use port 8080
app.listen(8080, () => console.log(`listening on port 8080`));