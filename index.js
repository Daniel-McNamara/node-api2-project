// imports express to run server
const server = require("./api/server");

// establishes port that server will be listening on
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`\n ** Server Running on http://localhost:${PORT} **\n`);
});