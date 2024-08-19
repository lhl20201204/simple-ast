import { DivLike } from "../Dom";
import CanvasContext from "../Dom/CanvasContext";
import { totalReactionList } from "../Dom/observer";
import { runInAction } from "../Dom/Reaction";
import { nextTick } from "../Dom/util";

const container = document.getElementById('domTest');
const ctx = container.getContext('2d');
// 后续改成witdh 100%； 监听watchable 让他响应式布局
const documentBody = new DivLike({
  width: 100,
  height: 100,
  left: 0,
  top: 0,
  background: 'black'
})

function logTree(tree) {
  return _.map(tree, c => {
    return {
      label: c.id,
      flag: c.flag,
      children: logTree(c.children)
    }
  })
}

function debuggerTree(...fff) {
  nextTick(() => {
    console.log(runInAction(() => logTree([documentBody])[0]), ...fff)
  })
}

export function waitFor(cb, time = 1000) {
  const x = new Promise((r) => {
    const fn = (res) => {
      setTimeout(() => {
        r(cb(res))
      }, time)
    }
    if (this?.then) {
      this.then(fn)
    } else {
      fn();
    }
  });
  x.waitFor = waitFor;
  return x;
}

export function renderDom() {
  documentBody.render(new CanvasContext(ctx));
  const child = new DivLike({
    left: 80,
    top: 90,
    width: 80,
    height: 80,
    background: 'red'
  });

  const child2 = new DivLike({
    left: 680,
    top: 90,
    width: 80,
    height: 80,
    background: 'purple'
  });

  const child3 = new DivLike({
    left: 5,
    top: 5,
    width: 10,
    height: 10,
    background: '#676767'
  });

  child2.appendChild(child3)

  const child4 = new DivLike({
    left: 480,
    top: 5,
    width: 10,
    height: 10,
    background: '#676767'
  });

  child3.appendChild(child4)
  child3.removeChild(child4)
  child3.appendChild(child4)
  // debuggerTree();
  waitFor(() => {
    documentBody.style.left = 200;
    documentBody.style.height = 300;
    // 直到下个微任务开始前， 实际的数据还没变更。
    container.scrollIntoView()
    // setInterval(() => {
      // documentBody.style.left += 20;
    // }, 200)
  })
    // .waitFor(() => {
    //   documentBody.style.left = 400;
    //   documentBody.style.top = 300;
    // })
    // .waitFor(() => {
    //   documentBody.style.left = 700;
    // })
    // .waitFor(() => {
    //   documentBody.style.background = 'yellow'
    //   documentBody.appendChild(child, child2)
    //   debuggerTree()
    // })
    // .waitFor(() => {
    //   child.appendChild(child2)
    //   debuggerTree()
    // })
    // .waitFor(() => {
    //   child2.style.width = 400;
    //   child2.style.height = 40;
    //   child2.style.background = 'orange'
    //   documentBody.appendChild(child2)
    //   child2.appendChild(child)
    //   documentBody.style.background = 'green';
    //   debuggerTree()
    // })
    // .waitFor(() => {
    //   child2.style.background = 'black';
    // })
    // .waitFor(() => {
    //   child.style.left = 0;
    //   child3.removeChild(child4)
    //   child2.style.background = 'grey';
    //   child3.style.background = 'red'
    //   debuggerTree()
    //   // 没有重新渲染。。。
    // })
    // .waitFor(() => {
    //   child4.style.left -= 100;
    //   child2.appendChild(child4);
    //   debuggerTree()
    // })
    // .waitFor(() => {
    //   child3.style.left -= 100;
    // })
    // .waitFor(() => {
    //   documentBody.style.top += 100;
    //   child.style.height = 90;
    //   child2.style.top += 5;
    //   child3.style.width -= 80
    //   child4.style.background = 'green'
    // })
    // .waitFor(() => {
    //   child3.style.width += 280
    // })
    .waitFor(() => {
      console.log([...totalReactionList], documentBody);
    })
}




