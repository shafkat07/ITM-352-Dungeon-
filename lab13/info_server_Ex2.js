var express = require('express');

var app = express();
var myParser = require("body-parser");
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
   next();
});

app.use(myParser.urlencoded({ extended: true }));
if(isNonNegInt(quantity_textbox.value)) {
    document.write(`Thanks for ordering ${quantity_textbox.value} things!`);
    }
    function displayPurchase() {
    if(isNonNegInt(GET['quantity_textbox'])) {
    document.write(`Thanks for ordering ${GET['quantity_textbox']} things!`);
    } else {
        alert('Please enter a valid quantity')
    }
}
app.post("/process_form", function (request, response) {
   let POST = request.body;
   if (typeof GET['quantity_textbox'] != 'undefined'){
    displayPurchase();
    window.stop();
}
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));