export default class CommitLog<T> {
  constructor(readonly history: T[], readonly head: number) {}

  static create<T>(head: T): CommitLog<T> {
    return new CommitLog<T>([head], 0);
  }

  get current(): T {
    return this.history[this.head];
  }

  get hasPrev(): boolean {
    return this.head != 0;
  }

  get hasNext(): boolean {
    return this.head != this.history.length - 1;
  }

  goBack(): CommitLog<T> {
    return new CommitLog(this.history, Math.max(this.head - 1, 0));
  }

  goForward(): CommitLog<T> {
    return new CommitLog(this.history, Math.min(this.head + 1, this.history.length - 1));
  }

  commit(value: T, limit = Infinity): CommitLog<T> {
    return new CommitLog(
      [...this.history.slice(Math.max(0, this.head + 2 - limit), this.head + 1), value],
      Math.min(this.head + 1, limit - 1)
    );
  }
}
