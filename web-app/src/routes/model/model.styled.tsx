import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px; // Adds nice padding around the container
  text-align: center;
  gap: 20px; // Adds space between elements inside the flex container
`;

export const BenefitsList = styled.ul `
text-align : left;
`;

export const InstaHandleInput = styled.input`
  font-size: 1em;
  padding: 0.2em;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
`
export const StyledCode = styled.code`
  background-color: #555555;
  padding: 8px;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
  display: block; // Or inline-block based on your layout
  margin: 10px 0;
  max-width: 100%;
  overflow-wrap: anywhere;
`;
