/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import MainThreeJSComponent from '../components/MainThreeJSComponent';
import AboutModal from '../components/main/about_modal';
import HowToPlayModal from '../components/main/how_to_play_modal';

import { WebSocketConnection, IncomingAction } from '../modules/ws';
import { CurrentUser, LoginSuccessJSON } from '../types';

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
  const [aboutModal, setAboutModal] = useState<boolean>(false);
  const [howToPlayModal, setHowToPlayModal] = useState<boolean>(false);
  const history = useHistory();

  /**
   * State Handlers.
   */
  const handleSetUsername = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
  };
  const toggleAboutModal = () => setAboutModal(!aboutModal);
  const toggleHowToPlayModal = () => setHowToPlayModal(!howToPlayModal);

  /**
   * Methods
   */
  const connect = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let websocket = null as unknown;
    const testfunc = (payload: unknown) => {
      setWs(websocket as WebSocketConnection);
      const data = payload as LoginSuccessJSON;
      const { success, error } = data;
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
    websocket = new WebSocketConnection(username, testfunc) as WebSocketConnection;
  };

  return (
    <div className="main-page flex-column justify-content-center">
      <div className="justify-content-center flex-row">
        <div className="background-color-white align-center margin-bottom-20 padding-20 text-align-center border-radius-5">
          <strong>
            <h1>Mahjong</h1>
          </strong>
          <MainThreeJSComponent />
          <form className="flex-column margin-20" onSubmit={connect}>
            <input
              value={username}
              onChange={handleSetUsername}
              className="margin-bottom-10 font-size-1rem padding-5"
              placeholder="Enter a name to start"
            />
            <input type="submit" value="Log in" className="background-color-primary button color-white padding-5" />
          </form>
        </div>
      </div>
      <footer className="flex-row justify-content-center">
        <div className="background-color-white padding-5 padding-left-10 padding-right-10">
          <p>
            <span onClick={toggleAboutModal} className="button">
              about
            </span>
            &nbsp;|&nbsp;
            <span onClick={toggleHowToPlayModal} className="button">
              how to play
            </span>
          </p>
        </div>
      </footer>
      {aboutModal && <AboutModal closeModal={toggleAboutModal} />}
      {howToPlayModal && <HowToPlayModal closeModal={toggleHowToPlayModal} />}
    </div>
  );
};

export default MainPage;
