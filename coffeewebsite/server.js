//Created the server via Express
//Template created by Shafkat, Terrance, and Justin

var fs = require('fs');
var express = require('express'); // server requires Express to run
const querystring = require('querystring'); // requiring a query string - string of whatever is written in textbox
const product_data = require('./public/product_data'); //using data from product_data.js
var app = express(); //run the express function and start express
var parser = require('body-parser');

app.use(parser.urlencoded({ extended: true })); // decode, now request.body will exist

//Login Server code from Lab 14

var filename = 'user_data.json' //loading the user_data.json file

if (fs.existsSync(filename)) { //only open if file exists
  stats = fs.statSync(filename); //used to printout size of filename

  console.log(filename + ' has ' + stats.size + ' characters'); //stating size of file

  data = fs.readFileSync(filename, 'utf-8') //opens the file

  //assign return value to data, use JSON.parse() to convert into an object and assign to users_reg_data
  users_reg_data = JSON.parse(data); 

} else { //if file does not exist
  console.log(filename + ' does not exist!'); //saying filename doesn't exist in console
}


//Validation for the Login Information when Login Page is loaded
app.post("/login.html", function (req, res) {
  // Process login form POST and redirect to invoice page if ok, back to login page if not
  //Code from Lab 14
  var LogError = [];
  console.log(req.body);
  //To make username case insensitive
  //toLowerCase function: https://www.w3schools.com/jsref/jsref_tolowercase.asp
  the_username = req.body.username.toLowerCase(); //username entered is case insensitive, assign to variable the_username
  if (typeof users_reg_data[the_username] != 'undefined') { //check if the username exists in the json data
    if (users_reg_data[the_username].password == req.body.password) { //make sure password matches exactly - case sensitive
    req.query.username = the_username; //adding the case insensitive username to the query
      console.log(users_reg_data[req.query.username].name); //logging the name to ensure if statement is working
      req.query.name = users_reg_data[req.query.username].name //adding the name for the registered user to the querystring
      res.redirect('/invoice.html?' + querystring.stringify(req.query)); //keeping the querystring when redirecting to the invoice
      return; //ending the if statement
    } else{ // if the password does not match what is in the registration data for the given username
      LogError.push = ('Invalid Password'); //push login error for invalid password
      console.log(LogError); //console log error to check working
      req.query.username= the_username; //add username to querystring
      req.query.password=req.body.password; //add password to querystring
      req.query.LogError=LogError.join(';'); //joining the login errors for the querystring
    }
  }
  else { //if username does not exist in registration data
    LogError.push = ('Invalid Username'); //push login error for invalid username
    console.log(LogError); //console log error to check working
    req.query.username= the_username; //add username to querystring
    req.query.password=req.body.password; //add password to querystring
    req.query.LogError=LogError.join(';'); //joining login errors for querystring
  }
  res.redirect('/login.html?' + querystring.stringify(req.query)); //redirecting user to the login page with the querystring

}
);

app.post("/register.html", function (req, res) {
  // Process registration form POST and redirect to invoice if ok, back to registration page if not
  //validate registration data

  //to log what was entered in the textboxes
  console.log(req.body);

  //create arrays to store errors
  var errors = []; //to store all errors
  var nameerrors = []; //to store name errors
  var usererrors = []; //to store username errors
  var passerrors = []; //to store password errors
  var confirmerrors = []; //to store confirm password errors
  var emailerrors = []; //to store email errors


  //make sure name is valid
  if (req.body.name == "") { //if nothing is written for the name
    nameerrors.push('Invalid Full Name'); //push error to name errors
    errors.push('Invalid Full Name') //push error to array
  }
  //make sure that full name has no more than 30 characters
  if ((req.body.name.length > 30)) { //if name length greater than 30 characters
    nameerrors.push('Full Name Too Long') //push error to name errors
    errors.push('Full Name Too Long') //push error to array
  }
  //make sure full name contains all letters
  //Code for Validating Letters only: https://www.w3resource.com/javascript/form/all-letters-field.php
  if (/^[A-Za-z]+$/.test(req.body.name)) { //if there are only letters and numbers, do nothing
  }
  else { //if there isn't only letters and numbers
    nameerrors.push('Use Letters Only for Full Name') //push error to name errors
    errors.push('Use Letters Only for Full Name') //push error to array
  }

  //Username must be minimum of 4 characters and maximum of 10
  //Code for Validating Username Length: https://crunchify.com/javascript-function-to-validate-username-phone-fields-on-form-submit-event/
  if ((req.body.username.length < 4)) { //if username is less than 4 characters, push an error
    usererrors.push('Username Too Short') //push to username errors array
    errors.push('Username Too Short') //push error to array
  }
  if ((req.body.username.length > 10)) { //if username is greater than 10 characters, push an error
    usererrors.push('Username Too Long') //push to username errors array
    errors.push('Username Too Long') //push error to array
  }
  //check if username exists
  //toLowerCase function: https://www.w3schools.com/jsref/jsref_tolowercase.asp
  var reguser = req.body.username.toLowerCase(); //make username user enters case insensitive
  if (typeof users_reg_data[reguser] != 'undefined') { //if the username is already defined in the registration data
    usererrors.push('Username taken') //push to username errors array
    errors.push('Username taken') //push error to array
  }
  //Check letters and numbers only
  //Code for validating letters and numbers only: https://www.w3resource.com/javascript/form/letters-numbers-field.php
  if (/^[0-9a-zA-Z]+$/.test(req.body.username)) { //if there are only letters and numbers, do nothing
  }
  else { //if there are other things beside letters and numbers
    usererrors.push('Letters And Numbers Only for Username') //push to username errors
    errors.push('Letters And Numbers Only for Username') //push error to array
  }

  //check if password format is valid
  //check if password is a minimum of 6 characters long
  if ((req.body.password.length < 6)) { //if password length is less than 6 characters
    passerrors.push('Password Too Short') //push to password error array
    errors.push('Password Too Short') //push error to array
  }
  //check if password entered equals to the repeat password entered - make sure password is case sensitive
  if (req.body.password !== req.body.confirmpsw) { // if password equals confirm password
    confirmerrors.push('Password Not a Match') //push to confirm password array
    errors.push('Password Not a Match') //push error to array
  }

  //check if email is valid
  //email validation code: https://www.w3resource.com/javascript/form/email-validation.php
  var regemail = req.body.email.toLowerCase(); // to make email case insensitive
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(regemail)) { 
  //if in right email format: X@Y.Z
  //X: user address can only contain letters, numbers, and "_" and "."
  //Y: host machine can only contain letters, numbers, and "."
  //Z: Z is the domain name which is either 2 or 3 letters such as “edu” or “tv”
  }
  else { //if email doesn't follow above criteria
    emailerrors.push('Invalid Email') //push to email errors array
    errors.push('Invalid Email') //push to errors array
  }




  if (nameerrors.length == 0) { //if no name errors
    console.log('no name errors!'); // to make sure if statement working
  }
  if (nameerrors.length > 0) { //if have name errors
    console.log('error:'+ nameerrors) //console log name errors
    req.query.nameerrors = nameerrors.join(';'); //joining name errors together
  }

  if (usererrors.length == 0) { //if no username errors
    console.log('no user errors!'); //to make sure if statement working
  }
  if (usererrors.length > 0) { //if have username errors
    console.log('error:'+ usererrors) //console log username errors
    req.query.usererrors = usererrors.join(';'); //joining username errors together
  }

  if (passerrors.length == 0) { //if have password errors
    console.log('no password errors!'); //to make sure if statement working
  }
  if (passerrors.length > 0) { //if have password errors
    console.log('error:'+ passerrors) //console log password errors
    req.query.passerrors = passerrors.join(';'); //joining password errors together
  }
  
  if (confirmerrors.length == 0) { //if have no errors with password confirmation
    console.log('no confirm errors!'); //to make sure if statement working
  }
  if (confirmerrors.length > 0) { //if have password confirmation errors
    console.log('error:'+ confirmerrors); // console log password errors
    req.query.confirmerrors = confirmerrors.join(';'); //joining password confirmation errors together
  }

  if (emailerrors.length == 0) { //if there are no errors
    console.log('no email errors!'); // to confirm no email errors
  }
  if (emailerrors.length > 0) { //if there is more than 1 error
    console.log('error:'+ emailerrors); //console log email errors
    req.query.emailerrors = emailerrors.join(';'); //joining email errors together
  } 
  //if data is valid and no errors, save the data to the file and redirect to invoice
  if (errors.length == 0) { //if there are no errors
    console.log('none!'); //to double check if statement working
    req.query.username = reguser; //put username in querystring
    req.query.name = req.body.name; //put name into querystring
    // store information into a JSON file
 

    res.redirect('./invoice.html?' + querystring.stringify(req.query)) //redirect to the invoice
  }
  //add errors to querystring (for purpose of putting back into textbox)
  else { //if there is one or more errors
    console.log(errors) //to double check if statement working
    req.query.name = req.body.name; //put name in querystring
    req.query.username = req.body.username; //put username in querystring
    req.query.password = req.body.password; //put password into querystring
    req.query.confirmpsw = req.body.confirmpsw; //put confirm password into querystring
    req.query.email = req.body.email; //put email back into querystring

    

    req.query.errors = errors.join(';'); //join all errors together into querystring
    res.redirect('./register.html?' + querystring.stringify(req.query)) //trying to add query from registration page and invoice back to register page on reload
  }
}
);


app.get('/purchase', function (req, res, next) { //getting the data from the form where action is '/purchase' 
  console.log(Date.now() + ': Purchase made from ip ' + req.ip + ' data: ' + JSON.stringify(req.query)); // logging the date, IP address, and query of the purchase (quantities written in textboxes) into console

  // Validating quantity data, go through each and check if good
  // Done with help from Port
  let GET = req.query; // GET is equal to getting the request from the query
  console.log(GET); // putting the query that take from the form into the console
  var hasValidQuantities = true; // empty textbox is assumed true - quantity assumed valid even before entering anything
  var hasPurchases = false; //assume quantity of purchases are false (invalid) from the start
  for (i = 0; i < product_data.length; i++) { // for every product in the array, increasing by 1
    q = GET['quantity_textbox' + i]; // q is equal to the quantity pulled from what is entered into the textbox
    if (isNonNegInt(q) == false) { //if the quantity is not an integer
      hasValidQuantities = false; //hasValidQuantities is false 
    }
    if (q > 0) { // if the quantity entered in textbox is greater than 0
      hasPurchases = true; // hasPurchases is true - because there is a quantity greater than 0 entered in the textbox
    }
    console.log(hasValidQuantities, hasPurchases); // logging hasValidQuantities and hasPurchases into console to check validity (true or false)
  }

  // If it ok, send to invoice. if not, send back to the order form
  qString = querystring.stringify(GET); //stringing the query together
  if (hasValidQuantities == true && hasPurchases == true) { // if both hasValidQuantities and hasPurchases are true
    res.redirect('./login.html?' + querystring.stringify(req.query)); // redirect to the invoice page with the query entered in the form
  } else {    // if either hasValidQuantities or hasPurchases is false
    req.query["hasValidQuantities"] = hasValidQuantities; // request the query for hasValidQuantities
    req.query["hasPurchases"] = hasPurchases; // request the query for hasPurchases
    console.log(req.query); // log the query into the console
    res.redirect('./form.html?' + querystring.stringify(req.query)); // redirect to the form again, keeping the query that they wrote
  }


});

app.use(express.static('./public')); // create a static server using express from the public folder

// Having the server listen on port 8080
// From Assignment1_Design_Examples > Asssignment1_2file > store_server.js
var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port) });

//Creating the isNonNegInt function, which checks to make sure the quantity is a positive integer 
//From Lab 12 and 13
function isNonNegInt(q, returnErrors = false) { // creating function with variable q, when returnErrors is false
  errors = []; // assume no errors at first
  if (q == '') q = 0; // handle blank inputs as if they are 0
  if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
  if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
  if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
  return returnErrors ? errors : (errors.length == 0); // return no errors if the errors length is 0
}
