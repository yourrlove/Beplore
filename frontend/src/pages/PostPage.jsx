import {
  Avatar,
  Flex,
  Text,
  Image,
  Box,
  Divider,
  Button,
  Spinner,
  Popover,
  useDisclosure,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Stack,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { useEffect } from "react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUser from "../hooks/useGetUser";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { postId } = useParams();
  const { user, loading } = useGetUser();
 const [posts, setPosts] = useRecoilState(postsAtom);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const navigate = useNavigate();

  const currentPost = posts[0];
  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${postId}`);
        const result = await res.json();
        if (result.status === "error") {
          showToast(result.code, result.message, result.status);
          return;
        }
        setPosts([result.metadata]);
      } catch (err) {
        showToast("Error", err, "error");
      }
    };
    getPost();
  }, [postId, showToast, setPosts]);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.status === "error") {
        showToast(result.code, result.message, result.status);
        return;
      }
      showToast(result.statusCode, result.message, "success");
      navigate(`/${user.userName}`);
    } catch (err) {
      showToast("Error", err, "error");
    } finally {
      onClose();
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    );
  }
  if (!currentPost) return null;
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            name={user?.profile.name}
            src={user?.profile.avatar}
            size={"md"}
          />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.userName}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            id
          </Text>
          {currentUser?._id === currentPost.postedBy?._id && (
            <Popover
              isOpen={isOpen}
              onClose={onClose}
              onOpen={onOpen}
              placement="top"
            >
              <PopoverTrigger>
                <Flex>
                  <IconButton
                    isRound={true}
                    bg="dark"
                    color="gray.light"
                    onClick={(e) => {
                      e.preventDefault();
                      isOpen ? onClose() : onOpen();
                    }}
                    icon={<BsThreeDots />}
                  />
                </Flex>
              </PopoverTrigger>
              <PopoverContent w="fit-content" bg="gray.dark" borderRadius={15}>
                <PopoverArrow />
                <PopoverBody>
                  <Stack>
                    <Button
                      w="194px"
                      variant="ghost"
                      justifyContent="space-between"
                      fontWeight="normal"
                      fontSize="sm"
                    >
                      Edit
                    </Button>
                    <Divider />
                    <Button
                      w="194px"
                      variant="ghost"
                      justifyContent="space-between"
                      fontWeight="normal"
                      colorScheme="red"
                      fontSize="sm"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.content}</Text>

      {currentPost.image && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.image} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>😂👌</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />
      {currentPost.comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
        />
      ))}
    </>
  );
};
export default PostPage;
