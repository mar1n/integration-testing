const page = require("./page");

console.log("Initial page body:");
console.log(page.window.document.body.innerHTML);

const paragraph = page.window.document.createElement("p");
page.window.document.body.appendChild(paragraph);

console.log("Final page body:");
console.log(page.window.document.body.innerHTML);

page.window.document.getElementById("count").innerHTML = 1337;
console.log("Updated contents of the count element:");
console.log(page.window.document.getElementById("count").innerHTML);