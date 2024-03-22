import { auth, getAuthTokenForCurrentUser } from "../firebase/firebase.utils"

//TODO: REPLACE with your own cloudFunction serverBaseURL
const baseURL = "https://us-central1-<your_project_id>.cloudfunctions.net"

export interface AppUser {
    name: string,
    email: string | undefined,
    id: string,
    ts: number,
    lut: number,
    tosTS: number| null,
    isAdmin?: boolean,
}

export interface VerificationObject {
    faceMatch: boolean,
    properHeadShot: boolean,
    establishedProfile: boolean,
    isAIModel: boolean,
    other: string| null,
}

export interface Model {
    instaUserName: string,
    facePhoto_base64: string|null,
    tosTS: number|null,
    isLive: boolean,
    isVerified: boolean,
    verificationStatus: "notStarted"| "inProgress" | "complete",
    verificationObject?: VerificationObject,
    verificationCode: string,
    compositeCode:string,
    publicURL?: string,
    uid: string,
 }

 export interface CompactModel{
    uid: string, 
    instaUserName: string, 
    publicURL?: string
}

 export interface GetUserResponse {
    user: AppUser,
    model: CompactModel
 }

 export enum WorkflowType {
    textPrompt = "textPrompt",
    textPromptFast = "textPromptFast",
    colabPrompt = "colabPrompt",
    colabPromptWithModel = "colabPromptWithModel",
    singleUserPrompt = "singleUserPrompt",
    referencePrompt = "referencePrompt",
}


export type ComfyUIRequest = {
    workflow: WorkflowType,
    faceImage?: string,
    modelId?: string,
    bodyImage?: string,
    dressImage?: string,
    leftPadding?: number,
    prompt?: string,
    seed?: number,
}

export interface GenImageResponse {
    image: string
}

export const ApiUtils = {
    getAppUser: async (instaUserName:string, retryCount: number = 2): Promise<GetUserResponse> => {
        const token = await getAuthTokenForCurrentUser(retryCount !== 2)
        const response = await fetch(`${baseURL}/getUserAndModel?instaUserName=${instaUserName}`, {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status !== 200) {
            if (retryCount === 0) {
                throw new Error("Network Error")
            }
            return await ApiUtils.getAppUser(instaUserName, retryCount-1)
        }
        const userData = await response.json();
        return userData as GetUserResponse
    },

    getLiveModels: async (retryCount: number = 2): Promise<CompactModel[]> => {
        const token = await getAuthTokenForCurrentUser(retryCount !== 2)
        const response = await fetch(`${baseURL}/getLiveModels`, {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status !== 200) {
            if (retryCount === 0) {
                throw new Error("Network Error")
            }
            return await ApiUtils.getLiveModels(retryCount-1)
        }
        const models = await response.json();
        return models as CompactModel[]
    },

    updateTOSStatus: async ( acceptTOS: boolean, retryCount: number = 2): Promise<AppUser> => {
        const token = await getAuthTokenForCurrentUser(retryCount !== 2)
        const response = await fetch(`${baseURL}/updateTOSStatus`, {
            method: "POST",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({acceptTOS})
        })
        if (response.status !== 200) {
            if (retryCount === 0) {
                throw new Error("Network Error")
            }
            return await ApiUtils.updateTOSStatus(acceptTOS, retryCount-1)
        }
        const userData = await response.json();
        return userData as AppUser
    },


    generateImage: async (payload: ComfyUIRequest, retryCount: number = 2): Promise<GenImageResponse> => {
        const token = await getAuthTokenForCurrentUser(retryCount !== 2)
        //        const response = await fetch(`${baseURL}/generateMockImage`, {
        const response = await fetch(`${baseURL}/generateImage`, {
            method: "POST",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
        if (response.status !== 200) {
            if (retryCount === 0) {
                throw new Error("Network Error")
            }
            return await ApiUtils.generateImage( payload, retryCount-1)
        }
        const imageData = await response.json() as GenImageResponse;
        return imageData
    },

    addModel: async(instaUserName: string, facePic: string, retryCount: number = 2): Promise<Model> => {
        const token = await getAuthTokenForCurrentUser(retryCount !== 2)
        const response = await fetch(`${baseURL}/addModel`, {
            method: "POST",
            body: JSON.stringify({instaUserName, facePic}),
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status !== 200) {
            if (retryCount === 0) {
                throw new Error("Network Error")
            }
            return await ApiUtils.addModel(instaUserName, facePic, retryCount-1)
        }
        const modelData = await response.json() as Model
        return modelData
    },

    getModelData: async(retryCount: number = 2): Promise<Model> => {
        const token = await getAuthTokenForCurrentUser(retryCount !== 2)
        const response = await fetch(`${baseURL}/getModelData`, {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status !== 200) {
            if (retryCount === 0) {
                throw new Error("Network Error")
            }
            return await ApiUtils.getModelData(retryCount-1)
        }
        const modelData = await response.json() as Model
        return modelData
    },

    deleteUserModels: async(retryCount: number = 2): Promise<Model> => {
        const token = await getAuthTokenForCurrentUser(retryCount !== 2)
        const response = await fetch(`${baseURL}/deleteUserModels`, {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status !== 200) {
            if (retryCount === 0) {
                throw new Error("Network Error")
            }
            return await ApiUtils.deleteUserModels(retryCount-1)
        }
        const modelData = await response.json() as Model
        return modelData
    },

    updateGoLive: async(isLive:boolean, retryCount: number = 2): Promise<Model> => {
        const token = await getAuthTokenForCurrentUser(retryCount !== 2)
        const response = await fetch(`${baseURL}/updateGoLive`, {
            method: "POST",
            body: JSON.stringify({isLive}),
            headers: {
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status !== 200) {
            if (retryCount === 0) {
                throw new Error("Network Error")
            }
            return await ApiUtils.updateGoLive(isLive, retryCount-1)
        }
        const modelData = await response.json() as Model
        return modelData
    },

    getModelUserAsAdmin: async(payload:{compositeCode:string, userName: string}, retryCount: number = 2): Promise<Model> => {
        const token = await getAuthTokenForCurrentUser(retryCount !== 2)
        const response = await fetch(`${baseURL}/getModelUserAsAdmin`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status !== 200) {
            if (retryCount === 0) {
                const error = await response.text()
                throw new Error(error)
            }
            return await ApiUtils.getModelUserAsAdmin(payload, retryCount-1)
        }
        const modelData = await response.json() as Model
        return modelData
    },

    verifyUser: async(payload:{modelUid:string, verificationObject: VerificationObject}, retryCount: number = 2): Promise<Model> => {
        const token = await getAuthTokenForCurrentUser(retryCount !== 2)
        const response = await fetch(`${baseURL}/verifyUser`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status !== 200) {
            if (retryCount === 0) {
                throw new Error("Network Error")
            }
            return await ApiUtils.verifyUser(payload, retryCount-1)
        }
        const modelData = await response.json() as Model
        return modelData
    },

    generateTestLoginToken: async(payload:{password:string}, retryCount: number = 1): Promise<string> => {
        const response = await fetch(`${baseURL}/generateTestLoginToken`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json",
            }
        })
        if (response.status !== 200) {
            if (retryCount === 0) {
                throw new Error("Network Error")
            }
            return await ApiUtils.generateTestLoginToken(payload, retryCount-1)
        }
        const res = await response.json() as {loginToken: string}
        return res.loginToken
    }
}
