const EventEmitter = require("events");
const http = require("http");
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}
const myEmitter = new Sales();
myEmitter.on("Sale", (NO, Name, Address) => {
  console.log("New Sale has been made");
  console.log(
    `Sale No.${NO}, \n Customer Name: ${Name} \n Address : ${Address}`
  );
});
// myEmitter.on("newSale", () => {
//   console.log("Customer Name: Abdullah");
// });
// myEmitter.on("newSale", (No) => {
//   console.log(`Sale No.${No} has been made`);
// });
myEmitter.emit("Sale", 9, "Muhammad Abdullah", "Taxila"); // Placed after observer because  it is the one that triggers the event and looks for observer, if placed before observer, it will not wokr
const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request Recieved");
  console.log(req.url);
  res.end("Request Recieved");
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Server is running on port 8000");
});
