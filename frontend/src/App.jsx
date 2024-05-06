import { Container, VStack } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import HomePage from "./pages/HomePage";
import LogoutButton from "./components/LogoutButton";
import TestPage from "./pages/TestPage";

function App() {
  const user = useRecoilValue(userAtom);
  return (
    <VStack>
      <Header />
      <Container maxW="620px">
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/:username"
            element={user ? <UserPage /> : <Navigate to="/auth" />}
          />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>

        {user && <LogoutButton />}
      </Container>
    </VStack>
  );
}

export default App;
