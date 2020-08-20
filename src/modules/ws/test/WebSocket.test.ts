import WS from 'jest-websocket-mock';

import WebSocketConnection from '../websocket';

const key = 'TEST_MESSAGE';
const invalidKey = 'INVALID_KEY';
const data = { test_message: 'hello world', test_message2: 'hello' };

const json = JSON.stringify({ action: key, payload: { ...data } });
const invalidJSON = JSON.stringify({ action: invalidKey, payload: { ...data } });

test('Mock WS connection: client send server message', async () => {
  WS.clean();
  const fakeURL = 'ws://localhost:1234';
  const mockServer = new WS(fakeURL);
  // await mockServer.connected;

  const wsConnection = new WebSocketConnection('username', () => {}, fakeURL);

  wsConnection.sendMessage(key, data);
  wsConnection.sendMessage(invalidKey, data);

  await expect(mockServer).toReceiveMessage(json);
  expect(mockServer).toHaveReceivedMessages([json]);

  WS.clean();
});

test('Mock WS Connection: Add listener and receive message', async () => {
  WS.clean();
  const fakeURL = 'ws://localhost:1234';
  const mockServer = new WS(fakeURL);
  // await mockServer.connected;

  const wsConnection = new WebSocketConnection('username', () => {}, fakeURL);

  const message: string[] = [];
  const callback = (mockData: unknown) => {
    const jsonString = JSON.stringify(mockData);
    message.push(jsonString);
  };

  const listenerAdded = wsConnection.addListener(key, callback);
  const sameListenerAddedInError = wsConnection.addListener(key, callback);

  expect(listenerAdded).toBeTruthy();
  expect(sameListenerAddedInError).toBeFalsy();

  mockServer.send(json);
  mockServer.send(invalidJSON);

  const receivedPayload = JSON.parse(json).payload;
  expect(message).toStrictEqual([JSON.stringify(receivedPayload)]);
});

test('Mock WS Connection: Add/Remove listener', async () => {
  WS.clean();
  const fakeURL = 'ws://localhost:1234';
  const mockServer = new WS(fakeURL);
  // await mockServer.connected;

  const wsConnection = new WebSocketConnection('username', () => {}, fakeURL);

  const message: string[] = [];
  const callback = (mockData: unknown) => {
    const jsonString = JSON.stringify(mockData);
    message.push(jsonString);
  };

  const listenerAdded = wsConnection.addListener(key, callback);
  expect(listenerAdded).toBeTruthy();

  const listenerRemoved = wsConnection.removeListener(key);
  const listenerAlreadyRemoved = wsConnection.removeListener(key);

  expect(listenerRemoved).toBeTruthy();
  expect(listenerAlreadyRemoved).toBeFalsy();

  mockServer.send(json);

  expect(message).toStrictEqual([]);
});
