const { app, server } = require("./app");

server.listen(process.env.PORT, () => {
  console.log(`Server is up and running on port: ${process.env.PORT}`);
});
