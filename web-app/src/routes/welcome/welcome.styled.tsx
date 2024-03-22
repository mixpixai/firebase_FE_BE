import React from 'react';
import styled, { css } from 'styled-components';

const buttonStyles = css`
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px; // Adds a little space between buttons if they are side by side
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
  }

  &:disabled {
    opacity: 0.5
  }

  &.delete {
    background-color: #df0dc6;
  }
`;

// Styled components
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px; // Adds nice padding around the container
  text-align: center;
  gap: 20px; // Adds space between elements inside the flex container
`;

export const Warning = styled.h2`
  color:red;
`;

export const StyledParagraph = styled.p`
  font-size: 20px;
  margin: 0; // Removes default margin to allow for custom spacing with gap
`;

export const StyledVideo = styled.video`
  width: 700px;
  border-radius: 8px;
  max-width: 100%; // Ensures responsiveness
`;

export const StyledButton = styled.button`
${buttonStyles}
`;
