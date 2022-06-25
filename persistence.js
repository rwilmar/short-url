import JSONdb from 'simple-json-db';
import path from 'path';
import url from 'url';
import crypto from 'crypto';

const HASH_LENGTH = 6;

const URL = url.URL;
const dcUrlPath = path.resolve('.', 'urls.json');
const dbUrls = new JSONdb(dcUrlPath);

/**
 * basic validatation for a hash (type and length) throws error if invalid 
 * @param {string} hash - hash to evaluate  
 * @returns {string}
 */
const validateHash = (hash) => {
  if(!(typeof(hash)=='string')) throw new Error('url is not a valid string')
  if(hash.length!=HASH_LENGTH) throw new Error('invalid hash detected')
  return hash;
}

/**
 * validates a string for parsing into a valid URL, throws error if invalid
 * @param {string} urlString 
 * @returns {string}
 */
const validateUrlString = (urlString) => {
  try {
    new URL(urlString);
    return urlString;
  } catch {
    throw new Error('the address specified is not a valid url');
  }
};

/**
 * @typedef UrlRegister
 * @type {object}
 * @property {string} id - hash identificator 
 * @property {string} url - full url saved
 * @property {number} timestamp - ms timestamp on creation
 * @property {string} ipAddress - client ip source
 */

/**
 * returns a url from a hash using the local persistence database
 * @param {string} hash - 6 digit hash for url recovery 
 * @returns {UrlRegister}
 */
export const getUrl = async (hash) => {
  const reg = dbUrls.get(validateHash(hash));
  return reg.url;
}

/**
 * returns a url register details from a hash using the local persistence database
 * @param {string} hash - 6 digit hash for url recovery 
 * @returns {UrlRegister}
 */
 export const getRegister = async (hash) => {
  const reg = dbUrls.get(validateHash(hash));
  if(!reg) throw new Error('no url was found for the hash: '+hash)
  return reg;
}

/**
 * save a url into the database and returns the hash if successful
 * @param {string} urlAddress 
 * @param {string} clientIp 
 * @returns {string}
 */
export const saveUrl = async (urlAddress, clientIp=null) => {
  validateUrlString(urlAddress);
  const hash = await hashCreator(urlAddress);
  const reg = {
    id: hash,
    url: urlAddress,
    timestamp: new Date().getTime(),
    ipAddress: clientIp,
  };
  dbUrls.set(hash, reg);
  return hash;
}

/**
 * Creates a valid and unique hash in the db for the url provided
 * validates the url and try to avoid collisions
 * @param {string} stringUrl - url string to create a hash in db 
 * @returns {string}
 */
const hashCreator = async(stringUrl) => {
  const SLEEP_INTERVAL = 13; //wait a prime number of ms 
  const MAX_COLLISION_RETRY = 6;
  const createHash = (string) => {
    const tm = new Date().toISOString()
    return crypto.createHash('md5').update(string+tm).digest('base64'); //use base64 to improve # of combinations
  }
  const sleepInterval = (msInterval) => {
    return new Promise((resolve) => {
      setTimeout(resolve, msInterval);
    });
  }

  for(let i=1;i<=MAX_COLLISION_RETRY;i++){
    const md5Hash = createHash(stringUrl).substring(0, HASH_LENGTH);
    if(!dbUrls.has(md5Hash)){ //check collision
      return md5Hash;
    }
    await sleepInterval(SLEEP_INTERVAL*i); //try to avoid collision increasing local timestamp
  }
  throw new Error('cannot create a url identificator, the application database is full');
}
