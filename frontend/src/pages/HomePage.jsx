import {
  Button,
  Flex,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import CreatePost from "../components/CreatePost";

const HomePage = () => {

  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={4}
      align="stretch"
    >
      <CreatePost />
      <Link to={"/ntrknight@"}>
        <Flex w={"full"} justify={"center"}>
          <Button mx={"auto"}>Visit Profile Page</Button>
        </Flex>
      </Link>
    </VStack>
  );
};

export default HomePage;
