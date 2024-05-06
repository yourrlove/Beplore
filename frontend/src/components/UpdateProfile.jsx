import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

function UpdateProfile({user, setUser}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputs, setInputs] = useState(false);
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const handleEditProfile = async () => {
    if(!inputs) {
      handleCancel();
      return;
    }
    if(updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/profile/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const result = await res.json();
      if (result.status === "error") {
        showToast(result.code, result.message, result.status);
        return;
      }
      setUser(result.metadata);
      showToast(result.code, result.message, result.status);

    } catch (err) {
      showToast("Error", err, "error");
    } finally {
      setInputs(false);
      setUpdating(false);
      onClose();
    }
  };

  const handleCancel = async () => {
    setInputs(false);
    onClose();
  }

  return (
    <>
      <Button onClick={onOpen}>Edit Profile</Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.dark">
          <ModalHeader>Edit your account</ModalHeader>
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Textarea
                placeholder={"Write bio"}
                onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                value={inputs.bio ?? user.profile.bio}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Link</FormLabel>
              <Input
                type="text"
                placeholder={"Add Link"}
                onChange={(e) => setInputs({ ...inputs, link: e.target.value })}
                value={inputs.link ?? user.profile.link}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleEditProfile} isLoading={updating}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateProfile;
