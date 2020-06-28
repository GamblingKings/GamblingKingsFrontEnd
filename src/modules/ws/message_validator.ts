import OutgoingAction from './outgoing_action';

/**
 * Message Formats that the client is allowed to send.
 * key = $request.body.action
 * data = payload of the message
 *
 * Devs can add a their desired message to send to backend here.
 */
const MESSAGE_FORMATS: Record<string, string[]> = {
  TEST_MESSAGE: ['test_message', 'test_message2'],
  [OutgoingAction.SET_USERNAME]: ['username'],
  [OutgoingAction.GET_ALL_USERS]: [],
  [OutgoingAction.GET_ALL_GAMES]: [],
  [OutgoingAction.CREATE_GAME]: ['game'],
  [OutgoingAction.SEND_MESSAGE]: ['message', 'username'],
  [OutgoingAction.JOIN_GAME]: ['gameId'],
  [OutgoingAction.LEAVE_GAME]: ['gameId'],
  [OutgoingAction.START_GAME]: ['gameId'],
  [OutgoingAction.GAME_PAGE_LOAD]: ['success'],
};

/**
 * WebSocket Message Validator.
 * Validates the message sent by the client to enforce consistency in code format.
 * Does not prevent messages with malicious intent from being sent if user has access to websocket object.
 */
class SendMessageValidator {
  /**
   * Validates the payload based on the key and data provided.
   * @param key a string, used for routes parsing on backend
   * @param data an object, payload of the message
   */
  static validateMessage(key: string, data: Record<string, unknown>): boolean {
    const acceptedKeys = MESSAGE_FORMATS[key];
    const passedKeys = Object.keys(data);

    if (!acceptedKeys || passedKeys.length !== acceptedKeys.length) return false;

    let validMessage = true;
    passedKeys.forEach((passedKey: string) => {
      if (!acceptedKeys.includes(passedKey)) validMessage = false;
    });
    return validMessage;
  }
}

export default SendMessageValidator;
