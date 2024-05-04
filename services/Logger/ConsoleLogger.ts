import type { Logger } from "services/Logger/Logger.ts";
import { Provide } from "microdi";
import { BoundMethod } from "decorate";

@Provide()
export class ConsoleLogger implements Logger {
  private formatMessage(message: string) {
    return `[${new Date().toISOString}] ${message}`;
  }

  @BoundMethod
  public info(message: string): void {
    console.log(this.formatMessage(message));
  }

  @BoundMethod
  public warn(message: string): void {
    console.warn(this.formatMessage(message));
  }

  @BoundMethod
  public error(message: string): void {
    console.error(this.formatMessage(message));
  }
}
