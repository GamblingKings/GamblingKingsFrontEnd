import SendMessageValidator from './message_validator';
import { ReceivedJSON } from '../../types';
import OutgoingAction from './outgoing_action';

const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKETURL || '';

/**
 * Interface that the client can use for Websocket Connection.
 */
class WebSocketConnection {
  private ws: WebSocket;

  private listeners: Record<string, (payload: unknown) => void> = {};

  public constructor(username: string, callback: () => void, url: string = WEBSOCKET_URL) {
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      console.log('Socket opened!');
      const data = {
        username,
      };
      this.sendMessage(OutgoingAction.SET_USERNAME, data);
      callback();
    };

    this.ws.onclose = (event) => {
      console.log(event);
    };

    this.ws.onerror = (error) => {
      // TODO: Build common logger
      console.log(error);
    };

    this.ws.onmessage = (message) => {
      let data: ReceivedJSON;
      try {
        data = JSON.parse(message.data);
        console.log(`Received msg: ${message.data}`);
      } catch (err) {
        console.log(err);
        console.log('Incoming message must be a JSON.');
        return;
      }
      const { action, payload } = data;

      if (action in this.listeners) this.listeners[action](payload);
    };
  }

  /**
   * Sends a message to the backend if the message is validated.
   */
  public sendMessage(key: string, payload: Record<string, unknown>): boolean {
    const validMessage = SendMessageValidator.validateMessage(key, payload);
    console.log(validMessage);
    if (validMessage) {
      const data = JSON.stringify({ action: key, payload });
      console.log(`Sent msg: ${data}`);
      this.ws.send(data);
      return true;
    }
    return false;
  }

  /**
   * Adds a listener to the WebSocketConnection so client can act upon backend messages.
   * @param key a string, unique identifier to a callback
   * @param callback a function that client can act on
   * @returns a boolean whether the listener was successfully added
   */
  public addListener(key: string, callback: (payload: unknown) => void): boolean {
    if (key in this.listeners) return false;

    this.listeners[key] = callback;
    return true;
  }

  /**
   * Removes a listener from WebSocketConnection so the client does not need to act upon backend messages.
   * @param key a string, unique identifier to the listener
   * @returns a boolean whether the listener was successfully removed
   */
  public removeListener(key: string): boolean {
    if (key in this.listeners) {
      delete this.listeners[key];
      return true;
    }
    return false;
  }
}

export default WebSocketConnection;
