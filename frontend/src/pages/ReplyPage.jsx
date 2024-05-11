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
import { useEffect, useState } from "react";
import useGetUser from "../hooks/useGetUser";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import commentsAtom from "../atoms/commentsAtom";
import { format, formatDistanceToNowStrict } from "date-fns";
import userAtom from "../atoms/userAtom";
import CommentActions from "../components/CommentActions";
import repliesAtom from "../atoms/repliesAtom";
import Comment from "../components/Comment";

const ReplyPage = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { commentId } = useParams();
  const { user, loading } = useGetUser();
  const [comments, setComments] = useRecoilState(commentsAtom);
  const [replies, setReplies] = useRecoilState(repliesAtom);
  const [fetchingComments, setFetchingComments] = useState(false);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const currentComment = comments[0];

  useEffect(() => {
    const getPost = async () => {
      setComments([]);
      try {
        const res = await fetch(`/api/comments/${commentId}`);
        const result = await res.json();
        if (result.status === "error") {
          showToast(result.code, result.message, result.status);
          return;
        }
        setComments([result.metadata]);
      } catch (err) {
        showToast("Error", err, "error");
      }
    };
    getPost();
  }, [commentId, showToast, setComments]);

  useEffect(() => {
    const getComments = async () => {
      if (!currentComment || !currentComment.replies) return;
      setFetchingComments(true);
      setReplies([]);
      try {
        const res = await fetch(`/api/comments/${currentComment._id}/replies`);
        const result = await res.json();
        if (result.status === "error") {
          showToast(result.code, result.message, result.status);
          return;
        }
        setReplies(result.metadata);
      } catch (err) {
        showToast("Error", err, "error");
      } finally {
        setFetchingComments(false);
      }
    };
    getComments();
  }, [showToast, setReplies, currentComment]);

  const handleDeleteComment = async (e) => {
    e.preventDefault();
    try {
      if (!window.confirm("Are you sure you want to delete this comment?"))
        return;
      const pathComments = currentComment.parentComment.split(",");
      const parentComment = pathComments.pop();
      const url =
        pathComments.length > 0
          ? `/api/comments/${parentComment}/replies/${currentComment._id}`
          : `/api/posts/${parentComment}/comments/${currentComment._id}`;
      const res = await fetch(url, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.status === "error") {
        showToast(result.code, result.message, result.status);
        return;
      }
      showToast(result.statusCode, result.message, "success");
      if(pathComments.length > 0) {
        navigate(`/${user.userName}/post/reply/${parentComment}`);
      } else {
        navigate(`/${user.userName}/post/${parentComment}`);
      }

    } catch (err) {
      showToast("Error", err, "error");
    } finally {
      onClose();
    }
  };
  const formatDate = () => {
    const result = formatDistanceToNowStrict(
      new Date(currentComment.createdAt)
    ).split(" ");
    if (result[0] > 7 && result[1] === "days") {
      return format(new Date(currentComment.createdAt), "MM/dd/yyyy");
    }
    return result[0] + result[1][0];
  };
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    );
  }
  if (!currentComment) return null;
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            name={currentComment?.userId.profile.name}
            src={currentComment?.userId.profile.avatar}
            size={"md"}
            onClick={() => {
              navigate(`/${currentComment?.userId.userName}`);
            }}
          />
          <Flex>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              className="text-underline"
              onClick={() => {
                navigate(`/${currentComment?.userId.userName}`);
              }}
            >
              {currentComment.userId?.userName}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            {formatDate()}
          </Text>
          {currentUser?._id === currentComment?.userId?._id && (
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
                      onClick={handleDeleteComment}
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

      <Text my={3}>{currentComment?.content}</Text>

      {currentComment?.image && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentComment?.image} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <CommentActions comment={currentComment} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>😂👌</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      {!comments && fetchingComments && (
        <Flex justifyContent={"end"}>
          <Spinner size="xl" />
        </Flex>
      )}
      <Divider my={4} />
      {replies.map((reply) => (
        <Comment
          key={reply._id}
          comment={reply}
          postedBy={currentComment?.userId.userName}
          type={"reply"}
        />
      ))}
    </>
  );
};
export default ReplyPage;
