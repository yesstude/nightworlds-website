"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { fetchTelegramPosts, TelegramPost } from "./actions";
import { Button } from "../ui/button";
import Link from "next/link";
import { Icon } from "../ui/icon";

export default function TelegramPosts() {
  const { data } = useQuery({
    queryKey: ["telegram_posts"],
    async queryFn() {
      return fetchTelegramPosts();
    },
  });

  if (!data) return;
  const posts = data.filter((p) => !!p.imageUrl).reverse();
  return (
    <Carousel>
      <CarouselContent>
        {posts.map((v, i) => (
          <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
            <Post {...v} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:block" />
      <CarouselNext className="hidden md:block" />
    </Carousel>
  );
}

function Post({ bodyHtml, imageUrl, postUrl }: TelegramPost) {
  return (
    <Card
      variant="filled"
      className="flex flex-col overflow-hidden text-md font-medium"
    >
      {imageUrl && (
        <CardHeader className="p-0">
          <img src={imageUrl} className="object-cover rounded-b-[20px]" />
        </CardHeader>
      )}
      <CardContent
        className="pt-5 [&_>_div]:line-clamp-[12]"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
      {postUrl && (
        <CardFooter className="justify-end">
          <Link href={postUrl} target="_blank">
            <Button type="button" variant="outlined">
              Читать полностью
              <Icon icon="arrow_outward" size={16} className="-mr-2" />
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
