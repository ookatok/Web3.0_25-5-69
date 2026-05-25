import { NextResponse } from "next/server";
import { container } from "@/infrastructure/di/container";

export async function GET() {
  const baseUrl = "http://localhost:3000";
  const { posts } = await container.listPosts.execute({ status: "PUBLISHED" });

  const feedItems = posts
    .map((post) => {
      const pubDate = post.publishedAt 
        ? new Date(post.publishedAt).toUTCString() 
        : new Date(post.createdAt).toUTCString();
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt || ""}]]></description>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>web3.0 Articles</title>
    <link>${baseUrl}/blog</link>
    <description>สาระความรู้เรื่องเสื้อยืด เสื้อโปโล ยูนิฟอร์มพนักงาน และข่าวสารองค์กร</description>
    <language>th-TH</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${feedItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}
