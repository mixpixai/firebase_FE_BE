/* eslint-disable react/jsx-pascal-case */
import { useEffect } from "react";
import { modelAsyncActions, modelSelector } from "../../store/model/model.slice"
import { useAppDispatch, useAppSelector } from "../../store/store"
import { userActions } from "../../store/user/user.slice";
import { CompactModel } from "../../utils/network/api.utils";
import { GenerateStyled } from "../generate/generate.styled"
import { Container, ModelWrapper } from "./ModelPicker.styled";
import { useNavigate } from "react-router-dom";


export const ModelPicker = () => {
    const allModels = useAppSelector(modelSelector.selectAllModels);
    const modelState = useAppSelector(modelSelector.selectAll);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const setDefaultModel = (model: CompactModel) => {
        dispatch(userActions.updateModel(model))
        navigate("/")
    }

    useEffect(()=> {
       dispatch(modelAsyncActions.getLiveModels({}))
    },[])

    const loaderScreen = <h2> Loading... </h2>;
    const allModelsScreen = allModels.map((model) => 
        <ModelWrapper key={model.uid}>
            <GenerateStyled.faceImage onClick={() => {setDefaultModel(model)}} src={model.publicURL ?? ""} />
            <GenerateStyled.imageLabel>@{model.instaUserName}</GenerateStyled.imageLabel>
        </ModelWrapper>
    )
    
    return (
        <Container>
            {modelState.isLoading && loaderScreen}
            {!modelState.isLoading && allModelsScreen}
        </Container>
    )
}