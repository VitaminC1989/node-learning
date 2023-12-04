import Stream from "stream";
const readableStream = new Stream.Readable({
  read() {},
});

readableStream.on("readable", () => {
  const cont = readableStream.read();
  console.log("readable", cont, cont.toString());
});

const writableStream = new Stream.Writable({
  write(chunk, encoding, next) {
    console.log(chunk.toString());
    next();
  },
});

// process.stdin.pipe(writableStream);

readableStream.pipe(writableStream);
readableStream.push("hey");
readableStream.push("Judy");
