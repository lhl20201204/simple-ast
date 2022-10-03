const a = '{ aj_s_o111 }'.match(/^\{(\s[\w]*?\s)?\}$/)
const b = '{ const a = 1 }'.match(/^\{\s?(\s(.*?)\s)?\}$/)
const c = 'async function * jdfpasj ( g = 1 , { } , a = q = c = { b : [] } , { ac : qqqq , b = 1 , } , q ) { }'.replace(/\s/g,'$').match(/^(async\$)?function\$(\*\$)?([\w]*?\$)?\(\$?(\$(.*?)?\$)?\)\$\{\$?(\$(.*?)\$)?\}$/)
const d = 'async ( xxxx_h ) = > [ x ]'.replace(/\s/g,'$').match(/^(async\$)?((\(\$?(\$(.*?)?\$)?\))|([\w]*?))\$=\$>\$(\{\$?(\$(.*?)\$)?\}|\[\$?(\$(.*?)\$)?\]|\(\$\{\$?(\$(.*?)\$)?\}\$\))$/)

console.log(d)
