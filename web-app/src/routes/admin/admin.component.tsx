/* eslint-disable react/jsx-pascal-case */
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/store"
import { adminAsyncAction, adminSelector } from "../../store/admin/admin.slice";
import { userSelector } from "../../store/user/user.slice";
import { StyledInput, Container } from "./admin.styled";
import { StyledButton } from "../welcome/welcome.styled";
import { VerificationObject } from "../../utils/network/api.utils";
import { GenerateStyled } from "../generate/generate.styled";


enum ScreenName {
    loading,
    noAccess,
    inputForm,
    verifyForm,
}

export const Admin = () => {

    const dispatch = useAppDispatch();
    const appUser = useAppSelector(userSelector.selectUser);
    const adminState = useAppSelector(adminSelector.selectAll);

    const [userName, setUserName] = useState("")
    const [compositeCode, setCompositeCode] = useState("")
    const [verificationObject, setVerificationObject] = useState({
        faceMatch: false,
        properHeadShot: false,
        establishedProfile: false,
        isAIModel: false,
        other: null,
      } as VerificationObject)

    const [screenName, setScrenName] = useState(ScreenName.loading);

    const fetchUser = (userName:string, compositeCode:string) => {
      dispatch(adminAsyncAction.getModelUserAsAdmin({compositeCode, userName}))
    }

    const verifyUser = (verificationObject: VerificationObject, modelUid: string) => {
      dispatch(adminAsyncAction.verifyUser({modelUid, verificationObject}))
    } 

    useEffect(() => {
        if (!appUser?.isAdmin) {
            setScrenName(ScreenName.noAccess);
            return;
        }
        if (adminState.isLoading) {
            setScrenName(ScreenName.loading);
            return;
        }
        if (!adminState.userData) {
            setScrenName(ScreenName.inputForm);
            return;
        }
        setScrenName(ScreenName.verifyForm);
    }, [appUser,adminState])

    useEffect(() => {
        if (adminState.userData?.verificationObject) {
            setVerificationObject(adminState.userData?.verificationObject)
        }
    }, [adminState])

    const noAccessScreen = (
        <>
            <h2>Sorry only Admins are allowed here</h2>
        </>
    )   

    const loadingScreen = (
        <>
            <h2>Loading ...</h2>
        </>
    )
    
    const inputFormScreen = (
        <>
           <h2>Admin Form</h2>
           <StyledInput type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder='Instagram Handle'
            />
            <StyledInput type="text" 
                value={compositeCode}
                onChange={(e) => setCompositeCode(e.target.value)}
                placeholder='Composite Code'
            />

            <StyledButton onClick={() => { fetchUser(userName, compositeCode) }}> Fetch User </StyledButton>
            
            {adminState.error && <p> ERROR: {adminState.error} </p> }
        </>
    )

    const verifyFormScreen = (
        <>
           <h2>Verify User</h2>
           
           <GenerateStyled.faceImage 
                src={`${adminState.userData?.facePhoto_base64}`} // Placeholder or the uploaded image
                alt="User Face Image"/>

            <a href={`https://instagram.com/${adminState.userData?.instaUserName}`} target="blank">{adminState.userData?.instaUserName}</a>

            <ul>
                <li onClick={(e) => {
                    const newObject = {...verificationObject}
                    newObject.faceMatch = !newObject.faceMatch
                    setVerificationObject(newObject)
                }}> <input type="checkbox" checked={verificationObject.faceMatch} /> <span> Face Match </span>
                </li>
                <li onClick={(e) => {
                    const newObject = {...verificationObject}
                    newObject.establishedProfile = !newObject.establishedProfile
                    setVerificationObject(newObject)
                }}> <input type="checkbox" checked={verificationObject.establishedProfile} /> <span> Established Profile </span>
                </li>
                <li onClick={(e) => {
                    const newObject = {...verificationObject}
                    newObject.isAIModel = !newObject.isAIModel
                    setVerificationObject(newObject)
                }}> <input type="checkbox" checked={verificationObject.isAIModel} /> <span> Is AI Model </span>
                </li>
                <li onClick={(e) => {
                    const newObject = {...verificationObject}
                    newObject.properHeadShot = !newObject.properHeadShot
                    setVerificationObject(newObject)
                }}> <input type="checkbox" checked={verificationObject.properHeadShot} /> <span> Proper headshot </span>
                </li>
                <li><p>STATUS : {adminState.userData?.verificationStatus}</p></li>
            </ul>
            <StyledButton onClick={() => { verifyUser(verificationObject, adminState.userData?.uid ?? "") }}> Verify User </StyledButton>

            {adminState.error && <p> ERROR: {adminState.error} </p> }

        </>
    )


    return (
        <Container>
            {screenName === ScreenName.loading && loadingScreen}
            {screenName === ScreenName.inputForm && inputFormScreen}
            {screenName === ScreenName.noAccess && noAccessScreen}
            {screenName === ScreenName.verifyForm && verifyFormScreen}
        </Container>
    )
}