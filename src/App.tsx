import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import GameTest from './pages/GameTest';

import { CurrentUser } from './types';
import { WebSocketConnection } from './modules/ws';

const DEFAULT_USER = { username: '' } as CurrentUser;

function App(): JSX.Element {
  const [ws, setWs] = useState<WebSocketConnection | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(DEFAULT_USER);
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={() => <Main setWs={setWs} setCurrentUser={setCurrentUser} ws={ws} />} />
        <Route exact path="/lobby" component={() => <Lobby ws={ws} currentUser={currentUser} />} />
        <Route exact path="/game" component={() => <Game ws={ws} currentUser={currentUser} />} />
        <Route exact path="/gametest" component={() => <GameTest />} />
      </Switch>
    </Router>
  );
}

export default App;
