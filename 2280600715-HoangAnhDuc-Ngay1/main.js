let array = [1, 2, 3, 4, 5];
console.log("DUC");

let result = array.map(function (x) {
  if (x % 2 === 0) {
    return "chan";
  } else return "le";
});

console.log(result);

let result2 = array.reduce(function (pre, e) {
  return pre * e;
});
console.log(result2);

let result3 = array.filter(function (x) {
  return x % 2 === 0;
});
console.log(result3);

let result4 = array.some(function (x) {
  return x % 2 == 0;
});
console.log(result4);

let result5 = array.every(function (x) {
  return x % 3 == 0;
});
console.log(result5);
