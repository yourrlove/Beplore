import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userName } = useParams();
  const showToast = useShowToast();
  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/${userName}`);
        const result = await res.json();
        if (result.status === "error") {
          showToast(result.code, result.message, result.status);
          return;
        }
        setUser(result.metadata);
      } catch (err) {
        showToast("Error", err, "error");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [userName, showToast]);
  return {loading, user};
};

export default useGetUser;
