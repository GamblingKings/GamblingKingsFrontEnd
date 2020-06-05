/**
 * Message Formats that the client is allowed to send.
 * key = $request.body.action
 * data = payload of the message
 *
 * Devs can add a their desired message to send to backend here.
 */
const MESSAGE_FORMATS: Record<string, string[]> = {
  TEST_MESSAGE: ['test_message', 'test_message2'],
  SET_USERNAME: ['username'],
  GAMES: ['name'],
  USERS: ['name'],
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
    const acceptedKeys = MESSAGE_FORMATS[key] || null;
    const passedKeys = Object.keys(data);

    if (acceptedKeys === null || passedKeys.length !== acceptedKeys.length) return false;

    let validMessage = true;
    passedKeys.forEach((passedKey: string) => {
      if (!acceptedKeys.includes(passedKey)) validMessage = false;
    });
    return validMessage;
  }
}

export default SendMessageValidator;
