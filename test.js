


/*function a(){
  for(const { x = g=3, y={hh: 'hello',}, ...rest } of [{ y: 5, z: 8}, {x: 2, y: 3},{}, {x: 5, h: 'jk'}, {x: 7}]){
    console.log(x, y,rest, window.g)
  }
}
a();
var g = console.log
let a = -8
const f = ['hello_'];
const b = { [f + 'world']: a, f, fn(){
  console.log(this.f)
}}
const c = 3 + '0' * 6
function gf(gf,...args){
  return (gf + args[0]) * args[1];
}
const d = gf(1, 2, 3) + c * (a + 2 *7);
g('这是自己的console.log',d);

let fn = function (a){
  if (a === f) {
    console.log(this, this.f)
  } else {
    console.log('hhhh', a)
  };
}
let f = { a: 1};
const b = { f, fn }
f.a = 3;
b.fn(f);
fn(2)
*/
const test1 = `
function A(x) {
return {
x
}
}
const q = new A(3)
console.log(q)
const xy = !window ? { ... { f: 'f' }} : console.log
console.log(xy)
function dfs(index) {
console.log(index)
if (index > 10) {
return {
 ... true ? {g: 144, ...{}, ... {q: 5}} : { h: 111}
}
}
return dfs(index +1)
}

if (true) {
console.log([true, undefined, false, null, NaN])
} else if (false) {
}


console.log('dfs->',dfs(0))

const ff = 1,q2={},f ={}, ag = [], rest =[];
const ay = (() =>1) + 'gjnoih' + (async (a=yuu, b, bh) => {});


const expect =(ff,gwindow =5,{f: q2, ...f}, [ag, ...rest])
+ (async (ff,g =5, {f: q2, gsgd,g2 = 'ff',...fsd}, [a, ...rest], ...rest2) => {})

console.log(1,)


const test2 = function a(...rest) {
console.log('test', ...rest)
}

test2(1, 2, 3, 4, [{ test() {}}]);

function * test() {
let i = 0;
while(i < 2) {
yield * ['hello', 'world']
yield i++;
}
return 'end';
}
const g = test();
console.log(g.next(), g.next(), g.next(), g.next(), g.next(), g.next(), g.next())

const x = 'xx'
const obj = {
x,
b: x,
[x]: x,
f(){},
async f(){},
async ['f'](){},
*f(){},
async * f(){
},
[x](){},
get g(){
console.log('get')
return 'f', this.innerG;
},
innerG: 4,
set g(x){
console.log('set', x)
this.innerG = x;
},
set [x](f){
},
get [x]() {
},
...x ? {}: {}
}

console.log(obj)

2 + 9
let a = 1 === 2 || 1;
let b = 2;
const [yy = {...rest},{bjj = 'a', ['gfg']: afffy = 2, gff: hj=7,j, ...jn}, ...ffdf] = [{ }]
console.log(
a++ + ++ b, yy
)

{
console.log('block', yy,bjj,afffy,hj,j,jn,ffdf)
}

if (b === 3)
if (a === 1) {
console.log('if')
} else if (++a === 3) {
console.log('else if')
} else {
console.log('else')
}`
export const isProgram = `
const fn = () => {
  return window.Object;
}

const ff = 'hello'
class A extends fn() {
  ;;;;
  [ff];g;
  static {}
  static g = 'f';
  static ['sgf'] = this.g
  static sq() {}
  static ['run'] () {
  }  static set f( f) {
  }
  static get ['f']() {}
  async = 1
  async async() {}
  async
  set;
get
set(){}
get() {}
set get(f){}
get set(){} 
set async(f){}
async set(f){}

g = A.g;;;;;;;
['gg'] = this.g;
['gf']() {}
async * q() {
  yield [this, ... arguments]
}
set f(x) {
}
get ['f']() {}
}
const x = {
  async: '1',
  async async(){console.log(2)},
  async(x){ console.log(1)},
  set set(x){},
  set(yyy){},
  set: 'set',
  
  }
  
  x.async()

  const g = new A()
  g.q('this is arguments').next().then(console.log)

/*const x = {
  async: '1',
  async async(){console.log(2)},
  async(x){ console.log(1)},
  set set(x){},
  set(){},
  set: 'set',
  
  }
  
  x.async()

const f = 'hello world';
const z = {ff: 2 }
let str = \`abc\` + \`ghj\\\${
f + \\\`fds\\fdf\${'ff'}kn\\\\\\bv\`
+\` 
iop\${  
f 
 
}er\`
console.log(str)
const x = { async [new window.Promise(((r) =>setTimeout(() => { r(3)}, 4000))).then(console.log) ]() { console.log(await 1) }, z, g: z, ['hello' + 'world']: 'f', q() {
console.log(this, arguments)
}, async hh() {
await new Promise((r) => {
setTimeout(r, 2000)
})
return arguments[0] + this.z.ff * this.g.ff
},
async ['async' + 'func'] () {
const x = await this.hh(78)
console.log('async', x)
},* gen() {
yield * [...arguments[0]]
},
async * gen2() {
  const x = await Promise.resolve(33)
  yield x + 67
  yield await new Promise((r) => setTimeout(() => {
     r('----》')
  }, 4000))
},
['ggg' + z.ff]() {
},

get gff(){

  console.log('get')
  
  return 'f', this.innerG;
}, 
  
  innerG: 4,
  
set gff(x){
  
  console.log('set', x)
  
  this.innerG = x;
  
},

set [z.ff + '22'](f){
  console.log('set ->')
  this.innerFFF = f
},
innerFFF: 10,
get [z.ff+  '22']() {
  console.log('get')
  return this.innerFFF
},
...{
  ...{ fjff() {
    return this
  }}
}
}
x.q(1,22)
x.hh(45).then(console.log)

x.z.ff = 10

x.asyncfunc()

const gen = x.gen(['f', 'g', 'hj'])

console.log([gen.next(), gen.next(),gen.next(), gen.next()
,gen[Symbol.iterator]() === gen]) 
const gen2 = x.gen2()
gen2.next().then(console.log)
gen2.next().then(console.warn)

console.log(x.gff)
x.gff ++

console.log(++x['222'], x.fjff())*/

`

export const isVariableDeclaration = `
const a
/*const tt = \`
try
write
ast
\`,
 jj = q = 'dfsddf',a_B_133 = b + 1 + 2.12342398423 * (12 / 4), dl = 3 + 3*/
`


export const input2 = `
const cc =[[f], {}, ()=>{}, '1', 2, true, null, undefined]

const ddd = {
  [a = [fff]]: 2,
  a: 2,
  f,
  [f](){},
  c: 2,
            }
const a = async function * (g=1,{},a=q =c={b: 3}, {ac: qqqq,b=1, }, q){};
const tt = jj = q = 'dfsddf',a_B_133 = b + 1 + 2.12342398423 * (12 / 4), dl = 3 + 3;;;;;;
var fff = "dljfs  '哦经理恐怕；k"
const x = \`
jdlfksapdokfps
ijfokspaodf
\`
console.log(a_B_133)

console.log(x = y + 1);

// iuoekoprk
let sum = 1
for(let i=0; i< 200; i++){
  sum+=i
}

if (qqq && b || c) {
  console.log(a)
}
class P {
}
/*
a
s
t
*/
class Todo extends P { 
  id = Math.random();
  title = "";
  type = () => {
    console.log(i)
  }
  arr = []
  static x = 1111
  
  render(a =1){
    console.log(this.a)
  }

  get id(){
    return this.id
  }
  
}

Todo.prototype.render = (x, y) =>{
  console.log('hkjljl')
}

const todo = new Todo()

todo.render()

const d = () => ({
  a: 12
})

const c = function () {
}

async function sleep(t){
await new Promise(r => setTimeout(r, t))
}

function * b(){
  yield sleep?.()
}
`
export const textList = {
  getText: function(x) {
    if(this[x]) {
      return this[x]
    }
    return `// 现在测试的是${x}模块，没有对应的测试文本,请自行在下方添加
   `},
  isProgram,
  isVariableDeclaration,
  isObjectExpression: `
  // 现在测试的是isObjectExpression模块，
  //{a,[c= {x: 2,[d]: 'f'}]: 2, b: 2 + e}
  { 
    f: 1,
    fn(){
      console.log(this.f)
    }
   }
  `,
  isArrayExpression:`
  // 现在测试的是isArrayExpression模块，
  [
   [
     a,
     [
       {
        [d+2]: 2,
          c: {},
          d: function(f = 1,q = {x, ...g}){
             if(a){
               const a =\`
fljsld;f
                \`
             }
          }
       }
     ]
   ],
   {}
  ]
  `,
  isBinaryExpression: `
  // 现在测试的是isBinaryExpression模块，
  // a + b * c / d - (a + b * c)
  // void a || typeof b++ * (c / d - (a |g && +(b * !c0))) - (b+u|yj.c^y & d %f++)/(d[k].g--+d&r) //预期是对的
  // a+b-+c+d
  //  -a+++++b ++
  // -a++ + r* -b  + \`1111\$\{3333 + \`444\$\{555\}666\`\}2222\`
   // a+ '12\\\\\'' // 预期是错的
  //a+ '12\\\\g\\\'' // 预期是对的
  // a+ "12\\\\g\\\\\"" // 预期是错的
  // a+ "12\\\\g\\\"" // 预期是对的
  // b  + \`1$\{a\}1$\{b\}11\$\{\`3333\` + \`444\${() => { return 555 }}666\`\}22\${
  //   ()=>{ return '\\\}'}
  // }333\` * 555 / \/\`hhh\`\/ // 预期是对的
    a+b*c
  `,
  isParams: `
  // 现在测试的是isParams模块，
   a =[{[d]: s}], b,c={q:{x}}
  `,
  isDeclaration: `
  // 现在测试的是isDeclaration模块，
  const x,a = [
   {q: {t},x: [b]}
  ],b =2,c =3, d = e = 1
  `,
  isDeclarations: `
  // 现在测试的是isDeclarations模块，
  x, a = 1,c=f=b= 2, c=[
    {
      get [j](){},
     set [j](){},
     async * [j](){},
     async * a(){}
    }
   ]
  `,
  isVariableDeclarator: `
  // 现在测试的是isVariableDeclarator模块，
  [c, {x}, ...({dd})]=[{x: 3 * [{a}]}]
  `,
  isFunctionExpression: `
  // 现在测试的是isFunctionExpression模块，
   async function * a(x=[{}], q= {x, ...y}) {
      const a = 1
      async function * x(a) {
         let b = {}
      }
   }
  
  `,
  isFunctionDeclaration: `
  // 现在测试的是isFunctionDeclaration模块，
  /* async function * _f1h(x=[{}], q= {x:[], ...y}) {
      const a = 1
      async function * x(a) {
         let b = {}
      }
    }
  */
   function a(a=1, c =hhhh = { p, ttt} = {p: a + 2, ttt: 555}) {

   }
  `,
  isObjectPattern: `
  // 现在测试的是isObjectPattern模块，
   {ac: qqqq,b=1, }
  `,
  isArrowFunctionExpression: `
  // 现在测试的是isArrowFunctionExpression模块，
  async (fd) => async g => (a={x:()=>({a:[]})},{}) => async 
  function * a () {
  }
  `,
  isArrayPatternElements: `
  // 现在测试的是isArrayPatternElements模块，
  a245346rydc=1, affd, {s},[aff, bffff], ...x
  `,
  isAssignmentPattern:`
  // 现在测试的是isAssignmentPattern模块，
   a= {x, ...f}
  `,
  isArrayPattern: `
  // 现在测试的是isArrayPattern模块，
   [a245346rydc=1, affd, {s},[aff, bffff], ...x]
  `,
  isCallExpression: `
  // 现在测试的是isCallExpression模块，
  // window?.['console']?.log(q)?.[x]?.({...this?.get()})
  gf(1, 2, 3)
  `,
  isIfStatement: `
  // 现在测试的是isIfStatement模块，
  if(a)
  a = function () {
     return f+2
  }
   else if (b) {
     a = !b ? c : d
   } else if (c) {
}
  `,
  isAssignmentExpression:`
  // 现在测试的是isAssignmentExpression模块，
   Todo.prototype.render = (x, y) =>{
    const a = \`
    flsjfd
    \`
  console.log('hkjljl')
  }
  `,
  isConditionalExpression: `
  // 现在测试的是isConditionalExpression模块，
   a ? b: q ? x : d
  `,
  isWhileStatement: `
  // 现在测试的是isWhileStatement模块，
   while(a)
    a+=1 + 'dsfadsf'
  `,
  isLogicalExpression: `
  // 现在测试的是isLogicalExpression模块，
  a > b && c++ < --d !== !g
  `,
  isForStatement: `
  // 现在测试的是isForStatement模块，
  for(let i = 1; i< 10; i++) {
    console.log(i)
  }
  `,
  isClassExpression: `
  // 现在测试的是isClassExpression模块，
  class s extends sd{
    sdf;
   static x = class{}
   [x] =sfsd;
   static [x+2] ='sdfs';
   static async * [re+2](a =1){
    console.log(this.a)
  }

  static set id(x){
    return this.id
  }
  }
  `,
  isClassDeclaration:`
  // 现在测试的是isClassDeclaration模块，
  class afsd extends (ppp){
    consturtor(){
       this.x =1;
       (async ()=>{
           await this.sleep(100)
       })()
     }
     async sleep(x){
      await new window.Promise(r=>setTimeout(r,x))
     }
     * a(){
       yield x
     }
  }
  `,
  isParamsItem: `
  // 现在测试的是isParamsItem模块，没有对应的测试文本,请自行在下方添加
  c =hhhh = { p, ttt} = {p: a + 2, ttt: 555}
  `
}