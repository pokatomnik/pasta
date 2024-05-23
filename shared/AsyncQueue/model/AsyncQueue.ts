export class AsyncQueue {
  #promise = Promise.resolve<unknown>(void 0);

  /**
   * Очередь запросов, в которой все задачи выполняются одна за другой,
   * исключая параллельность.
   *
   * ВНИМАНИЕ!
   * Нельзя делать так чтобы одна задача включала в себя другую,
   * иначе будет ситуация взаимной блокировки и обе задачи
   * "зависнут" без разрешения
   *
   * @param task Задача на исполнение
   * @returns результат выполненной задачи
   */
  public async pushAndGetResult<TResult>(
    task: () => Promise<TResult>,
  ): Promise<TResult> {
    const currentPromise = this.#promise;
    const newPromise = currentPromise.then(task);
    this.#promise = newPromise.catch(() => void 0);
    return await newPromise;
  }
}
