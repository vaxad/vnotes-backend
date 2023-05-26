const connectMongo=require('./db');

connectMongo();

const express = require('express');
const app = express();
var cors = require('cors')
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.get("/", (req, res) => {
  res.send("Server is working");
});

app.listen(port, () => {
  console.log(`vNotebook backend listening on port ${port}`)
})