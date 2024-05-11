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
  import { useRecoilState, useRecoilValue } from "recoil";
  import userAtom from "../atoms/userAtom";
  import { useNavigate } from "react-router-dom";
import commentsAtom from "../atoms/commentsAtom";
  
  const CreateReply = ({ comment }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
      isOpen: isOpenAlertDialog,
      onOpen: onOpenAlertDialog,
      onClose: onCloseAlertDialog,
    } = useDisclosure();
    const user = useRecoilValue(userAtom);
    const [comments, setComments] = useRecoilState(commentsAtom);
    const [imgUrl, setImgUrl] = useState(null);
    const [inputs, setInput] = useState(false);
    const [isreplying, setIsReplying] = useState(false);
    const showToast = useShowToast();
    const navigate = useNavigate();
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
  
    const handleOpen = async () => {
      onOpen();
    }
  
    const handleAddComment = async () => {
      if(!user) {
        return showToast("Error!", "You must be logged in to like posts.", "error");
      }
      if(isreplying) return;
      setIsReplying(true);
      try {
        let formData = new FormData();
        formData.append("userId", user._id);
        formData.append("content", inputs.content);
        formData.append("file", inputs.file);
  
        const res = await fetch(`/api/comments/${comment._id}/replies`, {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        if (result.status === "error") {
          showToast(result.code, result.message, result.status);
          return;
        }
        showToast(result.statusCode, result.message, "success");
        const updatedComments = comments.map(p => {
          if(p._id === comment._id) {
            return { ...p, replies: [...p.replies, result.metadata ] };
          }
          return p;
        });
        setComments(updatedComments);
      } catch (err) {
        showToast("Error", err, "error");
      } finally {
        setIsReplying(false);
        handleClose();
      }
    };
    return (
      <>
        <Flex>
          <svg
            aria-label="Comment"
            color=""
            fill=""
            height="20"
            role="img"
            viewBox="0 0 24 24"
            width="20"
            onClick={handleOpen}
          >
            <title>Comment</title>
            <path
              d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
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
              <Center color="white.light">Comment</Center>
            </ModalHeader>
            <ModalBody>
              <Flex gap={3} mb={4} >
                <Flex flexDirection={"column"} alignItems={"center"}>
                  <Avatar
                    size="md"
                    name={comment?.userId.profile.name}
                    src={comment?.userId.profile.avatar}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/${comment.userId.userName}`);
                    }}
                  />
                  <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
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
                          navigate(`/${comment?.userId.userName}`);
                        }}
                      >
                        {comment?.userId.userName}
                      </Text>
                      <Image src="/verified.png" w={4} h={4} ml={1} />
                    </Flex>
                  </Flex>
                  <Text fontSize={"sm"}>{comment?.content}</Text>
                  {comment?.image && (
                    <Box
                      borderRadius={6}
                      overflow={"hidden"}
                      border={"1px solid"}
                      borderColor={"gray.light"}
                    >
                      <Image src={comment.image} w={"full"} />
                    </Box>
                  )}
                </Flex>
              </Flex>
              <Flex gap={3}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                  <Avatar size="md" name={user?.userName} src={user?.avatar} />
                  <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                  <Flex justify={"space-between"} w={"full"}>
                    <Flex w={"full"} alignItems={"center"}>
                      <Text fontSize={"sm"} fontWeight={"bold"}>
                        {user?.userName}
                      </Text>
                      <Image src="/verified.png" w={4} h={4} ml={1} />
                    </Flex>
                  </Flex>
                  <AutoResizeTextarea
                    placeholder={`Reply to ${comment?.userId.userName} ...`}
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
                  onClick={handleAddComment}
                  isLoading={isreplying}
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
  
  export default CreateReply;
  