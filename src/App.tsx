import React, { useEffect } from 'react';

import Main from './pages/Main';

const something = 'hello';

function App(): JSX.Element {
  useEffect(() => {
    console.log(something);
  }, []);

  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;
