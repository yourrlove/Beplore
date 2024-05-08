import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";

const useLogout = () => {
    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast();

    const handleLogout = async () => {
        try {
          const res = await fetch("/api/users/logout");
          const result = await res.json();
          if (result.status === 'error') {
            showToast(result.code, result.message, result.status);
            return;
          }
          localStorage.removeItem('user-threads');
          setUser(null);

        } catch (err) {
            showToast("Error", err.message, 'error');
        }
    }
    return handleLogout;
}

export default useLogout