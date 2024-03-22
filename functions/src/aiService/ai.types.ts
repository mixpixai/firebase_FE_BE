
export enum WorkflowType {
    textPrompt = "textPrompt",
    textPromptFast = "textPromptFast",
    colabPrompt = "colabPrompt",
    colabPromptWithModel = "colabPromptWithModel",
    referencePrompt = "referencePrompt",
    onboardModel = "onboardModel",
    singleUserPrompt = "singleUserPrompt"
}

export type ComfyUIRequest = {
    workflow: WorkflowType,
    faceImage?: string, // __FACEIMAGE__
    modelId?: string, // __MODELID__
    bodyImage?: string, // __BODYIMAGE__
    dressImage?: string, // __DRESSIMAGE__
    leftPadding?: number, // __LEFTPADDING__
    prompt?: string, // __PROMPT__
    seed?: number, // __SEED__
}
