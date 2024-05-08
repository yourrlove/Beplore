"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Button,
  Flex,
  Avatar,
  useDisclosure,
  Input,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";

export default function UpdateAvatar({ user, inputs, setInputs }) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const imageRef = useRef(null);
  const [imgUrl, setImgUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setInputs({ ...inputs, file: file });
    setImgUrl(URL.createObjectURL(file));
    document.getElementById("image-input").value = "";
    onClose();
  };
  return (
    /**
     * You may move the Popover outside Flex.
     */
    <Flex justifyContent="flex-start" mt={4}>
      <Popover
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        placement="right"
        isLazy
      >
        <PopoverTrigger>
          <Avatar
            name={user.profile.name}
            src={imgUrl ?? user.profile.avatar}
            size={{
              base: "sm",
              md: "xl",
            }}
          />
        </PopoverTrigger>
        <PopoverContent
          bg="gray.dark"
          w="fit-content"
          _focus={{ boxShadow: "none" }}
        >
          <PopoverArrow />
          <PopoverBody>
            <Stack>
              <Button
                w="200px"
                variant="ghost"
                rightIcon={<FaUpload />}
                justifyContent="space-between"
                fontWeight="normal"
                fontSize="sm"
                onClick={() => imageRef.current.click()}
              >
                Upload Avatar
              </Button>
              <Input
                id="image-input"
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <Divider />
              <Button
                w="200px"
                variant="ghost"
                rightIcon={<FaTrash />}
                justifyContent="space-between"
                fontWeight="normal"
                colorScheme="red"
                fontSize="sm"
                onClick={() => setImgUrl("null")}
              >
                Remove current avatar
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
}
