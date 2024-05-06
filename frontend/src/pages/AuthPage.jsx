import { useRecoilValue } from "recoil"
import Login from "../components/Login"
import SignUp from "../components/SignUp"
import authScreenAtom from "../atoms/authAtom"

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  return (
    <>
        {authScreenState === "login" ? <Login /> : <SignUp />}
    </>
  )
}

export default AuthPage