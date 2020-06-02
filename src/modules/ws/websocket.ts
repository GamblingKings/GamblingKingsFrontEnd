import SendMessageValidator from './message_validator';

interface WebSocketConnection {
  ws: WebSocket;
  sendMessage(key: string, data: Record<string, unknown>): void;
}

const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKETURL || '';

/**
 * Interface that the client can use for Websocket Connection.
 */
class WebSocketConnection {
  public constructor(url: string = WEBSOCKET_URL) {
    this.ws = new WebSocket(url);
    this.ws.onopen = (event) => {
      console.log(event);
      this.ws.send('');
    };

    this.ws.onclose = (event) => {
      console.log(event);
    };

    this.ws.onerror = (error) => {
      console.log(error);
    };

    this.ws.onmessage = (event) => {
      console.log(event);
    };
  }
}

/**
 * Sends a message to the backend if the message is validated.
 */
WebSocketConnection.prototype.sendMessage = function sendMessage(key: string, data: Record<string, unknown>): boolean {
  const validMessage = SendMessageValidator.validateMessage(key, data);
  if (validMessage) {
    const payload = { action: key, ...data };
    this.ws.send(JSON.stringify(payload));
    return true;
  }
  return false;
};

export default WebSocketConnection;
