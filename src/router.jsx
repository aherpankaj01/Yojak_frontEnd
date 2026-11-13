
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./Component/ErrorPage.jsx";

const Home = lazy(() => import("./Component/pages/Home.jsx"));
const AddPost = lazy(() => import("./Component/pages/AddPost.jsx"));
const Signup = lazy(() => import("./Component/pages/Signup.jsx"));
const EditPost = lazy(() => import("./Component/pages/EditPost.jsx"));
const Post = lazy(() => import("./Component/pages/Post.jsx"));
const AllPost = lazy(() => import("./Component/pages/AllPost.jsx"));
const Profile = lazy(() => import("./Component/pages/Profile.jsx"));
const EditProfile = lazy(() => import("./Component/pages/EditProfile.jsx"));
const VerifyEmail = lazy(() => import("./Component/pages/VerifyEmail.jsx"));
const AuthLayout = lazy(() => import("./Component/AuthLayout.jsx"));
const Login = lazy(() => import("./Component/Login.jsx"));
const Search = lazy(() => import("./Component/pages/Search.jsx"));
const ForgotPassword = lazy(() => import("./Component/pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./Component/pages/ResetPassword.jsx"));
const SavedPosts = lazy(() => import("./Component/pages/SavedPosts.jsx"));


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
        errorElement: <ErrorPage />,
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
            { path: "/forgot-password", element: withSuspense(ForgotPassword) },
            { path: "/reset-password", element: withSuspense(ResetPassword) },
            { path: "/search", element: withSuspense(Search) },
            {
                path: "/verify-email",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <AuthLayout authentication={false}>
                            <VerifyEmail />
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
                path: "/saved",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <AuthLayout authentication>
                            <SavedPosts />
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
