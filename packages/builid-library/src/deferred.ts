export type Resolver<T> = (value: T) => void;
export type Rejecter<R> = (value: R) => void;

export function deferred<T, R>() {
  let resolve!: Resolver<T>;
  let reject!: Rejecter<R>;

  const promise = new Promise<T>((res: Resolver<T>, rej: Rejecter<R>) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}
