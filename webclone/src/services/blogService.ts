import type { StorefrontBlogPost } from "../types/storefront";

interface BlogPostsResponse {
  posts: StorefrontBlogPost[];
}

export async function getBlogPosts(): Promise<StorefrontBlogPost[]> {
  const response = await fetch("/api/blog-posts.json");
  if (!response.ok) {
    throw new Error(`Unable to load blog posts. HTTP ${response.status}`);
  }
  const data = (await response.json()) as BlogPostsResponse;
  return data.posts;
}

