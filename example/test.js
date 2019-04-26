let { Cat } = require('../');

let main = async () => {
    let cat = new Cat("miky");
    console.log(`hello, ${cat.name}`);
}

main();