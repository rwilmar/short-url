import express from 'express';
import path from 'path';
import { getRegister, getUrl, saveUrl } from './persistence.js';

const APP_PORT = 3000;

const app = express()
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

/** json welcome message response */
const welcomeMessage = (req, res) => {
  res.status(200).send({ message: "Welcome to the URL-Shortener API." });
};

/**
 * shorten url middleware
 * @param {express.Request} req - express request object
 * @param {object} req.body - http body object
 * @param {string} req.body.url - url in string format 
 * @param {express.Response} res - express res object
 * @returns {Promise<void>}
 */
const shortenUrl = async (req, res) => {
  try{
    const url = req.body.url;
    if(!url) throw new Error('url empty or not found in body');
    const shortenPath = await saveUrl(url, req.ip);
    return res.status(201).send({
      isOk: true,
      shortenPath,
    });
  }
  catch(error){
    res.status(500).send({
      isOk: false,
      message: 'the system was not able to shorten the url, Error: '+error.message,
    });
  }
}

/**
 * get url details middleware
 * @param {express.Request} req - express request object
 * @param {object} req.params - http request url params object
 * @param {string} req.body.hash - url in string format 
 * @param {express.Response} res - express res object
 * @returns {Promise<void>}
 */
 const getUrlAddress = async (req, res) => {
  try{
    const hash = req.params.hash;
    if(!hash) throw new Error('hash empty or not found in parameter');
    const reg = await getRegister(hash);
    return res.status(201).send({
      url: reg.url,
      created: new Date(reg.timestamp),
      client: reg.ipAddress,
    });
  }
  catch(error){
    res.status(500).send({
      isOk: false,
      message: 'The system was not able to get the url, Error: '+error.message,
    });
  }
}

/**
 * get url details middleware
 * @param {express.Request} req - express request object
 * @param {object} req.params - http request url params object
 * @param {string} req.body.hash - url in string format 
 * @param {express.Response} res - express res object
 * @returns {Promise<void>}
 */
 const redirToHash = async (req, res) => {
  try{
    const hash = req.params.hash;
    if(!hash) throw new Error('hash empty or not found in parameter');
    const newUrl = await getUrl(hash);
    return res.redirect(newUrl);
  }
  catch(error){
    res.status(500).send({
      isOk: false,
      message: 'The system was not able to get the url, Error: '+error.message,
    });
  }
}

// ******** ROUTES ********
app.get('/', (req, res) => {
  if(req.headers?.accept.includes('text/html')) 
    res.sendFile(path.resolve('.', 'index.htm')); 
  else
    return welcomeMessage(req, res);
});
app.post('/shorten', shortenUrl);
app.get('/:hash/details', getUrlAddress);
app.get('/:hash', redirToHash);


app.listen(APP_PORT, () => {
  console.log(`Shortening url service App listening on port: ${APP_PORT}`)
})