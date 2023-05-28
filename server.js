const app = require("./app");

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App Delivery listening on port ${port}`);
});

// When we click ctrl+C
process.on("SIGINT", () => {
  server.close(() => console.log("Exit Server Express"));
});
