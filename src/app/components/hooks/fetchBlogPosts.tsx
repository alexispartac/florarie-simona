'use client';
import axios from "axios";
import { BlogPostProps } from "@/app/types";
import { useQuery } from "@tanstack/react-query";


const URL_BLOG_POSTS = 'http://localhost:3000/api/post';
const fetchBlogPosts = async () => {
    const response = await axios.get(URL_BLOG_POSTS);
    const posts: BlogPostProps[] = response.data;
    return posts;
}

export const useBlogPosts = () => {
    return useQuery({
        queryKey: ['blogPosts'],
        queryFn: fetchBlogPosts,
    });
}