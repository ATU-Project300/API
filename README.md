# API

## Usage

### CRUD:

**GET**

Returns all games in JSON

**POST**

*Requires valid key*

**PUT**

*Requires valid key*

**DELETE**

*Requires valid key*

### Keys

A secure key should be created within the environment file such that it is loaded upon starting the server. The key will then be supplied within requests which require it. Upon receiving a request which requires a key, the server will compare the locally stored key and the one within the request, if they match, the request is accepted, else it is rejected.

The environment file, and the key is stores, is not to be accessible to the public unless the data in the database is meant to be publicly accessible and modifiable.


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
| StabilityRating   | 
| Image   | 
| Consoles   | 
