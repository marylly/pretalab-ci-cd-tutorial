const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World do Nosso tutorial');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Example app listening at http://localhost:${port}`);
});
