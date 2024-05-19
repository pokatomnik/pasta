import { Nullable } from "decorate";
import {
  Publisher,
  SubsciberCallback,
  Subscriber,
} from "shared/PubSub/model/PubSub.ts";

type BroadcastMessage<TMessage> = Readonly<{
  broadcasterId: string;
  broadcasterTypeId: string;
  message: TMessage;
}>;

export class Broadcaster<T = unknown> implements Publisher<T>, Subscriber<T> {
  private _id: Nullable<string> = null;

  private _broadcastChannel: Nullable<BroadcastChannel> = null;

  public constructor(
    /**
     * A unique name for this Broadcaster.
     */
    private readonly _name: string,
  ) {}

  private get id(): string {
    return this._id || (this._id = crypto.randomUUID());
  }

  private get broadcastChannel(): BroadcastChannel {
    return this._broadcastChannel ||
      (this._broadcastChannel = new BroadcastChannel(this._name));
  }

  private packMessage<TMessage>(message: TMessage): string {
    const BroadcastMessage: BroadcastMessage<TMessage> = {
      broadcasterId: this.id,
      broadcasterTypeId: this._name,
      message: message,
    };
    return JSON.stringify(BroadcastMessage);
  }

  private unpackMessage<TMessage>(message: string): BroadcastMessage<TMessage> {
    const broadcastMessage: BroadcastMessage<TMessage> = JSON.parse(message);
    return broadcastMessage;
  }

  public publish(data: T) {
    const message = this.packMessage(data);
    this.broadcastChannel.postMessage(message);
  }

  public subscribe(cb: SubsciberCallback<T>) {
    const listener = (event: MessageEvent<string>) => {
      const messageStr = event.data;
      const unpacked = this.unpackMessage<T>(messageStr);
      if (
        // Message from another tab
        unpacked.broadcasterId !== this.id &&
        // Type identifier matches
        unpacked.broadcasterTypeId === this._name
      ) {
        cb(unpacked.message);
      }
    };
    this.broadcastChannel.addEventListener("message", listener);

    return {
      unsubscribe: () => {
        this.broadcastChannel.removeEventListener("message", listener);
      },
    };
  }
}
