import { Bear } from './bear';
import { Koala } from './koala';

const bear = new Bear();
const koala = new Koala({ name: 'Tom' });

console.log(bear.sayHello());
console.log(koala.sayHello());