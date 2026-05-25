import { MetadataRoute } from "next";
import { container } from "@/infrastructure/di/container";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "http://localhost:3000";

  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/services/t-shirt",
    "/services/polo",
    "/services/cap",
    "/services/uniform",
    "/faq",
    "/contact",
    "/privacy-policy",
    "/blog",
    "/portfolio",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch blogs
  const { posts } = await container.listPosts.execute({ status: "PUBLISHED" });
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Fetch portfolio projects
  const { projects } = await container.listProjects.execute({ status: "PUBLISHED" });
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: project.createdAt || new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
