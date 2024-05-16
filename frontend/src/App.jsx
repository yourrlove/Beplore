import { Container, VStack } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import HomePage from "./pages/HomePage";
import ReplyPage from "./pages/ReplyPage";
import SearchPage from "./pages/SearchPage";
import NotificationPage from "./pages/NotificationPage";
import { useEffect, useState } from "react";
import { useSocket } from "./context/socket";
import notificationsAtom from "./atoms/notificationsAtom";

function App() {
  const user = useRecoilValue(userAtom);
  const { socket, onlineUsers } = useSocket();

  return (
    <VStack>
      <Container maxW="1200px">
        <Header />
      </Container>
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
            path="/:userName"
            element={user ? <UserPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/:userName/post/:postId"
            element={user ? <PostPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/:userName/post/reply/:commentId"
            element={user ? <ReplyPage /> : <Navigate to="/auth" />}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Routes>
      </Container>
    </VStack>
  );
}

export default App;
