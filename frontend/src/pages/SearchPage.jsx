import {
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { CiSearch } from "react-icons/ci";
import accountsAtom from "../atoms/accountsAtom";
import Account from "../components/Account";
import userAtom from "../atoms/userAtom";
import Post from "../components/Post";
import postsAtom from "../atoms/postsAtom";

const SearchPage = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [isclick, setClick] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useRecoilState(accountsAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [input, setInput] = useState(undefined);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  useEffect(() => {
    const getAccounts = async () => {
      setLoading(true);
      setAccounts([]);
      try {
        const res = await fetch(
          `/api/users/?currentUser=${currentUser._id}&keyword=undefined`
        );
        const result = await res.json();
        if (result.status === "error") {
          showToast(result.code, result.message, result.status);
          return;
        }
        setAccounts(result.metadata);
      } catch (err) {
        showToast("Error", err, "error");
      } finally {
        setLoading(false);
      }
    };
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/feeds/search/?currentUser=${currentUser._id}&keyword=undefined`);
        const result = await res.json();
        if (result.status === "error") {
          showToast(result.code, result.message, result.status);
          return;
        }
        setPosts(result.metadata);
      } catch (err) {
        showToast("Error", err, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
    getAccounts();
  }, [showToast, setAccounts, currentUser, setPosts]);
  const getUser = async () => {
    try {
      const res = await fetch(
        `/api/users/?currentUser=${currentUser._id}&keyword=undefined`
      );
      const result = await res.json();
      if (result.status === "error") {
        showToast(result.code, result.message, result.status);
        return;
      }
      setAccounts(result.metadata);
    } catch (err) {
      showToast("Error", err, "error");
    }
  };
  const getUserBykeyword = async (event) => {
    try {
      if (event.keyCode === 13) {
        const res = await fetch(
          `/api/users/?currentUser=${currentUser._id}&keyword=${input}`
        );
        const result = await res.json();
        if (result.status === "error") {
          showToast(result.code, result.message, result.status);
          return;
        }
        setAccounts(result.metadata);
      }
    } catch (err) {
      showToast("Error", err, "error");
    }
  };
  const getPostsBykeyword = async (event) => {
    try {
      if (event.keyCode === 13) {
        const res = await fetch(`/api/posts/feeds/search/?currentUser=${currentUser._id}&keyword=${input}`);
        const result = await res.json();
        if (result.status === "error") {
          showToast(result.code, result.message, result.status);
          return;
        }
        setPosts(result.metadata);
      }
    } catch (err) {
      showToast("Error", err, "error");
    }
  };
  const handelClick = async (event) => { 
    if(!isclick) {
        getUserBykeyword(event);
    } else {
        getPostsBykeyword(event);
    }
}
  return (
    <VStack spacing={4} align="stretch">
      <Flex>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <CiSearch size={30} color="gray.dark" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search"
            onKeyDown={handelClick}
            onChange={(e) => {
              setInput(e.target.value);
              if (!e.target.value) {
                getUser();
              }
            }}
            value={input}
          />
        </InputGroup>
      </Flex>
      <HStack>
        <Flex w={"full"}>
          <Flex
            flex={1}
            borderBottom={!isclick ? "1.5px solid white" : "1px solid gray"}
            justifyContent={"center"}
            color={!isclick ? "white" : "gray.light"}
            pb="3"
            cursor={"pointer"}
            onClick={() => setClick(!isclick)}
          >
            <Text fontWeight={"bold"}> Users</Text>
          </Flex>
          <Flex
            flex={1}
            borderBottom={isclick ? "1.5px solid white" : "1px solid gray"}
            justifyContent={"center"}
            color={isclick ? "white" : "gray.light"}
            pb="3"
            cursor={"pointer"}
            onClick={() => setClick(!isclick)}
          >
            <Text fontWeight={"bold"}> Threads</Text>
          </Flex>
        </Flex>
      </HStack>
      <>
        {!loading && accounts.length === 0 && <h1>Not have any users.</h1>}
        {loading && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}
        {!isclick
          ? accounts.map((account) => (
              <Account key={account._id} account={account} />
            ))
          : posts.map((post) => (
              <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
      </>   
    </VStack>
  );
};

export default SearchPage;
