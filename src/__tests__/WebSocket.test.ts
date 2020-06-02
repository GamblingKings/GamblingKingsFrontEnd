import WS from 'jest-websocket-mock';

import WebSocketConnection from '../modules/ws/websocket';

test('Mock ws connection', async () => {
  const fakeURL = 'ws://localhost:1234';
  const mockServer = new WS(fakeURL);
  // await mockServer.connected;

  const wsConnection = new WebSocketConnection(fakeURL);
  const key = 'TEST_MESSAGE';
  const data = { test_message: 'hello world', test_message2: 'hello' };
  wsConnection.sendMessage(key, data);
  const json = JSON.stringify({ action: key, ...data });

  await expect(mockServer).toReceiveMessage(json);
  expect(mockServer).toHaveReceivedMessages([json]);

  WS.clean();
});
