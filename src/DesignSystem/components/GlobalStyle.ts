import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    html {
        font-size: 16px;
    }

    body {
        font-size: 1rem;
        font-family: 'Open Sans', sans-serif;
        line-height: 1.5;
        color: #272b3e;
        background-color: #eff2fc;
    }

    pre,
    code {
        font-family: 'Fira Mono', monospace;
        font-size: 0.8em;
    }
`;

export default GlobalStyle;
