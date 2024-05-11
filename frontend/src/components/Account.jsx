import { Link, useNavigate } from "react-router-dom";
import {
  Flex,
  Avatar,
  Text,
  Image,
  Stack,
  Button,
  Divider,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";
import accountsAtom from "../atoms/accountsAtom";

const Account = ({ account }) => {
  const currentUser = useRecoilValue(userAtom);
  const [accounts, setAccounts] = useRecoilState(accountsAtom);
  const navigate = useNavigate();
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false);
  const [following, setFollowing] = useState(
    account.profile.followers.includes(currentUser._id)
);
  const handleFollow = async () => {
    if (!currentUser) {
      showToast("Error", "You must be logged in to follow users.", "error");
      return;
    }
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`api/users/follow/${account._id}`, {
        method: "PUT",
      });
      const result = await res.json();
      if (result.status === "error") {
        showToast(result.code, result.message, result.status);
        return;
      }
      console.log(account);
      if (following) {
        showToast("Success!", `Unfollowed ${account.userName}`, "success");
        const updatedAccounts = accounts.map(p => {
            if(p._id === account._id) {
              return { ...p, 
                profile: { 
                    ...p.profile, 
                    followers: p.profile.followers.filter(id => id !== currentUser._id) }
                };
            }
            return p;
          });
          setAccounts(updatedAccounts);
      } else {
        showToast("Success!", `Followed ${account.userName}`, "success");
        const updatedAccounts = accounts.map(p => {
            if(p._id === account._id) {
              return { ...p, 
                profile: { 
                    ...p.profile, 
                    followers: [ ...p.profile.followers, currentUser._id ] }
                };
            }
            return p;
          });
          setAccounts(updatedAccounts);
      }
      setFollowing(!following);
    } catch (err) {
      showToast("Error", err, "error");
    } finally {
      setUpdating(false);
    }
  };
  return (
    <Link to={`/${account.userName}`}>
      <Flex gap={3} py={2} justifyContent={"space-between"}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={account.profile.name}
            src={account.profile.avatar}
            onClick={() => {
              navigate(`/${account.userName}`);
            }}
          />
        </Flex>
        <Flex flex={1} flexDirection={"column"}>
          <Flex justify={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Stack>
                <Flex>
                  <Text
                    className="text-underline"
                    fontSize={"sm"}
                    fontWeight={"bold"}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/${account.userName}`);
                    }}
                  >
                    {account.userName}
                  </Text>
                  <Image src="/verified.png" w={4} h={4} ml={1} />
                </Flex>
                <Text color={"gray"}>{account.profile.name}</Text>
                <Text>{account.profile.followers.length} followers</Text>
              </Stack>
            </Flex>
          </Flex>
        </Flex>
        {currentUser._id !== account._id && (
          <Button
            size={"sm"}
            onClick={(e) => {
                e.preventDefault();
                handleFollow();
            }}
            isLoading={updating}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        )}
      </Flex>
      <Divider />
    </Link>

  );
};

export default Account;
