"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
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

export default function Login() {
  const setUser = useSetRecoilState(userAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInpust] = useState(false);
  const setAuthScreenState = useSetRecoilState(authScreenAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify(inputs),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.status === "error") {
        showToast(data.code, data.message, data.status);
        return;
      }        
      // showToast(data.code, data.message, data.statusCode);
      localStorage.setItem("user-threads", JSON.stringify(data.metadata));
      setUser(data.metadata);
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
            Login
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
          w={{
            base: "full",
            sm: "400px",
          }}
        >
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" 
                onChange={(e) => setInpust({...inputs, email: e.target.value})}
                value={inputs.email}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? "text" : "password"} 
                  onChange={(e) => setInpust({...inputs, password: e.target.value})}
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
                loadingText="Logging in..."
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleLogin}
                isLoading={loading}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Don&apos;t have an account?{" "}
                <Link
                  color={"blue.400"}
                  onClick={() => setAuthScreenState("singup")}
                >
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
