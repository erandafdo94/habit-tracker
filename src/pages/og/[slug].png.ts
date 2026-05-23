import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import { readFileSync } from "fs";
import { join } from "path";

function loadFont(weight: "400" | "700"): Buffer {
  return readFileSync(
    join(process.cwd(), `node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff`)
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => ({ params: { slug: post.data.slug } }));
};

export const GET: APIRoute = async ({ params }) => {
  const posts = await getCollection("blog");
  const post = posts.find((p) => p.data.slug === params.slug);
  if (!post) return new Response("Not found", { status: 404 });

  const { title, tags } = post.data;
  const tag = tags[0].replace(/-/g, " ");

  const interRegular = loadFont("400");
  const interBold = loadFont("700");

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fafaf6",
          padding: "72px 80px",
          fontFamily: "Inter",
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column", gap: 24 },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: 18,
                      fontWeight: 500,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    },
                    children: tag,
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: title.length > 50 ? 52 : 64,
                      fontWeight: 700,
                      color: "#111827",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      maxWidth: 900,
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#111827",
                      letterSpacing: "-0.02em",
                    },
                    children: "atomic",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: 18,
                      color: "#6b7280",
                    },
                    children: "atomichabitstracker.com",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: interBold,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000" },
  });
};
