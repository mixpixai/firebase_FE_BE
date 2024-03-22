/* eslint-disable react/jsx-pascal-case */
import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { GenerateStyled } from './generate.styled';
import { imageGeneratorAsyncActions, imageGeneratorSelector } from '../../store/imageGenerator/imageGenerator.slice';
import { ComfyUIRequest, WorkflowType } from '../../utils/network/api.utils';
import loaderImage from "../../assets/loader.png";
import { userSelector } from '../../store/user/user.slice';
import { useNavigate } from 'react-router-dom';

enum ViewTypes {
  input,
  output,
  loading,
}
const basePrompt = "Handsome dude, Beautiful girl, jeans, dress, garden, roses, bright colors, perfect, professional, extremely detailed, innocent, shining light, sharp focus, cool, highly intricate, fine detail, elegant, complex, color, radiant, vibrant, magical, clear, aesthetic, glossy, inspired, pretty, illuminated, incredible"
const Generate = () => {
    const dispatch = useAppDispatch();
    const [prompt, setPrompt] = useState(basePrompt); // For the text area input
    const [seed, setSeed] = useState(Math.floor(Math.random() * 10000000));
    const [src, setSrc] = useState('');
    const [useModel, setUseModel] = useState(true);
    const [useFace, setUseFace] = useState(true);
    const [forceInputView, setForceInputView] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageGenObj = useAppSelector(imageGeneratorSelector.selectAll);
    const model = useAppSelector(userSelector.selectModel);
    const navigate = useNavigate();

    const getViewType = (imageGenObj:any, forceInput: boolean) => {
      if (imageGenObj.isLoading) {
        return ViewTypes.loading
      }
      if (imageGenObj.outputImagebase64String && !forceInput) {
        return ViewTypes.output
      }
      return ViewTypes.input
    }

    const handleDownloadImage = async () => {
      // Create a temporary anchor (link) element
      const link = document.createElement("a");
      // Set the download attribute to the desired file name
      link.download = "generated-image.png";
      
      // Convert the Base64 string to a data URL
      const dataUrl = `data:image/png;base64,${imageGenObj.outputImagebase64String}`;
      link.href = dataUrl;
      
      // Trigger the download by programmatically clicking the link
      document.body.appendChild(link); // Append link to body
      link.click(); // Programmatically click the link to trigger the download
      
      // Clean up by removing the temporary link
      document.body.removeChild(link);
    }

    const handleGenerate = async (useFast = false) => {
      setForceInputView(false)
      let faceImage: string | undefined = undefined;
      if (useFace) {
        faceImage = await getCompressedData();
        if (!faceImage) {return;}
      }
      let workflow = WorkflowType.singleUserPrompt;
      if (!useFace && !useModel) {
        workflow = useFast ? WorkflowType.textPromptFast :  WorkflowType.textPrompt;
      }else if (useFace && useModel) {
        workflow = WorkflowType.colabPromptWithModel;
      }
      const payload: ComfyUIRequest = {
        workflow: workflow,
        modelId: useModel ? model?.uid: undefined,
        faceImage: faceImage,
        prompt,
        seed,
      }
      dispatch(imageGeneratorAsyncActions.generateImage(payload))
    }

    const handleImageUpload = (event:any) => {
      const file = event.target.files[0];
      if (file && file.type.substr(0, 5) === 'image') {
        setSrc(URL.createObjectURL(file));
      } else {
        setSrc('');
      }
    };

    const getCompressedData = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            // Create a canvas with reduced size
            const canvas = document.createElement('canvas');
            const maxWidth = 500; // Max width for the image
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

  const triggerFileInput = () => {
    fileInputRef.current?.click(); // Simulates click on the hidden file input
  };

    return (
      <GenerateStyled.container>
      {
        <>
          {(getViewType(imageGenObj, forceInputView) === ViewTypes.input) && (
            <>
            <GenerateStyled.imageContainer>
              {!useFace ? 
              (<GenerateStyled.generateButton onClick={() => setUseFace(true)}> Add Face </GenerateStyled.generateButton>) : (
               <GenerateStyled.individualImageContainer>
              <GenerateStyled.closeButton onClick={() => {setUseFace(false)}}> &times; </GenerateStyled.closeButton>
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
              <GenerateStyled.imageLabel> Your face Image </GenerateStyled.imageLabel>
              </GenerateStyled.individualImageContainer>
              )}
              

              <GenerateStyled.plusContainer> + </GenerateStyled.plusContainer>

              {!useModel? (
                <GenerateStyled.generateButton onClick={() => {setUseModel(true)}}> Add Model Face </GenerateStyled.generateButton>
                ):( 
              <GenerateStyled.individualImageContainer>
              <GenerateStyled.closeButton onClick={() => {setUseModel(false)}}> &times; </GenerateStyled.closeButton>            
              <GenerateStyled.faceImage 
                src={model?.publicURL || "https://pub-a9cd5deb9a674cf781fe4e56075c4c4d.r2.dev/headshot.jpg"} // Placeholder or the uploaded image
                alt="AI Super Model"
                onClick={() => {navigate("/models")}} />
              <GenerateStyled.imageLabel> AI Super Model </GenerateStyled.imageLabel>
              </GenerateStyled.individualImageContainer>
                )}

            </GenerateStyled.imageContainer>
              <GenerateStyled.seedContainer>
                <GenerateStyled.seedInput type="number" 
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                  placeholder='random number'
                >
                </GenerateStyled.seedInput>
                <GenerateStyled.seedRefreshButton onClick={() => {setSeed(Math.floor(Math.random() * 10000000))}}>&#x21bb;</GenerateStyled.seedRefreshButton>
              </GenerateStyled.seedContainer>

              <GenerateStyled.promptTextArea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Enter your prompt here"
              />
              <div>
                {!useFace && !useModel && <GenerateStyled.generateButton onClick={() => handleGenerate(true)}>Generate Fast</GenerateStyled.generateButton>}
                <GenerateStyled.generateButton onClick={() => handleGenerate()}>Generate</GenerateStyled.generateButton>
              </div>
            </>
          )}

          {(getViewType(imageGenObj, forceInputView) === ViewTypes.loading) && (
            <GenerateStyled.container className='center-align'>
              <GenerateStyled.loaderImage className='heart-throb'
              src={loaderImage}
              alt="Loader"/> 
              <h2>Generating your image ...</h2>
            </GenerateStyled.container>
          )}

          {(getViewType(imageGenObj, forceInputView) === ViewTypes.output) && (
            <GenerateStyled.container className='center-align'>

            <GenerateStyled.generatedImage src={`data:image/png;base64, ${imageGenObj.outputImagebase64String}`}/>
            <GenerateStyled.buttonContainer>
              <GenerateStyled.tryAgainButton onClick={handleDownloadImage}>Download</GenerateStyled.tryAgainButton>
              <GenerateStyled.downloadButton onClick={() => setForceInputView(true)}>Try Again</GenerateStyled.downloadButton>
            </GenerateStyled.buttonContainer>
            {model && useModel &&
              <a href={`https://www.instagram.com/${model.instaUserName}`}> Follow {model?.instaUserName} </a>
            }
            </GenerateStyled.container>
          )}
        </>
      }

      </GenerateStyled.container>
    )
  }

export default Generate