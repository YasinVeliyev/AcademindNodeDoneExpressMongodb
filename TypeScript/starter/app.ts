const num1Element = document.getElementById("num1") as HTMLInputElement;
const num2Element = document.getElementById("num2") as HTMLInputElement;
const buttonElement = document.querySelector("button")!;

const numResults: Array<number> = [];
const stringResults: Array<string> = [];

type NumOrString = number | string;
type Result = { val: number; timesstamp: Date };

interface ResultObj {
    val: number;
    timesstamp: Date;
}

function add(num1: NumOrString, num2: NumOrString): NumOrString {
    if (typeof num1 === "string" && typeof num2 === "string") {
        return num1 + " " + num2;
    }
    return +num1 + +num2;
}

buttonElement.addEventListener("click", event => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const result = add(+num1, +num2) as number;
    const stringResult = add(num1, num2) as string;
    stringResults.push(stringResult);
    printResult({ val: result, timesstamp: new Date() });
    console.log(numResults, stringResults);
});

function printResult(resultObj: Result) {
    console.log(resultObj.val);
}

const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("It worked");
    }, 1000);
});

myPromise.then(console.log);
