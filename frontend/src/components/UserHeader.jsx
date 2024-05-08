import {
  VStack,
  Box,
  Flex,
  Avatar,
  Text,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import UpdateProfile from "./UpdateProfile";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user.profile.followers.includes(currentUser._id)
);
  const [updating, setUpdating] = useState(false);

  const copyURL = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showToast("Success!", "Profile link copied.", "success");
    });
  };

  const handleFollow = async () => {
    if (!currentUser) {
      showToast("Error", "You must be logged in to follow users.", "error");
      return;
    }
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`api/users/follow/${user._id}`, {
        method: "PUT",
      });
      const result = await res.json();
      if (result.status === "error") {
        showToast(result.code, result.message, result.status);
        return;
      }
      if (following) {
        showToast("Success!", `Unfollowed ${user.userName}`, "success");
        user.profile.followers.pop();
      } else {
        showToast("Success!", `Followed ${user.userName}`, "success");
        user.profile.followers.push(currentUser._id);
      }
      setFollowing(!following);
    } catch (err) {
      showToast("Error", err, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <VStack gap={4} align={"start"}>
      <Flex justify="space-between" w={"full"}>
        <Box>
          <Text fontSize={"2x1"}>{user.profile.name}</Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.userName}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user.profile.name}
            src={user.profile.avatar}
            size={{
              base: "md",
              md: "xl",
            }}
          />
        </Box>
      </Flex>

      <Text>{user.profile.bio}</Text>
      {currentUser._id === user._id && (
        <UpdateProfile user={user} />
      )}
      {currentUser._id !== user._id && (
        <Button size={"sm"} onClick={handleFollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justify={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>
            {user.profile.followers.length} followers
          </Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"} href={user.profile.link} isExternal>
            {user.profile.link}
          </Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <MenuList bg={"gray.dark"}>
                <MenuItem bg={"gray.dark"} onClick={copyURL}>
                  Copy Link
                </MenuItem>
                <MenuItem bg={"gray.dark"}>More Options</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justify={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justify={"center"}
          color={"gray.light"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
