import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    NextOrObserver,
    User,
    ErrorFn,
    signInWithCustomToken
} from "firebase/auth";

// TODO : REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
};

const app = initializeApp(firebaseConfig);

const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
    prompt: "select_account"
})

export const auth = getAuth();
export const signInWithToken = async (token: string) => { signInWithCustomToken(auth, token) }
export const signInWithGooglePopup = () => signInWithPopup(auth, googleAuthProvider);
export const signOutUser = async () => await signOut(auth);
export const onAuthStateChangedListner = (callback: NextOrObserver<User>) => onAuthStateChanged(auth, callback)
export const getAuthTokenForCurrentUser = async (forceRefresh: boolean = false) => {
    if (!auth.currentUser) {
        return null
    }
    const token = await auth.currentUser.getIdToken(forceRefresh)
    return token
}
