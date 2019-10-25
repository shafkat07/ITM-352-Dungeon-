attributes  =  "shafkat;10;10.5;-9.5";
theSeparator = ';';
parts = attributes.split(theSeparator)
console.log(parts)
// parts = ['Shafkat', 10, 10.5, -9.5];

for(i=0; i < parts.lenght; i++ ) {
    console/log(`${parts[i] isNonNegInt ${isNonnegInt()}}`)

console.log(typeof parts[i]);
}

console.log(parts.join(theSeparator));

function is NonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
return (errors.length == 0);
}

console.log(isNonNegInt('10.2')); 


isNonNegInt();
