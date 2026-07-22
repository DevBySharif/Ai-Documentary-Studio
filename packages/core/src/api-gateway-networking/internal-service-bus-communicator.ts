import { CommunicationPatternType } from "./gateway-networking-types";

export interface InternalMessagePacket {
  readonly messageId: string;
  readonly sourceService: string;
  readonly targetService: string;
  readonly pattern: CommunicationPatternType;
  readonly payloadJson: string;
  readonly timestamp: Date;
}

/**
 * Internal Service Bus & 3-Pattern Communicator (Vol 09 Part 02 - Section 5, Section 6).
 * Handles inter-service communication across `Synchronous` (Request-Response), `Asynchronous` (Event-Queue-Worker), and `EventDriven` (Pub/Sub) styles.
 */
export class InternalServiceBusCommunicator {
  private queue: InternalMessagePacket[] = [];

  public dispatchInternalMessage(
    sourceService: string,
    targetService: string,
    pattern: CommunicationPatternType,
    payloadObj: unknown
  ): InternalMessagePacket {
    const packet: InternalMessagePacket = {
      messageId: `msg_bus_${Math.random().toString(36).substring(2, 7)}`,
      sourceService,
      targetService,
      pattern,
      payloadJson: JSON.stringify(payloadObj),
      timestamp: new Date(),
    };

    if (pattern === "Asynchronous" || pattern === "EventDriven") {
      this.queue.push(packet);
    }

    return packet;
  }

  public getPendingQueueMessages(): ReadonlyArray<InternalMessagePacket> {
    return this.queue;
  }
}
