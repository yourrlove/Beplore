import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import CreateComment from "./AddComment";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useShowToast from "../hooks/useShowToast";
import { Link, useNavigate } from "react-router-dom";
import { format, formatDistanceToNowStrict } from "date-fns";
import commentsAtom from "../atoms/commentsAtom";
import CreateReply from "./CreateReply";
import repliesAtom from "../atoms/repliesAtom";

const Comment = ({ comment, postedBy, type }) => {
  const currentUser = useRecoilValue(userAtom);
  const [comments, setComments] = useRecoilState(commentsAtom);
  const [replies, setReplies] = useRecoilState(repliesAtom);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [liked, setLiked] = useState(comment?.likes.includes(currentUser?._id));
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const formatDate = () => {
    const result = formatDistanceToNowStrict(new Date(comment.createdAt)).split(
      " "
    );
    if (result[0] > 7 && result[1] === "days") {
      return format(new Date(comment.createdAt), "MM/dd/yyyy");
    }
    return result[0] + result[1][0];
  };
  const handleLike = async () => {
    if (!currentUser) {
      return showToast(
        "Error!",
        "You must be logged in to like posts.",
        "error"
      );
    }
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/comments/${comment._id}/likes`, {
        method: "PUT",
      });
      const result = await res.json();
      if (result.status === "error") {
        showToast(result.code, result.message, result.status);
        return;
      }

      if (!liked) {
        if (type === "comment") {
          const updatedComments = comments.map((p) => {
            if (p._id === comment._id) {
              return { ...p, likes: [...p.likes, currentUser._id] };
            }
            return p;
          });
          setComments(updatedComments);
        } else {
          const updatedReplies = replies.map((p) => {
            if (p._id === comment._id) {
              return { ...p, likes: [...p.likes, currentUser._id] };
            }
            return p;
          });
          setReplies(updatedReplies);
        }
      } else {
        if (type === "comment") {
          const updatedComments = comments.map((p) => {
            if (p._id === comment._id) {
              return {
                ...p,
                likes: p.likes.filter((id) => id !== currentUser._id),
              };
            }
            return p;
          });
          setComments(updatedComments);
        } else {
          const updatedReplies = replies.map((p) => {
            if (p._id === comment._id) {
              return {
                ...p,
                likes: p.likes.filter((id) => id !== currentUser._id),
              };
            }
            return p;
          });
          setReplies(updatedReplies);
        }
      }
      setLiked(!liked);
    } catch (err) {
      showToast("Error", err, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      if (!window.confirm("Are you sure you want to delete this comment?"))
        return;
      const pathComments = comment.parentComment.split(",");
      const parentComment = pathComments.pop();
      const url =
        type === "comment"
          ? `/api/posts/${parentComment}/comments/${comment._id}`
          : `/api/comments/${parentComment}/replies/${comment._id}`;
      const res = await fetch(url, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.status === "error") {
        showToast(result.code, result.message, result.status);
        return;
      }
      showToast(result.statusCode, result.message, "success");

      if(type === "comment") {
        setComments(comments.filter((p) => p._id !== comment._id));
      } else {
        setReplies(replies.filter((p) => p._id!== comment._id));
      }
    } catch (err) {
      showToast("Error", err, "error");
    } finally {
      onClose();
    }
  };
  return (
    <Link to={`/${postedBy}/post/reply/${comment._id}`}>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar
          src={comment.userId.profile.avatar}
          size={"sm"}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/${comment.userId.userName}`);
          }}
        />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justify={"space-between"} alignItems={"center"}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              className="text-underline"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${comment.userId.userName}`);
              }}
            >
              {comment.userId.userName}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize="sm" color={"gray.light"}>
                {formatDate()}
              </Text>
              {(currentUser.userName === comment.userId.userName ||
                currentUser.userName === postedBy) && (
                <Popover
                  isOpen={isOpen}
                  onClose={onClose}
                  onOpen={onOpen}
                  placement="bottom"
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
                        {currentUser?._id === comment?.userId._id && (
                          <>
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
                          </>
                        )}
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
          <Text>{comment.content}</Text>
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

              {type === "comment" ? <CreateComment /> : <CreateReply />}
            </Flex>
            <Flex gap={2} alignItems={"center"}>
              <Text color={"gray.light"} fontSize="sm">
                {comment?.replies.length} replies
              </Text>
              <Box
                w={0.5}
                h={0.5}
                borderRadius={"full"}
                bg={"gray.light"}
              ></Box>
              <Text color={"gray.light"} fontSize="sm">
                {comment?.likes.length} likes
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Divider />
    </Link>
  );
};

export default Comment;
