const http = require("http");
const fs = require("fs");
const url = require("url");

const data = JSON.parse(fs.readFileSync(`${__dirname}/assets/data.json`));

const templates = {
  overview: fs.readFileSync(`${__dirname}/templates/overview.html`).toString(),
  productCards: fs
    .readFileSync(`${__dirname}/templates/product-card.html`)
    .toString(),
  product: fs.readFileSync(`${__dirname}/templates/product.html`).toString()
};

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%name%}/g, product.productName);
  output = output.replace(/{%image%}/g, product.image);
  output = output.replace(/{%price%}/g, product.price);
  output = output.replace(/{%from%}/g, product.from);
  output = output.replace(/{%nutrients%}/g, product.nutrients);
  output = output.replace(/{%quantity%}/g, product.quantity);
  output = output.replace(/{%description%}/g, product.description);
  output = output.replace(/{%id%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%not_organic%}/g, "not-organic");

  return output;
};

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cards = data.map(el => replaceTemplate(templates.productCards, el));

    res.end(templates.overview.replace("{%product_cards%}", cards));
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });

    const product = data[query.id];

    res.end(replaceTemplate(templates.product, product));
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h2>Page not found.</h2>");
  }
});

server.listen(3000, () => console.log("Listening on port 3000"));
