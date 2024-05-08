"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreenState = useSetRecoilState(authScreenAtom);
  const [inputs, setInputs] = useState(false);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const handleSingup = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if(data.status === 'error') {
        showToast(data.code, data.message, data.status);
        return;
      }
      localStorage.setItem('user-threads', JSON.stringify(data.metadata));
      setUser(data.metadata);
      showToast(data.statusCode, data.message, 'success');
    } catch (err) {
      showToast("Error", err, "error");
    } finally {
      setLoading(false);
    }
  } 

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="name" isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input type="text"
                    onChange={(e) => setInputs({...inputs, name: e.target.value})}
                    value={inputs.name}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="username" isRequired>
                  <FormLabel> Username</FormLabel>
                  <Input type="text"
                    onChange={(e) => setInputs({...inputs, username: e.target.value})}
                    value={inputs.username}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email"
                onChange={(e) => setInputs({...inputs, email: e.target.value})}
                value={inputs.email} 
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? "text" : "password"} 
                  onChange={(e) => setInputs({...inputs, password: e.target.value})}
                  value={inputs.password}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleSingup}
                isLoading={loading}
                loadingText="Submitting..."
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link
                  color={"blue.400"}
                  onClick={() => setAuthScreenState("login")}
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
