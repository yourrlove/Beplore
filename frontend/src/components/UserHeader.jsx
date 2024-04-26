import { VStack, Box, Flex, Avatar, Text, Link, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg" 
import { useToast } from "@chakra-ui/toast"

const UserHeader = () => {
    const toast = useToast();
    const copyURL = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast({
                title: 'Success!',
                description: "Profile link copied.",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        });
    };
    return (
        <VStack gap={4} align={"start"}>
            <Flex justify="space-between" w={"full"}>
                <Box>
                    <Text fontSize={"2x1"}>NTR Knight</Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>ntrknight</Text>
                        <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar name="NTR Knight" src="./bached.jpg" 
                    size={{
                        base: "md",
                        md: "xl",
                    }} 
                />
                </Box>
            </Flex>

            <Text>Main ADC(baiter), Cosplayer, IELTS Expert and co con cac.</Text>
            <Flex w={"full"} justify={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>3.2k followers</Text>
                    <Box w='1' h='1' bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className="icon-container">
                        <BsInstagram size={24} cursor={"pointer"} />
                    </Box>
                    <Box className="icon-container">
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"} />
                            </MenuButton>
                            <MenuList bg={"gray.dark"}>
                                <MenuItem bg={"gray.dark"} onClick={copyURL}>Copy Link</MenuItem>
                                <MenuItem bg={"gray.dark"}>More Options</MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>
            
            <Flex w={"full"}>
                <Flex flex={1} borderBottom={"1.5px solid white"} justify={"center"} pb="3" cursor={"pointer"}>
                    <Text fontWeight={"bold"}>Threads</Text>
                </Flex>
                <Flex 
                    flex={1} 
                    borderBottom={"1px solid gray"} 
                    justify={"center"} 
                    color={"gray.light"}
                    pb="3" 
                    cursor={"pointer"}
                    >
                    <Text fontWeight={"bold"}>Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    )
}

export default UserHeader