import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import MainThreeJSComponent from '../components/MainThreeJSComponent';

import WebSocketConnection from '../modules/ws/websocket';
import { CurrentUser, LoginSuccessJSON } from '../types';
import IncomingAction from '../modules/ws/incoming_action';

type MainProps = {
  setWs: React.Dispatch<React.SetStateAction<WebSocketConnection | null>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser>>;
  ws: WebSocketConnection | null;
};

/**
 * Landing Page for the application.
 */
const MainPage = ({ setWs, setCurrentUser, ws }: MainProps): JSX.Element => {
  /**
   * States
   */
  const [username, setUsername] = useState<string>('');
  const history = useHistory();

  /**
   * State Handlers.
   */
  const handleSetUsername = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
  };

  /**
   * Methods
   */
  const connect = (event: React.FormEvent<HTMLInputElement>): void => {
    event.preventDefault();
    // TODO: prevent user from editing username when this process is happening
    const finalizeLogin = (payload: unknown): void => {
      const data = payload as LoginSuccessJSON;
      const { success, error } = data;
      console.log(data);
      if (success) {
        const user = {
          username,
        } as CurrentUser;
        setCurrentUser(user);
        ws?.removeListener(IncomingAction.LOGIN_SUCCESS);
        history.push('/lobby');
      } else {
        console.log(`LOGIN ERROR: ${error}`);
      }
    };
    const websocket = new WebSocketConnection(username, finalizeLogin);
    setWs(websocket);
  };

  return (
    <div className="main-page flex-column justify-content-center">
      <div className="justify-content-center flex-row">
        <div className="background-color-white align-center margin-bottom-20 padding-20 text-align-center border-radius-5">
          <strong>
            <h1>Mahjong</h1>
          </strong>
          <MainThreeJSComponent />
          <form className="flex-column margin-20">
            <input
              value={username}
              onChange={handleSetUsername}
              className="margin-bottom-10 font-size-1rem padding-5"
              placeholder="Enter a name"
            />
            <input
              type="submit"
              value="Play"
              onClick={connect}
              className="background-color-primary button color-white padding-5"
            />
          </form>
        </div>
      </div>
      <footer className="flex-row justify-content-center">
        <div className="background-color-white padding-5 padding-left-10 padding-right-10">
          <p>
            <Link to="/aboutus" className="color-black">
              about
            </Link>
            &nbsp;| how to play
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
