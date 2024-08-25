

function curryUnaryFunction(a) {
    return function (b){
        return function (c) {
            return a + b + c;
        }
    }
}
console.log(curryUnaryFunction(1)) // returns a function: b => c =>  1 + b + c
console.log(curryUnaryFunction(1)(2)) // returns a function: c => 3 + c
console.log(curryUnaryFunction(1)(2)(3)); // returns the number 6

