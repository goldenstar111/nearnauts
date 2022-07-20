import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* --green: #6FD65E;
    --green-light: #D5FFCE;
    --pink: #EB5BEE;
    --pink-light: #feccff;
    --pink-lighter: #FFE5E5;
    --blue: #1472FF;
    --blue-light: #B6D3FF;
    --gray-darker: #808080;
    --gray-dark: #A7A7A7;
    --gray: #E0E0E0;
    --gray-light: #EDEDED;
    --gray-lighter: #F3F3F3;
    --gray-lighest: #F8F9FB;
    --black: #444444; */
    --purple: #250055;
    --plum-base: 22, 5, 84;
    --plum: rgb(var(--plum-base));
    --plum-light: #230887;
    --periwinkle-base: 130, 135, 255;
    --periwinkle: rgb(var(--periwinkle-base));
    --lavendar-base: 248, 221, 255;
    --lavendar: #d9d8f5;
    --pink: #7979ff;
    --background: #07061c;

    --background-dark: #1F043C;
    --bubble-gum-base: 255, 121, 237;
    --bubble-gum: rgb(var(--bubble-gum-base));

    --success: #110a68;
    --error-base: 255, 95, 95;
    --error: rgb(var(--error-base));

    --success-bg: #1F1C45;
    --error-bg: rgba(255, 0, 31, 0.1);

    --shadow-primary: 0 0 14px #4a4c99;
    --shadow-secondary: 0 0 14px rgba(186, 13, 215, 0.6);

    --radius-default: 8px;

    --font-primary: 'Futura Md BT', sans-serif;
    --font-secondary: 'Futura Md BT', sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    height: 100%;
    margin: 0;
    font-family: var(--font-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;

    background-color: var(--background);
    color: var(--lavendar);
  }

  #root {
    height: 100%;
  }

  .app {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .content {
    flex: 1 0 auto;
    margin-top: -93px;
    background-size: cover;
    background-attachment: fixed;
    
    .sticked-to-bottom {
      position: sticky;
      bottom: 0;
      z-index: 2;
    }

  }

  .portal-container {
    position: relative;
  }

  .footer {
    flex-shrink: 0;
  }

  a {
    color: var(--periwinkle);
    text-decoration: none;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
`;

export default GlobalStyle;
