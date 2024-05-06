import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/${username}`, {
          method: "GET",
          headers: {
            'Authorization': "Bearer ",
          },
        });
        const result = await res.json();
        if (result.status === 'error') {
          showToast(result.code, result.message, result.status);
          return;
        }
        setUser(result.metadata);
      } catch (err) {
        showToast("Error", err, "error");
      }
    };
    getUser();
  }, [username, showToast]);
  
  if(!user) return null;
  return <>
    <UserHeader user={user} setUser={setUser}/>
    <UserPost likes={1200} replies={481} postImg="/post1.png" postTitle="Let's talk about threads."/>
    <UserPost likes={2600} replies={200} postImg="/company.png" postTitle="We need you!."/>
    <UserPost likes={3200} replies={100} postImg="/bached.jpg" postTitle="My new avatar:)!."/>
  </>
}

export default UserPage