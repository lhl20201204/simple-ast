export default function checkLegal(ast){
  if(ast instanceof Error) {
    return false
  }
  return true;
}