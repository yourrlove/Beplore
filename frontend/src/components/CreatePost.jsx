import {
  AlertDialog,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AutoResizeTextarea } from "../components/AutoResizeTextarea";
import CreatePostActions from "./CreatePostActions";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenAlertDialog,
    onOpen: onOpenAlertDialog,
    onClose: onCloseAlertDialog,
  } = useDisclosure();
  const user = useRecoilValue(userAtom);
  const [imgUrl, setImgUrl] = useState(null);
  const [inputs, setInput] = useState(false);
  const showToast = useShowToast();

  const handleClose = async () => {
    try {
      setInput(false);
      setImgUrl(null);
      onCloseAlertDialog();
      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  const handleCreatePost = async () => {
    try {
      let formData = new FormData();
      formData.append("userId", user._id);
      formData.append("content", inputs.content);
      formData.append("file", inputs.file);

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      console.log(result);
      if (result.status === "error") {
        showToast(result.code, result.message, result.status);
        return;
      }
      setImgUrl(result.metadata.image_url);
    } catch (err) {
      showToast("Error", err, "error");
    }
  };
  return (
    <>
      <Flex>
        <Avatar size="md" name="NTR Knight" src="/bached.jpg" />
        <Flex flex={1} flexDirection={"column"}>
          <Flex bg="dark" onClick={onOpen} cursor="text">
            <Box flexGrow={1} color="gray.light" pl={4} pt={3}>
              <span>Start a thread...</span>
            </Box>
            <Button
              mt={3}
              bg="white.light"
              color="black"
              rounded="full"
              onClick={onOpen}
            >
              Post
            </Button>
          </Flex>
        </Flex>
      </Flex>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          inputs ? onOpenAlertDialog() : handleClose();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="gray.dark" rounded="lg" maxWidth="620px">
          <ModalHeader>
            <Center color="white.light">New Post</Center>
          </ModalHeader>
          <ModalBody>
            <Flex gap={3}>
              <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size="md" name="NTR Knight" src="/bached.jpg" />
                <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
              </Flex>
              <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justify={"space-between"} w={"full"}>
                  <Flex w={"full"} alignItems={"center"}>
                    <Text fontSize={"sm"} fontWeight={"bold"}>
                      ntrknight
                    </Text>
                    <Image src="/verified.png" w={4} h={4} ml={1} />
                  </Flex>
                </Flex>
                <AutoResizeTextarea
                  placeholder="Start a thread..."
                  size="lg"
                  onChange={(e) =>
                    setInput({ ...inputs, content: e.target.value })
                  }
                  value={inputs.content}
                />
                {imgUrl && (
                  <Flex gap={3} w={"full"} position={"relative"}>
                    <Image src={imgUrl} alt="Selected image" />
                    <CloseButton
                      onClick={() => {
                        setImgUrl(null);
                      }}
                      bg={"gray.800"}
                      position={"absolute"}
                      top={2}
                      right={2}
                    />
                  </Flex>
                )}
                <Flex gap={3}>
                  <CreatePostActions
                    inputs={inputs}
                    setInput={setInput}
                    setImgUrl={setImgUrl}
                  />
                </Flex>
              </Flex>
            </Flex>
            <Flex marginLeft={500} mb={4}>
              <Button
                bg="white.light"
                color="black"
                // isActive="fasle"
                rounded="full"
                onClick={handleCreatePost}
              >
                Post
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onCloseAlertDialog}
        isOpen={isOpenAlertDialog}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent w={300} h={150}>
          <AlertDialogHeader textAlign="center" fontSize="lg" fontWeight="bold">
            Discard Thread?
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogFooter gap={20}>
            <Button onClick={onCloseAlertDialog} my={5}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleClose}>
              Discard
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreatePost;
