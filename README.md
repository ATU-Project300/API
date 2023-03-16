# API

## Endpoints

* `/games`

* `/emulators`


## Requests

**GET**

* Returns all games or emulators in JSON.

**POST**

* *Requires valid key*

**PUT**

* *Requires valid key*

**DELETE**

* *Requires valid key*

## Keys

A secure key should be created within the environment file such that it is loaded upon starting the server. The key will then be supplied within requests which require it. Upon receiving a request which requires a key, the server will compare the locally stored key and the one within the request, if they match, the request is accepted, else it is rejected.

By default, GET requests will not require a key but this can be changed by moving the following (located in `routes/games.js` and `routes/emulators.js`) above the `router.get` method.

```
if (!process.env.SKIP_AUTH || process.env.SKIP_AUTH == "false") {
    router.use((req, res, next) => {
        const apiKey = req.get('API_KEY')
        if (!apiKey || apiKey !== process.env.API_KEY) {
            res.status(401).json({ error: 'Unauthorised' })
        } else {
            next()
        }
    })
}
```

The environment file, and the key is stores, is not to be accessible to the public unless the data in the database is meant to be publicly accessible and modifiable.

For testing, the key requirement can be disabled by adding `SKIP_AUTH=true` to the environment file (`.env`).
This will require the API to be restarted.


## Data Structure

| **Game**  |
|-------------- |
| Title    | 
| Year   | 
| Description   | 
| Image   | 
| Consoles   | 
| *Emulator*   | 

| **Emulator**  |
|-------------- |
| Name    | 
| Description   | 
| Image   | 
| Console   | 

## Rate limiting

The API is currently limited to 10,000 requests per a 10 minute "window".

This is only for testing and non-public usage. The rate *will* be tuned for production.

## Environment example

```
PORT=3000
API_KEY=yourkeyhere
SKIP_AUTH=false
CSTRING=mongodb+srv://USER:PASS@SERVER/DB
```
