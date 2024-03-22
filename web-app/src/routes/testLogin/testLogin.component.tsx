/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/store"
import { asyncUserActions, userSelector } from "../../store/user/user.slice"
import { useNavigate } from "react-router-dom"
import { GenerateStyled } from "../generate/generate.styled"
import { navBarStyled } from "../navigation/navigation.styled";
import logoImage from "../../assets/logo.png";



const TestLogin = () => {

  const appUser =  useAppSelector(userSelector.selectUser)
  const fullUser = useAppSelector(userSelector.selectFullUser)
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState("")

  const initiateTempLogin = () => {
    dispatch(asyncUserActions.loginAsTestUser(password))
  }


  useEffect(() => {
    if (appUser) {
        navigate("/");
    }
  }, [appUser])

  return (
    <>
        <navBarStyled.navBar>
          <div> 
            <img
              src={logoImage}
              onClick={() => {navigate("/")}}
              alt="MixPix"/> 
            <a target="new" href="/FAQ.html">FAQ</a>

          </div>

        </navBarStyled.navBar>

        <>
          <GenerateStyled.container>
            <h2> Test Login </h2>
            {fullUser.isLoading && <h2> Loading ... </h2>}
            {!fullUser.isLoading && 
            <>
            <GenerateStyled.seedInput
                          value={password}
                          placeholder="Secret password"
                          onChange={(e) => { setPassword(e.target.value) } } />
            <GenerateStyled.generateButton onClick={initiateTempLogin}> Login </GenerateStyled.generateButton>
            </>
            }
          </GenerateStyled.container>
        </>
    </>

    )
}

export default TestLogin