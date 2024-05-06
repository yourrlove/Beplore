import { Flex, Image, useColorMode } from "@chakra-ui/react";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex mt={6} mb={"12"} mr={1200}>
      <Image
        cursor={"pointer"}
        alt="logo"
        w={9}
        src={colorMode === "dark" ? "/white-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}   
      />
    </Flex>
  );
};

export default Header;
