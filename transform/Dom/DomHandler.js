export class DomHandler {
  constructor({
    target,
    handler,
  }) {
    this.target = target;
    this.handler = handler;
  }

  equal(target, handler) {
    return this.target === target && this.handler === handler;
  }
}