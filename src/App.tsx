import React from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppLayout from './components/AppLayout';

const client = new ApolloClient({
  uri: 'https://api.spacex.land/graphql/',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
          <AppLayout />
      </div>
    </ApolloProvider>
  );
}

export default App;
