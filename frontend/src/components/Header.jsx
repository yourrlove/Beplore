import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { GoHome } from "react-icons/go";
import { Link as RouterLink } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";


const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  return (
    <Flex justifyContent={"flex-start"} my={4}>
      <Image
        cursor={"pointer"}
        alt="logo"
        ml={!user ? [100, 450, 500, 530, 540, 545, 550] : 0}
        mr={[4, 40, 140, 240, 340]}
        w={9}
        src={colorMode === "dark" ? "/white-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {user && (
        <Link mr={[6, 16, 60, 160]} as={RouterLink} to="/">
          <GoHome size={30} />
        </Link>
      )}
      {user && (
        <Link mr={[6, 16, 60, 160]} as={RouterLink} to="/">
          <CiSearch size={30} />
        </Link>
      )}
      {user && (
        <Link as={RouterLink} to={`/${user.userName}`}>
          <RxAvatar size={30} />
        </Link>
      )}
      {user && (
        <Flex ml={300} >
          <Button
            size={"sm"}
            onClick={logout}
          >
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
