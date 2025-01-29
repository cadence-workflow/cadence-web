export default class GlobalRef<T> {
  private readonly sym: symbol;

  constructor(uniqueName: string, defaultValue?: T) {
    this.sym = Symbol.for(uniqueName);
    const g = global as any;
    if (g[this.sym] === undefined) g[this.sym] = defaultValue;
  }

  get value() {
    return (global as any)[this.sym] as T;
  }

  set value(value: T) {
    (global as any)[this.sym] = value;
  }
}
