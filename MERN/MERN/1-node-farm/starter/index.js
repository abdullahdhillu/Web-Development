const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate.js");
//blocking asynchronous code
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// const textOut = `This is all we know about Avocados: ${textIn} \n Created on: ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File has been written");

//non-blocking asynchronous code

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3)
//       fs.writeFile(`./txt/output.txt`, `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written🏃‍♂️");
//       });
//     });
//   });
// });
// console.log("Reading File...");
//prettier-ignore
const path = require("path");
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) =>
  slugify(el.productName, {
    lower: true,
  })
);
console.log(slugs);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // console.log(query, pathname);

  if (pathname === "/" || pathname === "/overview") {
    const cardsHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(","); // replacing html template with data in dataObj
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML); // putting cardsHTML(HTML template inside  overview template) and turn it into string
    res.end(output); //displaying all cards
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello World",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen("8000", "127.0.0.1", () => {
  console.log("Listening on port 8000");
});
