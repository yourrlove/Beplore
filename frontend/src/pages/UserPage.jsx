import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams, useLocation } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUser from "../hooks/useGetUser";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const {user, loading} = useGetUser();
  const { userName } = useParams();
  const showToast = useShowToast();
  const location = useLocation();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${userName}`, {
          method: "GET",
        });
        const result = await res.json();
        if (result.status === "error") {
          showToast(result.code, result.message, result.status);
          return;
        }
        console.log(result.metadata);
        setPosts(result.metadata);
      } catch (err) {
        showToast("Error", err, "error");
      } finally {
        setFetchingPosts(false);
      }
    }

    getPosts();
  }, [userName, showToast, location, setPosts]);
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    );
  }
  if (!user && !loading) return null;
  return (
    <>
      <UserHeader user={user}/>
      {!fetchingPosts && posts?.length === 0 && <h1>Start your first thread.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size="xl" />
        </Flex>
      )}
      {posts.map(post => (
        <Post key={post._id} post={post} postedBy={post.postedBy}/>
      ))}
    </>
  );
};

export default UserPage;
