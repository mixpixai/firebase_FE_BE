import { useNavigate } from "react-router-dom"
import { signInWithGooglePopup } from "../../utils/firebase/firebase.utils"
import { useAppDispatch, useAppSelector } from "../../store/store"
import { asyncUserActions, userActions, userSelector } from "../../store/user/user.slice"
import { Container, StyledButton, StyledParagraph, StyledVideo, Warning } from "./welcome.styled"
import { useState } from "react"


const Welcome = () => {

    const [isAdultCheck, setIsAdultCheck] = useState(false);
    const dispatch = useAppDispatch();
    const appUser = useAppSelector(userSelector.selectUser)
    const signIn = async () => {
      await signInWithGooglePopup()
    }
    const acceptTOS = () => {
      dispatch(asyncUserActions.updateTOS(true))
    }
    const acceptAdult = () => {
      setIsAdultCheck(true);
    }

    return (
      <div className="App">
        
        {!appUser && 
        <Container>
          <StyledParagraph>Easily Generate Photos with AI models for FREE!</StyledParagraph>
          <StyledVideo autoPlay muted playsInline>
            <source src="https://pub-a9cd5deb9a674cf781fe4e56075c4c4d.r2.dev/mixpixai.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </StyledVideo>
          <StyledButton onClick={signIn}>Sign In - Google</StyledButton>
        </Container>
        }

        {(appUser) && 
          <Container>
            <StyledParagraph>Welcome {(appUser?.name ?? "").split(" ")[0]}</StyledParagraph>
            {!isAdultCheck && 
              <>
                <Warning>WARNING !</Warning>
                <StyledParagraph>We use Stable diffusion for generating images and sometimes it can generate (Not safe for work) NSFW images</StyledParagraph>
                <StyledButton onClick={acceptAdult}>I am above 18</StyledButton>
              </>
            }
            {isAdultCheck  &&
              <>
                <h2> Almost there ! </h2>
                <StyledParagraph> I understand and accept the  </StyledParagraph>
                <a href="https://mixpix.ai/userTOS.html">Terms of service</a>
                <StyledButton onClick={acceptTOS}>Accept TOS</StyledButton>
              </>
            }
          </Container>
        }
          
      </div>
    )
  }

export default Welcome