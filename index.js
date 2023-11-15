import express from "express";
import bodyParser from "body-parser";
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




app.get('/', (req, res) => {
    res.send('Buddha Chatbot is running!');
  });

  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});