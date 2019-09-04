const fs = require('fs');

const compareElements = (a, b, keys) => !keys.map(key => a.key == b.key).find(e => !e)


function compareArray(otherArray) {
    return function(current) {
        return otherArray.filter(function(other) {
            const result = compareElements(current, other, ["url", "lvl0", "lvl1", "lvl2", "lvl3", "lvl4", "lvl5", "content"])
            if (!result) {
                console.log(result)
            }
            return result
        }).length == 0;
    }
}
const myArgs = process.argv.slice(2);
const file1 = fs.readFileSync(`${myArgs[0]}.json`);
const file2 = fs.readFileSync(`${myArgs[1]}.json`);

if (!file1 || !file2 || !file1.length || !file2.length) {
    throw new Error('Wrong inputs')
}

const array1 = JSON.parse(file1)
const array2 = JSON.parse(file2)



const onlyInA = array1.filter(compareArray(array2));
const onlyInB = array2.filter(compareArray(array1));

console.log(onlyInA)
console.log(onlyInB)