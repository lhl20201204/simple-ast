import parse from "./parse"
export default function getAst(str) {
 const wordList = parse(str)

 return str
}