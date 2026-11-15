import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../../Component";
import postService from "../../services/postService";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }

    postService
        .getPost(slug)
        .then((res) => {
          if (res) setPost(res);
          else navigate("/");
        })
        .catch(() => navigate("/"))
        .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 text-white">
          <p className="animate-pulse text-center text-base sm:text-lg">
            Loading post...
          </p>
        </div>
    );
  }

  return post ? (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-3 py-8 text-white sm:px-4 sm:py-12">
        <Container>
          <div className="mx-auto max-w-6xl">
            <Link
                to={`/post/${post.$id}`}
                className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="m15 6-6 6 6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to post
            </Link>

            <div className="mb-8 mt-4 flex items-center gap-3">
              <span className="h-10 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-indigo-500" />
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Edit Post
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                  Update your content easily.
                </p>
              </div>
            </div>

            <PostForm post={post} />
          </div>
        </Container>
      </div>
  ) : null;
}

export default EditPost;