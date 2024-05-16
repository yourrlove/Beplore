import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import CreateComment from "./AddComment";
import postsAtom from "../atoms/postsAtom";

const Actions = ({ post }) => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentUser = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(post?.likes.includes(currentUser?._id));
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if(!currentUser) {
      return showToast("Error!", "You must be logged in to like posts.", "error");
    }
    if(loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post._id}/likes`, {
        method: "PUT",
      });
      const result = await res.json();
      if (result.status === "error") {
        showToast(result.code, result.message, result.status);
        return;
      }
      if(!liked) {
        const updatedPosts = posts.map(p => {
          if(p._id === post._id) {
            return { ...p, likes: [...p.likes, currentUser._id ] };
          }
          return p;
        });
        setPosts(updatedPosts);
      } else {
        const updatedPosts = posts.map(p => {
          if(p._id === post._id) {
            return { ...p, likes: p.likes.filter(id => id !== currentUser._id) };
          }
          return p;
        });
        setPosts(updatedPosts);
      }
      setLiked(!liked);
    } catch (err) {
      showToast("Error", err, "error");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Flex flexDirection={"column"}>
      <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="Like"
          color={liked ? "rgb(237, 73, 86)" : ""}
          fill={liked ? "rgb(237, 73, 86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={handleLike}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <CreateComment post={post}/>

      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          {post?.comments.length} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          {post?.likes.length} likes
        </Text>
      </Flex>
    </Flex>
  );
};

export default Actions;
