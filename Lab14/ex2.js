fs = require('fs');

var filename = 'user_data.json'

if(fs.existsSync(filename)) {

data = fs.readFileSync(filename, 'utf-8') 

users_reg_data = JSON.parse(data);

console.log(users_reg_data.itm352.password);
} 

else {
    console.log(filename + 'does not exist!')
}