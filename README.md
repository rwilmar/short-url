# short-url
Shortening url node application
The default port for the application is 3000

## Root endpoint
A GET request to the root directory detects request from a browser or api and send response accordingly, with a basic html frontend or a json welcome message

## Shorten a url
use the webpage form to get the code to shorten the url or use the api request
for the API request send a HTTP POST request to /shorten with the body specifying the url to shorten.
```
{ 
    "url": "https://github.com/rwilmar/short-url"
}
```
the program will only accept valid urls.
a successful response will include the hash required to query the long url or it can be used directly as a subpath, in the latter case a redirect will point to the url saved.

example response:
```
{
    "isOk": true,
    "shortenPath": "lrwrRX"
}
```

## get details of a shorten hash
An HTTP GET request can be done to the endpoint /:hash/details to query the existence and details of a shortened url
```
{
    "url": "https://www.google.com/search",
    "created": "2022-06-25T22:07:09.352Z",
    "client": "::ffff:127.0.0.1"
}
```

## Automatic redirect
if an http/https valid url has been saved a GET directly requesting the hash will be responded with an HTTP redirection to the saved long URL

i.e a GET to "http://localhost:3000/lrwrRX" (use any ip where the service is published) will redirect to the saved url "https://www.google.com/search"

