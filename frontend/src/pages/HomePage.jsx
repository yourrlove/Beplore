import { Flex, Spinner, StackDivider, VStack } from "@chakra-ui/react";
import CreatePost from "../components/CreatePost";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import postsAtom from "../atoms/postsAtom";
import { useRecoilState } from "recoil";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feeds");
        const result = await res.json();
        if (result.status === "error") {
          showToast(result.code, result.message, result.status);
          return;
        }
        setPosts(result.metadata);
      } catch (err) {
        showToast("Error", err, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);
  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={4}
      align="stretch"
    >
      <CreatePost />
      <>
        {!loading && posts.length === 0 && (
          <h1>Follow some users to see the new feed.</h1>
        )}
        {loading && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}
        {posts.map(post => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </>
    </VStack>
  );
};

export default HomePage;
