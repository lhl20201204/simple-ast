



export const isProgram = `
const a = 1

function a(){
 const x =1
}

const c = [b]
`

export const input3 = `
const tt = \`
try
write
ast
\`,
 jj = q = 'dfsddf',a_B_133 = b + 1 + 2.12342398423 * (12 / 4), dl = 3 + 3
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
  nullText: (x) =>  `// 现在测试的是${x}模块，没有对应的测试文本,请自行在下方添加
   `,
  isProgram,
  isVariableDeclaration: input3,
  isObjectExpression: `
  // 现在测试的是isObjectExpression模块，
  {a,[c= {x: 2,[d]: 'f'}]: 2, b: 2 + e}
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
          d: function(f = 1,q = {x, ...g}){}
       }
     ]
   ],
   {}
  ]
  `,
  isParams: `
  // 现在测试的是isParams模块，
   a =[{[d]: s}], b,c={q:{x}}
  `,
  isDeclaration: `
  // 现在测试的是isDeclaration模块，
  const a = [
   {q: {t},x: [b]}
  ],b =2,c =3, d = e = 1
  `,
  isDeclarations: `
  // 现在测试的是isDeclarations模块，
   a = 1,c=f=b= 2, c=[{x:[]}]
  `,
  isVariableDeclarator: `
  // 现在测试的是isVariableDeclarator模块，
   a=[{x: 3 * [{a}]}]
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
    async function * _f1h(x=[{}], q= {x:[], ...y}) {
      const a = 1
      async function * x(a) {
         let b = {}
      }
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
  `
}