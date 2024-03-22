import { Outlet, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store/store"
import { asyncUserActions, userSelector } from "../../store/user/user.slice"
import Welcome from "../welcome/welcome.component";
import logoImage from "../../assets/logo.png";
import { deviceTypeSelectors } from "../../store/deviceType/deviceType.slice";
import { navBarStyled } from "./navigation.styled";


const Navigation = () => {
  const appUser = useAppSelector(userSelector.selectUser);
  const isMobile = useAppSelector(deviceTypeSelectors.selectIsMobile);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(asyncUserActions.logout())
  }
    return (
      <>
        <navBarStyled.navBar>
          <div> 
            <img
              src={logoImage}
              onClick={() => {navigate("/")}}
              alt="MixPix"/> 
            <a target="new" href="/FAQ.html">FAQ</a>

            {appUser && (
                <>
                <button onClick={() => (navigate("/mymodel"))}>My Model</button>
                <button onClick={logout}>Logout</button>
                </>
              )
            }
          </div>
        </navBarStyled.navBar>
          
        {appUser && appUser.tosTS ? (
          <Outlet/>
        )
        : (
          <Welcome/>
        )
        }

      <navBarStyled.PHContainer>
        <a href="https://www.producthunt.com/posts/mixpix-ai?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-mixpix&#0045;ai" target="_blank" rel="noreferrer"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=439782&theme=dark" alt="MixPix&#0032;AI - Generate&#0032;photos&#0032;with&#0032;Instagram&#0032;AI&#0032;supermodels | Product Hunt"    width="250" height="54" /></a>
      </navBarStyled.PHContainer>

      </>
    )
}

export default Navigation