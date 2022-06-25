import JSONdb from 'simple-json-db'
import path from 'path';
import url from 'url';

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
  if(hash.length!=6) throw new Error('invalid hash detected')
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
  //TODO: algotirhm to hash urls
  const hash = '000'
  const reg = {
    id: hash,
    url: urlAddress,
    timestamp: new Date().getTime(),
    ipAddress: clientIp,
  };
  dbUrls.set(hash, reg);
  return hash;
}
