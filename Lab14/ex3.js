var express = require('express');
var app = express();
var myParser = require("body-parser");

app.use(myParser.urlencoded({ extended: true }));
//states that i want to use parser

fs = require('fs');

var filename = 'user_data.json';

if(fs.existsSync(filename)) {
//im going to check if the file exists
    stats = fs.statSync(filename);

    console.log(filename + ' has ' + stats.size + 'characters');
    //stat size give info in the file
    data = fs.readFileSync(filename, 'utf-8') 

    users_reg_data = JSON.parse(data);

    console.log(users_reg_data.itm352.password);
} 
//if does not exist say it does not exist
else {
    console.log(filename + 'does not exist!')
}


app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
        <body>
            <form action="" method="POST">
                <input type="text" name="username" size="40" placeholder="enter username" ><br />
                <input type="password" name="password" size="40" placeholder="enter password"><br />
                <input type="submit" value="Submit" id="submit">
            </form>
        </body>
    `;
    //takes html and barfs it back
    response.send(str);
 });
//if i GET a request for /.login do the above, by generating a login form
//server responsing by generating a page for the user
//another way to handle a request, for a request you are not handling
//app.get looks to see if you have the file that you requested
//if the server is generatign the form the user sees, the server can inject any information it wants the user to see

app.post("/login", function (request, response) {
    //function for login form
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    //form inside action is blank which calls itself, uses post method
    //called with data from the form
    //action will be loging then post
    //body parser will allow to get data within the body
console.log(request.body);
    //has username and password
    //data is within the body
the_username = request.body.username;
    //
if(typeof users_reg_data[the_username] != 'undefined'){
    //checking to see if username exists
    if (users_reg_data[the_username].password == request.body.password){
        //if it does exists, get the password
        //send them to invoice
        response.send(the_username + 'logged in');
    }   //login
        //response when the user is logged in to greet them 
        //personalization
    else {response.redirect('/login');
        //redirects the user to the login page
}
    

}
});
