import React from "react";
import { Link } from "react-router-dom";
import { Container, PostForm } from "../../Component";

function AddPost() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-3 py-8 text-white sm:px-4 sm:py-12">
        <Container>
          <div className="mx-auto max-w-6xl">
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="m15 6-6 6 6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to home
            </Link>

            <div className="mb-8 mt-4 flex items-center gap-3">
              <span className="h-10 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-indigo-500" />
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Create New Post
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                  Share your thoughts with the world.
                </p>
              </div>
            </div>

            <PostForm />
          </div>
        </Container>
      </div>
  );
}

export default AddPost;