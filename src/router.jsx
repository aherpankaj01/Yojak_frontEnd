import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";


const Home = lazy(() => import("./Component/pages/Home.jsx"));
const AddPost = lazy(() => import("./Component/pages/AddPost.jsx"));
const Signup = lazy(() => import("./Component/pages/Signup.jsx"));
const EditPost = lazy(() => import("./Component/pages/EditPost.jsx"));
const Post = lazy(() => import("./Component/pages/Post.jsx"));
const AllPost = lazy(() => import("./Component/pages/AllPost.jsx"));
const Profile = lazy(() => import("./Component/pages/Profile.jsx"));
const EditProfile = lazy(() => import("./Component/pages/EditProfile.jsx"));

const AuthLayout = lazy(() => import("./Component/AuthLayout.jsx"));
const Login = lazy(() => import("./Component/Login.jsx"));


const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <p className="animate-pulse text-lg">Loading...</p>
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(App),
    children: [
      { path: "/", element: withSuspense(Home) },

      {
        path: "/login",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthLayout authentication={false}>
              <Login />
            </AuthLayout>
          </Suspense>
        ),
      },

      {
        path: "/signup",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthLayout authentication={false}>
              <Signup />
            </AuthLayout>
          </Suspense>
        ),
      },

      {
        path: "/all-posts",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthLayout authentication>
              <AllPost />
            </AuthLayout>
          </Suspense>
        ),
      },

      {
        path: "/add-post",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthLayout authentication>
              <AddPost />
            </AuthLayout>
          </Suspense>
        ),
      },

      {
        path: "/edit-post/:slug",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthLayout authentication>
              <EditPost />
            </AuthLayout>
          </Suspense>
        ),
      },

      {
        path: "/profile/:userId",
        element: withSuspense(Profile),
      },

      {
        path: "/edit-profile",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthLayout authentication>
              <EditProfile />
            </AuthLayout>
          </Suspense>
        ),
      },

      { path: "/post/:slug", element: withSuspense(Post) },
    ],
  },
]);