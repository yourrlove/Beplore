import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { GoHome } from "react-icons/go";
import { Link as RouterLink } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import useLogout from "../hooks/useLogout";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useSocket } from "../context/socket";
import unReadNotificationsAtom from "../atoms/unReadNotificationsAtom";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const [notifications, setNotifications] = useRecoilState(unReadNotificationsAtom);
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();
  useEffect(() => {
    setNotifications([]);
    const getNotificationsUnread = async () => {
      if(!user) return;
      try {
        const res = await fetch(`/api/notifications/${user?._id}/?isRead=false`);
        const data = await res.json();
        if (data.status === "error") {
          showToast(data.code, data.message, data.status);
          return;
        }
        setNotifications(data.metadata);
      } catch (err) {
        showToast("Error", err, "error");
      }
    };
    getNotificationsUnread();
  }, [setNotifications, showToast, user]);

  useEffect(() => {
    socket?.on("notifications", (data) => {
      setNotifications([...notifications, data]);
    });
  }, [socket, notifications, setNotifications]);
  const logout = useLogout();
  return (
    <Flex justifyContent={"space-between"} my={4}>
      <Image
        cursor={"pointer"}
        alt="logo"
        ml={!user ? [100, 450, 500, 530, 540, 545, 550] : 0}
        mr={[4, 40, 140, 240]}
        w={9}
        src={colorMode === "dark" ? "/white-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {user && (
        <Link mr={55} as={RouterLink} to="/">
          <GoHome size={30} />
        </Link>
      )}
      {user && (
        <Link mr={55} as={RouterLink} to="/search">
          <CiSearch size={30} />
        </Link>
      )}
      {user && notifications && (
        <Link mr={55} as={RouterLink} to="/notifications">
          <Box position="relative" display="inline-block">
            <Icon as={FaRegHeart} boxSize={25} color="white" />
            {notifications.length > 0  && (
              <Badge
                position="absolute"
                top="-1"
                right="-3"
                bg="red.500"
                borderRadius="full"
                color="white"
              >
                {notifications.length}
              </Badge>
            )}
          </Box>
        </Link>
      )}
      {user && (
        <Link as={RouterLink} to={`/${user.userName}`}>
          <RxAvatar size={30} />
        </Link>
      )}

      {user && (
        <Flex ml={250}>
          <Button size={"sm"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
