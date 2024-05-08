import { Link, useNavigate } from "react-router-dom";
import {
  Flex,
  Avatar,
  Box,
  Text,
  Image,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Stack,
  Button,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";

const Post = ({ post, postedBy }) => {
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const formatDate = () => {
    const result = formatDistanceToNowStrict(new Date(post.createdAt)).split(
      " "
    );
    if (result[0] > 7 && result[1] === "days") {
      return format(new Date(post.createdAt), "MM/dd/yyyy");
    }
    return result[0] + result[1][0];
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.status === "error") {
        showToast(result.code, result.message, result.status);
        return;
      }
      showToast(result.statusCode, result.message, "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (err) {
      showToast("Error", err, "error");
    } finally {
      onClose();
    }
  } 

  return (
    <Link to={`/${postedBy.userName}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={postedBy.profile.name}
            src={postedBy.profile.avatar}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${postedBy.userName}`);
            }}
          />
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.comments[0] && (
              <Avatar
                key={post.comments._id}
                size="xs"
                name={post.comments[0].userId.userName}
                src={post.comments[0].userId.profile.avatar}
                position={"absolute"}
                top={"0px"}
                left="25px"
              />
            )}
            {post.comments[1] && (
              <Avatar
                key={post.comments._id}
                size="xs"
                name={post.comments[1].userId.userName}
                src={post.comments[1].userId.profile.avatar}
                position={"absolute"}
                top={"0px"}
                right="25px"
              />
            )}
            {post.comments[2] && (
              <Avatar
                key={post.comments._id}
                size="xs"
                name={post.comments[2].userId.userName}
                src={post.comments[2].userId.profile.avatar}
                position={"absolute"}
                top={"20px"}
                left="10px"
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justify={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                className="text-underline"
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${postedBy.userName}`);
                }}
              >
                {postedBy.userName}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontStyle={"xs"}
                width={36}
                color={"gray.light"}
                textAlign={"right"}
              >
                {formatDate()}
              </Text>
              {currentUser?._id === postedBy?._id && (
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
                  <PopoverContent
                    w="fit-content"
                    bg="gray.dark"
                    borderRadius={15}
                  >
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
          <Text fontSize={"sm"}>{post.content}</Text>
          {post.image && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.image} w={"full"} />
            </Box>
          )}

          <Flex gap={3} my={3}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
