import styled from "styled-components";

export const navBarStyled = {
  navBar:  styled.nav`
    background: #282c34;
    color:white;
    position: relative;
    font-size: 1.5em;
    padding: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 10vh;

    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      img {
        width: 50px;
        margin-right: auto; // Pushes everything else to the right
      }

      button {
        margin-left: 10px;
        padding: 10px;
        border-radius: 10px;
        border: 0;
        font-weight: bold;
      }

      a {
        margin-left: 10px;
        padding: 10px;
        border-radius: 10px;
        border: 0;
        font-weight: bold;
        text-decoration: none;
        color: black;
        background: rgb(239, 239, 239);
        font-size: 13px;
      }
    }
  `,
  
  PHContainer: styled.div `
    display: none;
    align-items: center;
    flex-direction: column;
  `
}
