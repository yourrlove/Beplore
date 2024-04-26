import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"

const UserPage = () => {
  return <>
    <UserHeader />
    <UserPost likes={1200} replies={481} postImg="/post1.png" postTitle="Let's talk about threads."/>
    <UserPost likes={2600} replies={200} postImg="/company.png" postTitle="We need you!."/>
    <UserPost likes={3200} replies={100} postImg="/bached.jpg" postTitle="My new avatar:)!."/>
  </>
}

export default UserPage