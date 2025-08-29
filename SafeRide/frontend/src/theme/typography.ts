import { createGlobalStyle } from 'styled-components';

const Typography = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0.5em 0;
  }

  h2 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0.5em 0;
  }

  h3 {
    font-size: 1.75rem;
    font-weight: 500;
    margin: 0.5em 0;
  }

  h4 {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0.5em 0;
  }

  h5 {
    font-size: 1.25rem;
    font-weight: 400;
    margin: 0.5em 0;
  }

  h6 {
    font-size: 1rem;
    font-weight: 400;
    margin: 0.5em 0;
  }

  p {
    margin: 0.5em 0;
  }

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  ul {
    list-style-type: disc;
    padding-left: 20px;
  }

  li {
    margin: 0.5em 0;
  }
`;

export default Typography;