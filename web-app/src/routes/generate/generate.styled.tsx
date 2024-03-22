import styled, { css } from 'styled-components';

// Common button styles
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
`;


export const GenerateStyled = {
container: styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  height: 80vh;

  &.center-align {
    justify-content: center;
  }
`,

faceImage: styled.img`
  width: 150px; // Adjust size as needed
  height: 150px;
  border-radius: 10px;
  border: 1px solid #ccc;
  object-fit: cover;
  cursor: pointer; // Indicates the image is clickable
`,

imageContainer: styled.div`
  display: flex;
  align-items: center;
`,

closeButton: styled.button`
    position: absolute;
    top: -10px;
    right: 0;
    background: none;
    text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
    border: none;
    cursor: pointer;
    z-index: 10;
    font-size: xxx-large;
    font-weight: bold;
`,

individualImageContainer: styled.div`
  position: relative;
`,

imageLabel: styled.div`
  text-align: center;
`,

plusContainer: styled.p`
  padding: 0 10px 20px 10px;
  font-size: xxx-large;
  font-weight: bolder;
`,

loaderImage: styled.img`
  width: 50px; // Adjust size as needed
  height: auto;
`,

generatedImage: styled.img`
  width: 500px; // Adjust size as needed
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  border: 1px solid #ccc;
  cursor: pointer; // Indicates the image is clickable
`,

buttonContainer: styled.div`
  display: flex;
  justify-content: space-around; // This will space out the buttons evenly
  align-items: center; // This aligns the buttons vertically in the middle, if needed
  // Add padding, margins, or any other styles as needed
`,

tryAgainButton: styled.button`
  ${buttonStyles}
  // Add any specific styles for the TryAgainButton here, if needed
`,

downloadButton: styled.button`
  ${buttonStyles}
  // Add any specific styles for the TryAgainButton here, if needed
`,

// Styled component for an invisible file input
hiddenFileInput: styled.input`
  display: none;
`,

promptTextArea: styled.textarea`
  width: 80%; // Adjust width as needed
  height: 150px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`,

seedInput: styled.input`
  width: 150px;
  font-size: 1em;
  padding: 0.2em;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
`,

seedContainer: styled.div `
  display: flex;
`,

seedRefreshButton: styled.button`
${buttonStyles}
font-size: 2em;
padding: 0px 10px 5px ;
`,

generateButton: styled.button`
${buttonStyles}
`
}



export const SwitchContainer = styled.div`
  display: flex;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
`;

export const SwitchOption = styled.button`
  flex: 1;
  padding: 10px 20px;
  border: none;
  background-color: #f0f0f0;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:first-child {
    border-right: 1px solid #ccc;
  }

  &.active {
    background-color: #007bff;
    color: white;
  }
`;