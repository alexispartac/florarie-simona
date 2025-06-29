'use client';
import axios from "axios";
import { BlogPostProps } from "@/app/types";
import { useQuery } from "@tanstack/react-query";


const URL_BLOG_POSTS = '/api/post';
const fetchBlogPosts = async () => {
    const response = await axios.get(URL_BLOG_POSTS);
    const posts: BlogPostProps[] = response.data;
    const reversePosts = posts.reverse();
    return reversePosts;
}

export const useBlogPosts = () => {
    return useQuery({
        queryKey: ['blogPosts'],
        queryFn: fetchBlogPosts,
    });
}