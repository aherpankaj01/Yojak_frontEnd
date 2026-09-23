import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import userService from "../../services/userService";
import fileService from "../../services/fileService";
import Button from "../Button";
import Input from "../Input";

export default function EditProfile() {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const { register, handleSubmit, setValue } = useForm();
    const [currentAvatar, setCurrentAvatar] = useState("");
    const [loading, setLoading] = useState(true);

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
            navigate(`/profile/${userData.$id}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p className="animate-pulse">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
            <div className="w-full max-w-lg backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Edit Profile
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Name"
                        placeholder="Your name"
                        {...register("name", { required: true })}
                    />

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Bio</label>
                        <textarea
                            {...register("bio")}
                            rows={4}
                            placeholder="Tell people about yourself..."
                            className="w-full bg-white/20 text-white border-none rounded-lg p-3 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                    </div>

                    <Input
                        label="Avatar Image"
                        type="file"
                        accept="image/png, image/jpg, image/jpeg"
                        {...register("avatarFile")}
                    />

                    <div className="flex justify-center pt-2">
                        <Button type="submit" className="px-10">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}