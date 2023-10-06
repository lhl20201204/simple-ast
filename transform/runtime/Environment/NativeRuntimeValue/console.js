import { DEBUGGER_DICTS, JS_TO_RUNTIME_VALUE_TYPE, RUNTIME_VALUE_TYPE } from "../../constant";
import { createObject, getGenerateFn } from "../RuntimeValueInstance";
import parseRuntimeValue from "../parseRuntimeValue";

let consoleV;


export function getConsoleV(bool) {
  
    consoleV = createObject({});
    const generateFn = getGenerateFn()
    consoleV.setWithDescriptor('log', generateFn('console$log', (args) => {
      // console.log(args);
      const getType = (type, item) => {
        if ([
          RUNTIME_VALUE_TYPE.string,
          RUNTIME_VALUE_TYPE.boolean,
          RUNTIME_VALUE_TYPE.undefined,
          RUNTIME_VALUE_TYPE.symbol,
        ]) {
          return '%s';
        }
        if (type === RUNTIME_VALUE_TYPE.object) {
          return '%O'
        }
        if (type === RUNTIME_VALUE_TYPE.number) {
          return '%d'
        }

        console.error(item, type)
      }

      console.group('')
      const handleItem = rv => {
        const item = parseRuntimeValue(rv, { [DEBUGGER_DICTS.parseRuntimeValueDeepth]: 1, [DEBUGGER_DICTS.isOutputConsoleFlag]: true, });
        // console.log(item, '----')
        let tempProto
        if (_.isArray(item)) {
          console.group('array')
          _.map(item, handleItem)
          return console.groupEnd()
        }
        if (_.size(item) && _.isObject(item)) {
          // if (isUndefinedRuntimeValue(item?.getProto()))
          // console.error(item, isInstanceOf(rv, RuntimeRefValue))
          const outputValue = parseRuntimeValue(rv, {
            [DEBUGGER_DICTS.isOutputConsoleFlag]: true,
          });
          // const isOutputConsoleFlag = outputValue[DEBUGGER_DICTS.isOutputConsoleFlag]
          // console[isOutputConsoleFlag? 'groupCollapsed': 'group']('%c%s', 'color: green', isOutputConsoleFlag
          // ? outputValue.title
          // : ( getRuntimeValueCreateByClassName(rv) + '{}'))

          console.log(outputValue)
          // console.groupEnd()
          return;
        }
        // if (item && item[DEBUGGER_DICTS.isOutputConsoleFlag]) {
        //   console.groupCollapsed('%c%s', 'color: green', item.title)
        //   console.warn(item.content)
        //   console.groupEnd()
        //   return;
        // }

        if (JS_TO_RUNTIME_VALUE_TYPE(item) === RUNTIME_VALUE_TYPE.function) {
          // console.log(item.name)
          // console.groupCollapsed('%c%s', 'color: red','f ' + (item.name ?? '' ))
          console.log('%c%o', 'color: red', item)
          // console.groupEnd()
          return;
        }

        if (JS_TO_RUNTIME_VALUE_TYPE(item) === RUNTIME_VALUE_TYPE.object) {
          return console.log(item)
        }
        return console.log(`\x1B[96;100;4m${getType(JS_TO_RUNTIME_VALUE_TYPE(item), item)}`, item);
      };
      _.forEach(_.cloneDeep(args), handleItem)
      console.groupEnd()
    }))

    consoleV.setWithDescriptor('error', generateFn('console$error', (args) => {
      const newArr = _.map(args, item => {
        return parseRuntimeValue(item);
      })
      // 直接结构就行了
      console.error(..._.cloneDeep(newArr));
    }))

    consoleV.setWithDescriptor('warn', generateFn('console$warn', (args) => {
      const newArr = _.map(args, item => {
        return parseRuntimeValue(item);
      })
      // 直接结构就行了
      console.warn(..._.cloneDeep(newArr));
    }))
  
  return consoleV;
}