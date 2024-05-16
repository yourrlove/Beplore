import {
  Avatar,
  Button,
  Divider,
  Flex,
  HStack,
  Image,
  Stack,
  StackDivider,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import Notification from "../components/Notification";
import { useRecoilState, useRecoilValue } from "recoil";
import notificationsAtom from "../atoms/notificationsAtom";
import { useEffect } from "react";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import unReadNotificationsAtom from "../atoms/unReadNotificationsAtom";

const NotificationPage = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [notifications, setNotifications] = useRecoilState(notificationsAtom);
  const [unReadotifications, setUnReadNotifications] = useRecoilState(unReadNotificationsAtom);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  useEffect(() => {
    setUnReadNotifications([]);
    const updateNotifications = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/notifications/`, {
          method: "PUT",
        });
        const data = await res.json();
        if (data.status === "error") {
          return;
        }
        setNotifications([]);
      } catch (err) {
        console.log(err);
      }
    };
    updateNotifications();
  }, [user, setNotifications, setUnReadNotifications]);
  useEffect(() => {
    const getAllNotifications = async () => {
      if(!user) return;
      try {
        const res = await fetch(`/api/notifications/${user?._id}/?isRead=true`);
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
    getAllNotifications();
  }, [setNotifications, showToast, user])
  return (
    <>
      <VStack
        spacing={4}
        align="stretch"
        divider={<StackDivider borderColor="gray.light" w={"560px"} />}
      >
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <Notification key={notification._id} notification={notification} />
          ))
        ) : (
          <Text>No new notifications</Text>
        )}
      </VStack>
    </>
  );
};

export default NotificationPage;
