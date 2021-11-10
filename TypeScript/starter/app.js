"use strict";
const num1Element = document.getElementById("num1");
const num2Element = document.getElementById("num2");
const buttonElement = document.querySelector("button");
const numResults = [];
const stringResults = [];
function add(num1, num2) {
    if (typeof num1 === "string" && typeof num2 === "string") {
        return num1 + " " + num2;
    }
    return +num1 + +num2;
}
buttonElement.addEventListener("click", event => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const result = add(+num1, +num2);
    const stringResult = add(num1, num2);
    stringResults.push(stringResult);
    printResult({ val: result, timesstamp: new Date() });
    console.log(numResults, stringResults);
});
function printResult(resultObj) {
    console.log(resultObj.val);
}
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("It worked");
    }, 1000);
});
myPromise.then(console.log);
//# sourceMappingURL=app.js.map