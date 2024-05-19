export type SubsciberCallback<T> = (value: T) => void;

export interface Subscription {
  unsubscribe(): void;
}

export interface Subscriber<T> {
  subscribe(cb: SubsciberCallback<T>): Subscription;
}

export interface Publisher<T> {
  publish(value: T): void;
}

export class PubSub<T> implements Subscriber<T>, Publisher<T> {
  private readonly _subscribers = new Set<SubsciberCallback<T>>();

  public publish(value: T): void {
    for (const subscriber of this._subscribers) {
      subscriber(value);
    }
  }

  public subscribe(cb: SubsciberCallback<T>): Subscription {
    this._subscribers.add(cb);

    return {
      unsubscribe: () => {
        this._subscribers.delete(cb);
      },
    };
  }
}
