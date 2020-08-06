import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

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

  const sendMessage = (): void => {
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
      <Input placeholder="Enter a Message" defaultValue={message} onChange={handleSetMessage} />
      <Button variant="contained" color="primary" onClick={sendMessage}>
        Send
      </Button>
    </div>
  );
};

export default SendMessageForm;
