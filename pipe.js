import Koa from "koa";
import fs from "fs";
import { promisify } from "util";
import { resolve } from "path";

const readFile = promisify(fs.readFile);
const app = new Koa();

app.use(async (ctx) => {
  try {
    ctx.body = await readFile(resolve(__dirname, "test.json"));
  } catch (err) {
    ctx.body = err;
  }
});

app.listen(3000);
