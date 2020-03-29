import styled, { css } from "styled-components";

interface ButtonProps {
  variant?: "primary" | "secondary";
}

const Button = styled.button.attrs({ type: "button" })<ButtonProps>`
  font: inherit;
  color: inherit;
  background: transparent;
  border: 0;
  border-radius: 0;
  padding: 0;

  cursor: pointer;

  ${props => {
    switch (props.variant) {
      case "primary":
        return css``;
      default:
        return css``;
    }
  }}
`;

export default Button;
