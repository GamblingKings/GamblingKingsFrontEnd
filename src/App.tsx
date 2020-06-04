import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import About from './pages/About';
import Lobby from './pages/Lobby';

const something = 'hello';

function App(): JSX.Element {
  useEffect(() => {
    console.log(something);
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/aboutUs" component={About} />
        <Route exact path="/lobby" component={Lobby} />
      </Switch>
    </Router>
  );
}

export default App;
