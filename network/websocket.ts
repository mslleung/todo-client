import assert from 'assert';
import { NetMessage } from './protos/netMessage';
import { BehaviorSubject, Subject, filter, firstValueFrom } from 'rxjs';

let ws: WebSocket | undefined;

let wsOpenedSubject = new BehaviorSubject<boolean>(false);
let receivedMessageSubject = new Subject<NetMessage>();

export function connectWS() {
  if (!ws) {
    ws = new WebSocket(process.env.NEXT_PUBLIC_SERVER_ADDRESS!);
    ws.onmessage = async (event: MessageEvent) => {
      if (event.data instanceof Blob) {
        const arrayBuffer = await (event.data as Blob).arrayBuffer();
        const netMessage = NetMessage.fromBinary(new Uint8Array(arrayBuffer));
        console.log('received: ', netMessage);
        receivedMessageSubject.next(netMessage);
      } else if (event.data instanceof Buffer) {
        const netMessage = NetMessage.fromBinary(new Uint8Array(event.data));
        console.log('received: ', netMessage);
        receivedMessageSubject.next(netMessage);
      } else if (event.data instanceof String) {
        console.error(
          'Received text data from server instead of protobuf: ',
          event,
        );
      } else {
        console.error('Received unknown data from server: ', event.data);
      }
    };

    ws.onopen = () => {
      wsOpenedSubject.next(true);
    }
    // TODO connection retry
  }
}

export async function send(netMessage: NetMessage) {
  await firstValueFrom(wsOpenedSubject.pipe(filter((isOpen) => isOpen)))

  assert(ws);
  ws.send(NetMessage.toBinary(netMessage));

  return firstValueFrom(
    receivedMessageSubject.pipe(
      filter(
        (receivetNetMessage) =>
          receivetNetMessage.header!.requestUuid ===
          netMessage.header!.requestUuid,
      ),
    ),
  );
}
