import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Profile from "./pages/Profile";
import Regi from "./pages/Regi";
import Sign from "./pages/Sign";
import Friends from "./pages/Friends";
// import RootLayout from "./pages/RootLayout";

import RootLayout from "./pages/RootLayout";
import Post from "./pages/Post";

function App() {
  let router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Regi />} />
        <Route path="/signin" element={<Sign />} />

        <Route path="/" element={<RootLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route  path="friends" element={<Friends />} />
          <Route path="post" element={<Post />} />
        </Route>
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
