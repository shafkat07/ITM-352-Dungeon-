//processing a login
var express = require('express');
var app = express();
var myParser = require("body-parser");

app.use(myParser.urlencoded({ extended: true }));

fs = require('fs');

var filename = 'user_data.json';

if(fs.existsSync(filename)) {
//im going to check if the file exists
    stats = fs.statSync(filename);

    console.log(filename + ' has ' + stats.size + 'characters');
    //stat size give info in the file
    data = fs.readFileSync(filename, 'utf-8') 

    users_reg_data = JSON.parse(data);
/*
    username = 'newuser';
    users_reg_data[username] = {};
    users_reg_data[username].password = 'newpass';
    users_reg_data[username].email = 'newuser@user.com';
    //successfully adds another user to user_reg_data
    fs.writeFileSync(filename, JSON.stringify(users_reg_data));
    //take user reg data and convert to string and srite into file
    //convert to json
   */ 
    console.log(users_reg_data);
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

app.post("/login", function (request, response) {

console.log(request.body);

the_username = request.body.username;

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

app.listen(8080, () => console.log(`listening on port 8080`));