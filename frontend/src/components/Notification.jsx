import {
  Avatar,
  Button,
  Flex,
  Image,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Notification = ({ notification }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const showToast = useShowToast();
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userAtom);
  const [following, setFollowing] = useState(
    user?.following.includes(notification?.source.userId)
  );
  const [updating, setUpdating] = useState(false);
  const handleFollow = async () => {
    if (!user) {
      showToast("Error", "You must be logged in to follow users.", "error");
      return;
    }
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(
        `api/users/follow/${notification?.source.userId}`,
        {
          method: "PUT",
        }
      );
      const result = await res.json();
      if (result.status === "error") {
        showToast(result.code, result.message, result.status);
        return;
      }
      if (following) {
        showToast(
          "Success!",
          `Unfollowed ${notification?.source.userName}`,
          "success"
        );
        setUpdating({
          ...user,
          following: user.following.filter(
            (id) => id !== notification.source.userId
          ),
        });
      } else {
        showToast(
          "Success!",
          `Followed ${notification?.source.userName}`,
          "success"
        );
        setUpdating({
          ...user,
          following: [...user.following, notification.source.userId],
        });
      }
      setFollowing(!following);
    } catch (err) {
      showToast("Error", err, "error");
    } finally {
      setUpdating(false);
    }
  };
  console.log(notification);
  return (
    <>
      <Flex gap={3} py={2} justifyContent={"space-between"} w={"560px"}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="sm"
            name={notification?.source.userName}
            src={notification?.source.avatar}
          />
        </Flex>
        <Flex flex={1} flexDirection={"column"}>
          <Flex justify={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Stack>
                <Flex>
                  <Text
                    className="text-underline"
                    fontSize={"sm"}
                    fontWeight={"bold"}
                  >
                    {notification?.source.userName}
                  </Text>
                  <Image src="/verified.png" w={4} h={4} ml={1} />
                </Flex>
                <Text color={"gray"}>{notification?.content}</Text>
              </Stack>
            </Flex>
          </Flex>
        </Flex>
        {notification?.type === "user" && (
          <Button size={"sm"} onClick={handleFollow} isLoading={updating}>
            {following ? "Unfollow" : "Follow Back"}
          </Button>
        )}
        {(notification?.type === "post" ||
          notification?.type === "replypost") && (
          <Button
            size={"sm"}
            onClick={(e) => {
              e.preventDefault();
              navigate(
                `/${notification?.target.postId.postedBy.userName}/post/${notification?.target.postId._id}`
              );
            }}
          >
            View Post
          </Button>
        )}
        {(notification?.type === "comment" ||
          notification?.type === "replycomment") && (
          <Button
            size={"sm"}
            onClick={(e) => {
              e.preventDefault();
              navigate(
                `/${notification?.target.commentId.userId.userName}/post/reply/${notification?.target.commentId._id}`
              );
            }}
          >
            View Comment
          </Button>
        )}
      </Flex>
    </>
  );
};

export default Notification;
