const app = require('./index');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Example app listening at http://localhost:${port}`);
});
