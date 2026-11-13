import React from "react";
import { Container } from "../../Component";
import SavedPostsList from "../SavedPostsList";

export default function SavedPosts() {
    return (
        <div className="min-h-screen bg-gray-900 text-white py-10">
            <Container>
                <h1 className="text-3xl font-bold mb-2">Saved Posts</h1>
                <p className="text-gray-400 mb-8">Posts you've bookmarked to read later.</p>
                <SavedPostsList />
            </Container>
        </div>
    );
}