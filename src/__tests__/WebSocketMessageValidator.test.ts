import SendMessageValidator from '../modules/ws/message_validator';

test('Valid Test Message', () => {
  const key = 'TEST_MESSAGE';
  const data = { test_message: 'hello world', test_message2: 'hello' };

  const validMessage = SendMessageValidator.validateMessage(key, data);
  expect(validMessage).toBeTruthy();
});

test('Invalid Test Message: not enough parameters', () => {
  const key = 'TEST_MESSAGE';
  const data = { test_message: 'hello world' };

  const validMessage = SendMessageValidator.validateMessage(key, data);
  expect(validMessage).toBeFalsy();
});

test('Invalid Test Message: too many parameters', () => {
  const key = 'TEST_MESSAGE';
  const data = { test_message: 'hello world', test_message2: 'hello', test_message3: 'hello' };

  const validMessage = SendMessageValidator.validateMessage(key, data);
  expect(validMessage).toBeFalsy();
});

test('Invalid Test Message: invalid key provided', () => {
  const key = 'INVALID_KEY';
  const data = { test_message: 'hello world', test_message2: 'hello', test_message3: 'hello' };

  const validMessage = SendMessageValidator.validateMessage(key, data);
  expect(validMessage).toBeFalsy();
});
