/* eslint-disable react/jsx-pascal-case */
import { StyledButton } from "../welcome/welcome.styled";
import { BenefitsList, Container, InstaHandleInput, StyledCode } from "./model.styled";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { userSelector } from "../../store/user/user.slice";
import { useEffect, useRef, useState } from "react";
import { GenerateStyled } from "../generate/generate.styled";
import { modelAsyncActions, modelSelector } from "../../store/model/model.slice";
import { useNavigate } from "react-router-dom";

enum ScreenName {
    welcome,
    applyModel,
    manageModel,
    verificationInstructions,
    verificationFailed,
    loading,
}

const getCompressedData = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function() {
        // Create a canvas with reduced size
        const canvas = document.createElement('canvas');
        const maxWidth = 1024; // Max width for the image
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to base64
        const dataUrl = canvas.toDataURL('image/jpeg');
        resolve(dataUrl);
    };
    img.src = src;
  });
}

const copyToClipboard = (text:string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Code copied to clipboard!');
    }, (err) => {
      console.error('Failed to copy: ', err);
    });
  };

export const Model = () => {
    const [src, setSrc] = useState('');
    const [userName, setUserName] = useState("");
    const [tosAccepted, setTOSAccepted] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [screenName, setScreenName] = useState(ScreenName.welcome);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const handleImageUpload = (event:any) => {
        const file = event.target.files[0];
        if (file && file.type.substr(0, 5) === 'image') {
          setSrc(URL.createObjectURL(file));
        } else {
          setSrc('');
        }
    };
      
    const triggerFileInput = () => {
      fileInputRef.current?.click(); // Simulates click on the hidden file input
    };

    const appUser = useAppSelector(userSelector.selectUser);
    const modelData = useAppSelector(modelSelector.selectAll);


    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(modelAsyncActions.getModel({}))
    }, [])

    useEffect(() => {
       if (modelData.isLoading) {
        setScreenName(ScreenName.loading);
        return;
       }
       if (!modelData.model || Object.keys(modelData.model).length === 0) {
        if (showWelcome) {
            setScreenName(ScreenName.welcome)
            return;
        } 
        setScreenName(ScreenName.applyModel)
        return; 
       }
       if (modelData.model.verificationStatus === "complete" ) {
          modelData.model.isVerified ? setScreenName(ScreenName.manageModel): setScreenName(ScreenName.verificationFailed)
          return;
       }
       setScreenName(ScreenName.verificationInstructions)
    }, [modelData, showWelcome])


    const addModel = async () => {
        const faceImage = await getCompressedData(src)
        dispatch(modelAsyncActions.addModel({userName, faceImage}))
    }

    const welcomeScreen = <>
        <h2> Onboard your AI super model </h2>
        <h3> Benefits </h3>
        <BenefitsList> 
            <li>Easy way for your followers to click a photo with your model.</li>
            <li>Increase your following and presence.</li>
            <li>Keep your users more engaged.</li>
            <li>Its <b>FREE</b> for a limited time!!!</li>
        </BenefitsList>
        <h3> Requirements </h3>
        <BenefitsList> 
            <li>Only AI generated people are allowed. Real people are not allowed.</li>
            <li>Need to have significant instagram presence. We don't want spammy accounts.</li>
            <li>Must be a singular account. Grouped promotional accounts are not supported.</li>
        </BenefitsList>

        <StyledButton onClick={() => { setShowWelcome(false) }}> Start NOW !! </StyledButton>
    </>;

    const applyScreen =
    <>
        <h3>Model Onboarding Form</h3>

        <p>1. Provide your Model's Instagram handle</p>
        <InstaHandleInput type="text" 
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder='eg: vihana_adani'
        />

        <p>2. Add Model Face Image (only headshot, no body, aspect ratio 1:1)</p>
        <GenerateStyled.faceImage 
                src={src || "https://pub-a9cd5deb9a674cf781fe4e56075c4c4d.r2.dev/headshot.jpg"} // Placeholder or the uploaded image
                alt="Input Face Image"
                onClick={triggerFileInput} />
        <GenerateStyled.hiddenFileInput
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*" // Accepts only image files
        />

        <p>3. Agree to TOS</p>
        <div onClick={(e) => { 
            if (e.target) {
                console.log(e.target);
            }
            setTOSAccepted(!tosAccepted)
        }}>
            <input type="checkbox" checked={tosAccepted} /> <span>I agree to <a id="no-tap" href="/aiTOS.html">AI Model TOS</a></span>
        </div>

        <StyledButton disabled={!(src && userName && tosAccepted)} onClick={addModel} > Apply for Verification </StyledButton>
    </>;

    const loadingScreen = <><h2>Loading...</h2></>;

    const verficationInstructionsScreen = <>
        <h2>!! IMPORTANT !!</h2>
        <p> Please DM this verification code to <a href="https://instagram.com/mixpix_ai">mixpix_ai</a> from <a href={`https://instagram.com/${modelData.model?.instaUserName}`}>{modelData.model?.instaUserName}</a> on Instagram</p>
        <StyledCode>{`mixpix: ${modelData.model?.compositeCode}`} 
            <div><StyledButton onClick={() => copyToClipboard(`mixpix: ${modelData.model?.compositeCode}`)}>Copy Code</StyledButton></div>
        </StyledCode>
        <p>If already done then please wait for 24 hours for the verification to complete</p>
        <StyledButton onClick={() => {navigate("/")}}>Go to home</StyledButton>
        <StyledButton className="delete" onClick={() => {dispatch(modelAsyncActions.deleteUserModels({}))}}>Withdraw Application</StyledButton>
    </>

    const manageModelScreen = <> 
        <h3>Congratualtions your model is LIVE !!</h3> 
        <GenerateStyled.faceImage 
            src={modelData.model?.publicURL ?? ""} // Placeholder or the uploaded image
            alt="Input Face Image"/>
        <p>Here is your mixpix URL. Share it with your followers to allow them to generate pics with you. </p>
        <a href={`https://mixpix.ai/model/${modelData.model?.instaUserName}`}>{`https://mixpix.ai/model/${modelData.model?.instaUserName}`}</a>
        <StyledButton onClick={() => {document.location.href = `https://mixpix.ai/model/${modelData.model?.instaUserName}`}}>Try it now</StyledButton>
        <StyledButton className="delete" onClick={() => {dispatch(modelAsyncActions.deleteUserModels({}))}}>Delete</StyledButton>
    </>

    const verificationFailedScreen = <> 
        <h2> Oops Verification Failed !</h2> 
        <GenerateStyled.faceImage 
            src={modelData.model?.facePhoto_base64 ?? ""} // Placeholder or the uploaded image
            alt="Input Face Image"/>
        <a href={`https://instagram.com/${modelData.model?.instaUserName}`}>{modelData.model?.instaUserName}</a>

        <h4>Reason</h4>
        <StyledCode>
           {JSON.stringify(modelData.model?.verificationObject, null, "  ")}
        </StyledCode>
        
        <p> Feel free to delete and re-apply with the fixed issues. </p>
        <StyledButton onClick={() => {navigate("/")}}>Go to home</StyledButton>
        <StyledButton className="delete" onClick={() => {dispatch(modelAsyncActions.deleteUserModels({}))}}>Delete</StyledButton>
    </>

    return (
        <Container>
            {screenName === ScreenName.loading && loadingScreen}
            {screenName === ScreenName.welcome && welcomeScreen}
            {screenName === ScreenName.applyModel && applyScreen}
            {screenName === ScreenName.manageModel && manageModelScreen}
            {screenName === ScreenName.verificationFailed && verificationFailedScreen}
            {screenName === ScreenName.verificationInstructions && verficationInstructionsScreen}
        </Container>
    )
}