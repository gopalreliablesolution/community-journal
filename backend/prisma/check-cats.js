import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const cats = await p.category.findMany({ select: { name: true, slug: true } });
cats.forEach(c => console.log(c.slug, "-", c.name));
await p.$disconnect();
