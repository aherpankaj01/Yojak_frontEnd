import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import userService from "../../services/userService";
import fileService from "../../services/fileService";
import Button from "../Button";
import Input from "../Input";

const BIO_LIMIT = 300;

function Section({ title, description, children }) {
    return (
        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-3">
            <div>
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm text-gray-400">{description}</p>
            </div>
            <div className="md:col-span-2">{children}</div>
        </div>
    );
}

export default function EditProfile() {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const [currentAvatar, setCurrentAvatar] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(true);

    const profilePath = userData?.$id ? `/profile/${userData.$id}` : "/";
    const nameValue = watch("name") || "";
    const bioValue = watch("bio") || "";
    const avatarField = register("avatarFile");

    useEffect(() => {
        userService.getOwnProfile().then((profile) => {
            if (profile) {
                setValue("name", profile.name);
                setValue("bio", profile.bio || "");
                setCurrentAvatar(profile.avatar || "");
            }
            setLoading(false);
        });
    }, [setValue]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleFileChange = (event) => {
        const file = event.target.files && event.target.files[0];
        setPreviewUrl(file ? URL.createObjectURL(file) : "");
        setFileName(file ? file.name : "");
    };

    const onSubmit = async (data) => {
        let avatarId = currentAvatar;

        if (data.avatarFile && data.avatarFile[0]) {
            const uploaded = await fileService.uploadFile(data.avatarFile[0]);
            if (uploaded) {
                avatarId = uploaded.$id;
            }
        }

        const result = await userService.updateProfile({
            name: data.name,
            bio: data.bio,
            avatar: avatarId,
        });

        if (result && userData) {
            navigate(profilePath);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
                <p className="animate-pulse">Loading...</p>
            </div>
        );
    }

    const avatarSrc =
        previewUrl ||
        (currentAvatar
            ? fileService.getFilePreview(currentAvatar, "avatar")
            : "https://ui-avatars.com/api/?name=" + encodeURIComponent(nameValue || "User"));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-3 py-8 text-white sm:px-4 sm:py-12">
            <div className="mx-auto max-w-3xl">
                <Link
                    to={profilePath}
                    className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="m15 6-6 6 6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to profile
                </Link>

                <div className="mb-8 mt-4 flex items-center gap-3">
                    <span className="h-10 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-indigo-500" />
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                            Edit Profile
                        </h1>
                        <p className="mt-1 text-sm text-gray-400">
                            Update how you appear to other people on Yojak.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/30"
                >
                    <div className="divide-y divide-white/10">
                        <Section
                            title="Profile photo"
                            description="A clear photo helps people recognise you."
                        >
                            <div className="flex flex-col items-center gap-5 sm:flex-row">
                                <div className="shrink-0 rounded-full bg-gradient-to-tr from-purple-400 via-indigo-400 to-pink-400 p-1">
                                    <img
                                        src={avatarSrc}
                                        alt="Avatar preview"
                                        className="h-24 w-24 rounded-full border-4 border-gray-900 object-cover"
                                    />
                                </div>

                                <div className="text-center sm:text-left">
                                    <label
                                        htmlFor="avatarFile"
                                        className="inline-block cursor-pointer rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                                    >
                                        Choose image
                                    </label>
                                    <input
                                        id="avatarFile"
                                        type="file"
                                        accept="image/png, image/jpg, image/jpeg"
                                        className="hidden"
                                        {...avatarField}
                                        onChange={(event) => {
                                            avatarField.onChange(event);
                                            handleFileChange(event);
                                        }}
                                    />
                                    <p className="mt-2 max-w-[16rem] truncate text-xs text-gray-400">
                                        {fileName || "JPG or PNG. Square images work best."}
                                    </p>
                                </div>
                            </div>
                        </Section>

                        <Section
                            title="Basic info"
                            description="Your name is shown on your profile and posts."
                        >
                            <div className="space-y-5">
                                <Input
                                    label="Name"
                                    placeholder="Your name"
                                    error={errors.name ? "Name is required" : undefined}
                                    {...register("name", { required: true })}
                                />

                                <Input
                                    label="Email"
                                    value={userData?.email || ""}
                                    readOnly
                                    disabled
                                    className="cursor-not-allowed opacity-60"
                                />
                            </div>
                        </Section>

                        <Section
                            title="About you"
                            description="A short bio shown at the top of your profile."
                        >
                            <label
                                htmlFor="bio"
                                className="mb-2 block text-xs font-medium text-gray-300 sm:text-sm"
                            >
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                {...register("bio")}
                                rows={5}
                                maxLength={BIO_LIMIT}
                                placeholder="Tell people about yourself..."
                                className="w-full resize-none rounded-lg border border-white/20 bg-white/20 p-3 text-sm text-white placeholder-gray-300 outline-none transition-all duration-300 focus:bg-white/30 focus:ring-2 focus:ring-indigo-500 sm:text-base"
                            />
                            <p className="mt-2 text-right text-xs text-gray-400">
                                {bioValue.length}/{BIO_LIMIT}
                            </p>
                        </Section>
                    </div>

                    <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-white/10 bg-black/20 px-6 py-4 sm:flex-row sm:items-center sm:px-8">
                        <Button
                            variant="outline"
                            onClick={() => navigate(profilePath)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={isSubmitting} className="sm:px-8">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}