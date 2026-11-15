import React, { useCallback, useEffect, useState, Suspense, lazy } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "..";
import postService from "../../services/postService";
import fileService from "../../services/fileService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { clearCache } from "../../utils/simpleCache";

const RTE = lazy(() => import("../RTE"));

const STATUS_OPTIONS = [
  {
    value: "active",
    title: "Active",
    text: "Shown on Home and All Posts.",
  },
  {
    value: "inactive",
    title: "Inactive",
    text: "Kept private, not shown in public lists.",
  },
];

function Card({ title, hint, children }) {
  return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {hint && <p className="mt-1 text-sm text-gray-400">{hint}</p>}
        </div>
        {children}
      </section>
  );
}

function EditorFallback() {
  return (
      <div className="flex w-full flex-col gap-2 sm:gap-3">
        <label className="text-xs font-medium text-gray-300 sm:text-sm">
          Content
        </label>
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-white/20 bg-white/10 sm:h-[400px] sm:rounded-xl">
          <p className="animate-pulse text-sm text-gray-400">Loading editor...</p>
        </div>
      </div>
  );
}

export default function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const statusValue = watch("status");
  const slugValue = watch("slug");
  const imageField = register("image", { required: !post });

  const existingImage =
      post && post.featuredImage
          ? fileService.getFilePreview(post.featuredImage)
          : "";
  const imageSrc = previewUrl || existingImage;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
    setFileName(file ? file.name : "");
  };

  const submit = async (data) => {
    if (post) {
      const file = data.image[0]
          ? await fileService.uploadFile(data.image[0])
          : null;

      if (file) {
        fileService.deleteFile(post.featuredImage);
      }

      const dbPost = await postService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : post.featuredImage,
      });

      if (dbPost) {
        clearCache("home-posts-");
        clearCache("profile-posts-");
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      const file = await fileService.uploadFile(data.image[0]);

      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        const dbPost = await postService.createPost({
          ...data,
          userId: userData.$id,
        });

        if (dbPost) {
          clearCache("home-posts-");
          clearCache("profile-posts-");
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
          .trim()
          .toLowerCase()
          .replace(/[^a-zA-Z\d\s]+/g, "-")
          .replace(/\s/g, "-")
          .slice(0, 36)
          .replace(/-+$/, "");

    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
      <form
          onSubmit={handleSubmit(submit)}
          className="grid gap-6 lg:grid-cols-3 lg:items-start"
      >
        <div className="space-y-6 lg:col-span-2">
          <Card title="Post details" hint="Give your post a title and write the content.">
            <div className="space-y-5">
              <Input
                  label="Title"
                  placeholder="An interesting title"
                  error={errors.title ? "Title is required" : undefined}
                  {...register("title", { required: true })}
              />

              <div>
                <Input
                    label="Slug"
                    placeholder="post-url-slug"
                    error={errors.slug ? "Slug is required" : undefined}
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                      setValue("slug", slugTransform(e.currentTarget.value), {
                        shouldValidate: true,
                      });
                    }}
                />
                <p className="mt-2 truncate text-xs text-gray-500">
                  Post link: /post/{slugValue || "your-slug"}
                </p>
              </div>

              <Suspense fallback={<EditorFallback />}>
                <RTE
                    label="Content"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                />
              </Suspense>
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24">
          <Card title="Featured image" hint="Shown on cards and at the top of your post.">
            <label
                htmlFor="featured-image"
                className={`group relative block cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition ${
                    errors.image
                        ? "border-red-400/60"
                        : "border-white/20 hover:border-purple-400/60"
                }`}
            >
              {imageSrc ? (
                  <>
                    <img
                        src={imageSrc}
                        alt="Featured preview"
                        className="aspect-video w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100">
                  <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-gray-900">
                    Change image
                  </span>
                    </div>
                  </>
              ) : (
                  <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-white/[0.03] px-4 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                    <p className="text-sm font-medium text-white">Click to upload</p>
                    <p className="text-xs text-gray-400">PNG, JPG or GIF</p>
                  </div>
              )}
            </label>

            <input
                id="featured-image"
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                className="hidden"
                {...imageField}
                onChange={(event) => {
                  imageField.onChange(event);
                  handleImageChange(event);
                }}
            />

            {fileName && (
                <p className="mt-2 truncate text-xs text-gray-400">{fileName}</p>
            )}
            {errors.image && (
                <p className="mt-2 text-xs text-red-400">Featured image is required</p>
            )}
          </Card>

          <Card title="Visibility" hint="Choose who can find this post.">
            <div className="space-y-3">
              {STATUS_OPTIONS.map((option) => (
                  <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${
                          statusValue === option.value
                              ? "border-purple-400/60 bg-purple-500/10"
                              : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                  >
                    <input
                        type="radio"
                        value={option.value}
                        className="mt-1 h-4 w-4 accent-purple-500"
                        {...register("status", { required: true })}
                    />
                    <span>
                  <span className="block text-sm font-semibold text-white">
                    {option.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-400">
                    {option.text}
                  </span>
                </span>
                  </label>
              ))}
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            <Button type="submit" loading={isSubmitting} className="w-full">
              {post ? "Save changes" : "Publish post"}
            </Button>
            <Button
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
  );
}