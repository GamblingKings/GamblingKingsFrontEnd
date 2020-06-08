import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import About from './pages/About';
import Lobby from './pages/Lobby';

import WebSocketConnection from './modules/ws/websocket';
import { CurrentUser } from './types';

const DEFAULT_USER = { username: '' } as CurrentUser;

function App(): JSX.Element {
  const [ws, setWs] = useState<WebSocketConnection | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(DEFAULT_USER);
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={() => <Main setWs={setWs} setCurrentUser={setCurrentUser} />} />
        <Route exact path="/aboutUs" component={About} />
        <Route exact path="/lobby" component={() => <Lobby ws={ws} currentUser={currentUser} />} />
      </Switch>
    </Router>
  );
}

export default App;
