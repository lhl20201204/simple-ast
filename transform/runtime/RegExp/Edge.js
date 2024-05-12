export class Edge {
  constructor(start, acceptStr, end) {
    this.key = `${start.value} -> ${end.value}`
    this.start  = start;
    this.acceptStr = acceptStr;
    this.end = end;
  }

}