import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

// Endpoint: crédits carbone
app.get("/credits", async (req, res) => {
  const credits = await prisma.credit.findMany();
  res.json(credits);
});

// Endpoint: empreinte carbone
app.post("/footprint", async (req, res) => {
  const { wallet, value } = req.body;
  const user = await prisma.user.upsert({
    where: { wallet },
    update: { footprint: { increment: value } },
    create: { wallet, footprint: value },
  });
  res.json(user);
});

app.listen(4000, () => {
  console.log("API running on http://localhost:4000");
});
