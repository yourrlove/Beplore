import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { useState } from "react"
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";

const Comment = ({comment }) => {
  const [liked, setLiked] = useState(false);
  return (
    <>
        <Flex gap={4} py={2} my={2} w={"full"}>
            <Avatar src={comment.userId.profile.avatar} size={"sm"} />
            <Flex gap={1} w={"full"} flexDirection={"column"}>
                <Flex w={"full"} justify={"space-between"} alignItems={"center"}>
                    <Text fontSize="sm" fontWeight="bold">{comment.userId.userName}</Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize="sm" color={"gray.light"}>{comment.createdAt}</Text>
                        <BsThreeDots />
                    </Flex>
                </Flex>
                <Text>{comment.text}</Text>
                <Actions liked={liked} setLiked={setLiked} />
            </Flex>
        </Flex>
        <Divider />
    </>
  )
}

export default Comment