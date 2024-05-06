import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const LogoutButton = () => {
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
            console.log(err);
        }
    }
  return (
    <Button 
    position={"fixed"} 
    top={"30px"} 
    right={"30px"} 
    size={"sm"} 
    onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
