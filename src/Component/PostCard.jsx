import React from "react";
import fileService from "../services/fileService";
import { Link } from "react-router-dom";

const PostCard = ({ $id, title, featuredImage, likeCount, commentCount }) => {
    const imageUrl = featuredImage
        ? fileService.getFilePreview(featuredImage)
        : "https://picsum.photos/400/300";

    return (
        <Link to={`/post/${$id}`} className="h-full block">
            <div className="h-full flex flex-col bg-white/10 rounded-xl overflow-hidden hover:scale-105 transition">
                <div className="w-full aspect-[4/3] overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "https://picsum.photos/400/300";
                        }}
                    />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-white font-semibold line-clamp-2 mb-2 min-h-[3rem]">
                        {title || "Untitled"}
                    </h2>
                    <div className="flex gap-4 text-gray-400 text-xs mt-auto">
                        <span>❤️ {likeCount ?? 0}</span>
                        <span>💬 {commentCount ?? 0}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostCard;