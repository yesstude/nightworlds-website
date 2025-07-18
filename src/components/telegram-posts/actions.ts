"use server";
import { ITag, parse, SyntaxKind, walk } from "html5parser";

const POSTS_URL = "https://t.me/s/nightworlds_channel";
const URL_REGEX =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

export type TelegramPost = {
  imageUrl?: string;
  bodyHtml: string;
  postUrl?: string;
};

export async function fetchTelegramPosts() {
  const html = await (await fetch(POSTS_URL)).text();
  const ast = parse(html);

  let posts: TelegramPost[] = [];

  walk(ast, {
    enter(node, parent, index) {
      if (node.type !== SyntaxKind.Tag) return;
      if (node.name !== "div") return;
      if (!Array.isArray(node.body)) return;
      if (!hasClasses(node, "tgme_widget_message_text", "js-message_text"))
        return;

      let imageUrl: string | undefined;
      let postUrl: string | undefined;
      if (parent?.type == SyntaxKind.Tag && parent.name == "div") {
        if (
          parent.body?.find(
            (t) =>
              t.type == SyntaxKind.Tag &&
              hasClasses(t, "tgme_widget_message_forwarded_from"),
          )
        )
          return;
        const imgtag = parent.body?.find(
          (t) =>
            t.type == SyntaxKind.Tag &&
            hasClasses(t, "tgme_widget_message_photo_wrap"),
        );
        if (imgtag && imgtag.type == SyntaxKind.Tag) {
          const style = imgtag.attributes.find((v) => v.name.value == "style")
            ?.value?.value;
          imageUrl = style?.match(URL_REGEX)?.[0];
          postUrl = imgtag.attributes.find((v) => v.name.value == "href")?.value
            ?.value;
          if (imageUrl) imageUrl = `https://${imageUrl}`;
        }
      }

      posts.push({
        bodyHtml: html.substring(node.start, node.end),
        imageUrl,
        postUrl,
      });
    },
  });

  return posts;
}

function getClasses(node: ITag) {
  const classes = node.attributes.find((v) => v.name.value == "class")?.value
    ?.value;
  if (!classes) return [];
  if (typeof classes !== "string") return [];
  return (classes as string).split(" ");
}

function hasClasses(node: ITag, ...classes: string[]) {
  const elcls = getClasses(node);
  for (const cl of classes) {
    if (!elcls.includes(cl)) return false;
  }
  return true;
}
