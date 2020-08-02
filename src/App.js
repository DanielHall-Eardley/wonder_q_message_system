import React, {Fragment} from 'react';

import Header from './components/header/Header'
import GenerateMessage from './components/message/GenerateMessage'
import MessageContainer from './components/message/MessageContainer'
import ErrorBoundary from './components/error/ErrorBoundary'

function App() {
  return (
    <Fragment>
      <Header/>
      <main>
        <ErrorBoundary>
          <GenerateMessage/>
          <MessageContainer/>
        </ErrorBoundary>
      </main>
    </Fragment>
  );
}

export default App;
