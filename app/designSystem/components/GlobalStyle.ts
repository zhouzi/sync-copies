import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 16px;
  }

  body {
    font-size: 1rem;
    line-height: 1.5;
    font-family: ${(props) => props.theme.fontFamily.body};
    color: ${(props) => props.theme.colors.text.normal};
    background-color: ${(props) => props.theme.colors.background.normal};
  }

  code,
  pre {
    font-family: ${(props) => props.theme.fontFamily.code};
  }
`;

export default GlobalStyle;
