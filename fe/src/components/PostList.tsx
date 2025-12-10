"use client";
import { ArticleListItem } from "@/interfaces/article.interface";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import Link from "next/link";
import { getArticleLink, getProfileLink, getTagLink } from "@/lib/format-link";
import Image from "next/image";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Toggle } from "./ui/toggle";
import { Eye, Heart, MessageCircle } from "lucide-react";

const PostList = ({ articles }: { articles: ArticleListItem[] }) => {
  return (
    <ItemGroup className="grid gap-4">
      {articles.map((article) => (
        <Post key={article.slug} article={article} />
      ))}
    </ItemGroup>
  );
};

const Post = ({ article }: { article: ArticleListItem }) => {
    return (
        <Item key={article.slug} variant="outline">
          <ItemHeader className="p-0">
            <Link
              href={getArticleLink(article.slug)}
              className="relative w-full h-52"
            >
              <Image
                src={article.cover_image || "/article_default.jpg"}
                alt={article.title}
                fill // Tự động lấp đầy div cha
                className="object-cover rounded-md" // Cắt ảnh để vừa khít khung
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Tối ưu hiệu năng tải ảnh
              />
            </Link>
          </ItemHeader>
          <ItemContent className="gap-4">
            <ItemMedia className="flex gap-2">
              <Avatar asChild>
                <Link href={getProfileLink(article.author.username)}>
                  <AvatarImage
                    src={article.author.image || "/user_default.jpg"}
                    alt={article.author.name}
                  />
                </Link>
              </Avatar>
              <div className="">
                <Link
                  href={getProfileLink(article.author.username)}
                  className=""
                >
                  {article.author.name}
                </Link>
                <div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(article.published_at).toLocaleDateString()}
                  </span>
                  <span className="mx-1 text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {article.reading_time} phút đọc
                  </span>
                </div>
              </div>
            </ItemMedia>
            <Link href={getArticleLink(article.slug)}>
              <ItemTitle className="text-lg font-semibold">
                {article.title}
              </ItemTitle>
              <ItemDescription>{article.description}</ItemDescription>
            </Link>
            <div className="flex gap-2 flex-wrap">
              {article.tagList.map((tag) => (
                <Button
                  asChild
                  key={tag}
                  variant="secondary"
                  className="rounded-xl"
                  size="sm"
                >
                  <Link key={tag} href={getTagLink(tag)}>
                    #{tag}
                  </Link>
                </Button>
              ))}
            </div>
          </ItemContent>
          <ItemFooter className="">
            <div className="flex gap-6">
              <div className="flex items-center">
                <Toggle
                  size="sm"
                  className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
                  onClick={() => console.log("clicked")}
                >
                  <Heart className="h-4 w-4" />
                </Toggle>
                <span className="text-sm">{article.favorite_count}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm ml-1">{article.comments_count}</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4" />
                <span className="text-sm ml-1">{article.views}</span>
              </div>
            </div>
          </ItemFooter>
        </Item>
    )
}

export default PostList;
