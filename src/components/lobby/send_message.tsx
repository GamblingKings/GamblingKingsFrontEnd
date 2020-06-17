import React, { useState } from 'react';
import WebSocketConnection from '../../modules/ws/websocket';
import OutgoingAction from '../../modules/ws/outgoing_action';
import { CurrentUser } from '../../types';

type SendMessageFormProps = {
  ws: WebSocketConnection | null;
  currentUser: CurrentUser;
};

/**
 * Form Component used to send message to WebSocket to all clients.
 */
const SendMessageForm = ({ ws, currentUser }: SendMessageFormProps): JSX.Element => {
  const [message, setMessage] = useState<string>('');

  const handleSetMessage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  const sendMessage = (event: React.FormEvent<HTMLInputElement>): void => {
    event.preventDefault();
    const payload = {
      message,
      username: currentUser.username,
    };

    if (ws) {
      ws.sendMessage(OutgoingAction.SEND_MESSAGE, payload);
      setMessage('');
    } else {
      // TODO: handling of client that has been disconnected from WS
    }
  };

  return (
    <div>
      <p>Send Message</p>
      <form>
        <input value={message} onChange={handleSetMessage} />
        <input type="submit" value="Send" onClick={sendMessage} />
      </form>
    </div>
  );
};

export default SendMessageForm;
