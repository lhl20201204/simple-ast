const a = '{ aj_s_o111 }'.match(/^\{(\s[\w]*?\s)?\}$/)
const b = '{ const a = 1 }'.match(/^\{\s?(\s(.*?)\s)?\}$/)
const c = 'async function * jdfpasj ( g = 1 , { } , a = q = c = { b : [] } , { ac : qqqq , b = 1 , } , q ) { }'.replace(/\s/g,'$').match(/^(async\$)?function\$(\*\$)?([\w]*?\$)?\(\$?(\$(.*?)?\$)?\)\$\{\$?(\$(.*?)\$)?\}$/)
const d = 'async ( xxxx_h ) = > [ x ]'.replace(/\s/g,'$').match(/^(async\$)?((\(\$?(\$(.*?)?\$)?\))|([\w]*?))\$=\$>\$(\{\$?(\$(.*?)\$)?\}|\[\$?(\$(.*?)\$)?\]|\(\$\{\$?(\$(.*?)\$)?\}\$\))$/)
const e = 'window ? . [ \' console \' ] ? . log ( q )'.replace(/\s/g,'$').match(/\(\$?(\$(.*?)?\$)?\)$/)
const f = 'console [ x + 2 ]'.replace(/\s/g,'$').match(/\.\$|\[\$(.*?)\$\]/)
const g = 'if ( g = 1 , { } , a = q = c = { b : [] } , { ac : qqqq , b = 1 , } , q ) { }'.replace(/\s/g,'$').match(/^if\$\(\$?(\$(.*?)?\$)?\)\$\{\$?(\$(.*?)\$)?\}$/)
const h = 'a ? b : c + `f`'.replace(/\s/g,'$').match(/^([\s\S]*?)\$\?\$([\s\S]*?)\$\:\$([\s\S]*?)$/)
const i = 'for ( ; ; ) console .log (i)'.replace(/\s/g,'$').match(/^for\$\(\$?(\$([\s\S]*?)?\$)?\;\$?(\$([\s\S]*?)?\$)?\;\$?(\$([\s\S]*?)?\$)?\$?\)\$(\{\$?(\$([\s\S]*?)\$)?\})?([\s\S]*?)?$/)

console.log(i)

