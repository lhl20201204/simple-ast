



export const input = `
const a = 1
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
const q = 'dfsddf',a_B_133 = b + 1 + 2.12342398423 * (12 / 4), dl = 3 + 3
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

if (a && b || c) {
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

function * a(){
  yield sleep?.()
}
`
export const textList = {
  nullText: (x) =>  `// 现在测试的是${x}模块，没有对应的测试文本,请自行在下方添加
   `,
  isProgram: input,
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
           c: {}
        }
      ]
    ],
    {}
   ]
  `
}