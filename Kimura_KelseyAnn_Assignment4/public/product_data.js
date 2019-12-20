//Creating the array of the products
//Created a artist_data.json file and copied template from there

product_data = [
//Product 1: Bowl
    {
        "type": "Bowl", //set type of object to "Bowl"
        "price": 30.00, //price is $30
        "image": "./images/bowl.jpg", //link to image in ./public/image folder
        "description": "An antique bowl of a giraffe doing yoga from Zimbabwe. Made of authentic baobab wood." //description of object
    },
//Product 2: Earrings
    {
        "type": "Earrings", //set type of object to "Earrings"
        "price": 40.00, //price is $40
        "image": "./images/earrings.jpg", //link to image in ./public/image folder
        "description": "A pair of mini 24 karat gold-plated giraffe head earrings" //description of object
    },
//Product 3: Necklace
    {
        "type": "Necklace", //set type of object to "Necklace"
        "price": 60.00, //price is $60
        "image": "./images/necklace.jpg", //link to image in ./public/image folder
        "description": "Sterling silver necklace, perfect for that special someone" //description of object
    },
//Product 4: T-Shirt
    {
        "type": "T-Shirt", //set type of object to "T-Shirt"
        "price": 20.00, //price is $20
        "image": "./images/shirt.jpg", //link to image in ./public/image folder
        "description": "A modern, white giraffe t-shirt" //description of object
    },
//Product 5: Teether
    {
        "type": "Teether", //set type of object to "Teether"
        "price": 25.00, //price is $25
        "image": "./images/teether.jpg", //link to image in ./public/image folder
        "description": "Giraffe teether made of 100% all natural rubber and organic dye" //description of object
    }
];

//If the module is not undefined, have the module export the data from the artist_data array
//From Assignment1_Design_Examples > Asssignment1_2file > artist_data.js 
if (typeof module !='undefined') { //if the type of the module is defined
    module.exports=product_data; //export the artist_data
}