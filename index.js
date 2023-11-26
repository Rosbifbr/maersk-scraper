const express = require('express');
const app = express();
const port = 3000;

//Import module routes
app.use(require('./routes/maersk'));

//List all routes
app.get('/?', (req, res) => {
  res.json(app._router.stack.filter(r => r.name == "bound dispatch").map(r => r.route.path))
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
