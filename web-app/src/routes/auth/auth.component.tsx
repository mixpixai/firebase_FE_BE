import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useAppDispatch } from "../../store/store"
import { modelAsyncActions } from "../../store/model/model.slice";

const useQuery  = () => { return new URLSearchParams(useLocation().search)}

export const AuthRedirectHandler = () => {
    const dispatch = useAppDispatch();
    const query = useQuery();

    useEffect(() => {
        const code = query.get("code") as string || "";
//        dispatch(modelAsyncActions.createUserFromCode(code))
    }, [])

    return (
        <h2> Loading .... Sending </h2>
    )
}