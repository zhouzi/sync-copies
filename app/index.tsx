import * as React from "react";
import * as ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  defaultDataIdFromObject
} from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { App } from "./components";
import { theme, GlobalStyle } from "./designSystem";
import "modern-normalize/modern-normalize.css";

const client = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: (object: any) =>
      object.basename
        ? `${object.__typename}:${object.basename}`
        : object.path
        ? `${object.__typename}:${object.path}`
        : defaultDataIdFromObject(object)
  }),
  connectToDevTools: true,
  link: new HttpLink({
    uri: "/graphql"
  })
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </ApolloProvider>,
  window.document.getElementById("root")
);
