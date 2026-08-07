import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const user = await p.user.findFirst({ select: { id: true, name: true } });
console.log("User fields:", Object.keys(user || {}));
await p.$disconnect();
