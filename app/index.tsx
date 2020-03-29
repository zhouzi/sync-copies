import * as React from "react";
import * as ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import { ApolloClient, InMemoryCache, HttpLink } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { App } from "./components";
import "modern-normalize/modern-normalize.css";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  link: new HttpLink({
    uri: "/graphql"
  })
});

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 16px;
  }

  body {
    font-size: 1rem;
    line-height: 1.5;
    font-family: 'Baloo Thambi 2', cursive;
    color: #bfd0e2;
    background-color: #0d1f31;
  }

  code,
  pre {
    font-family: 'Fira Mono', monospace;
  }
`;

ReactDOM.render(
  <ApolloProvider client={client}>
    <GlobalStyle />
    <App />
  </ApolloProvider>,
  window.document.getElementById("root")
);
