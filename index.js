import express from 'express';


const APP_PORT = 3000;

const app = express()
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


const welcomeMessage = (req, res) => {
  res.status(200).send({ message: "Welcome to the Mars-Command API." });
};

app.get('/', welcomeMessage);

app.listen(APP_PORT, () => {
  console.log(`shortening url service App listening on port: ${APP_PORT}`)
})