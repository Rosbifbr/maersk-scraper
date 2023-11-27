const express = require('express');
const app = express();
const port = 3000;

//Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next()
})

//Import module routes
app.use(require('./routes/maersk'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});