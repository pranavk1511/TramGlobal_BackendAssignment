# URL Shortener API

This is a simple URL shortener API built with Node.js, Express.js, and MongoDB. The API allows users to shorten long URLs, retrieve the history of shortened URLs for a given user, and redirect short URLs to their corresponding long URLs.

## Features

### 1. Shorten URL Endpoint (`POST /shorten`)

- Endpoint to shorten a long URL.
- Supports optional preferred custom short URLs.
- Implements user tier-based rate limiting for requests.
- Saves URL data and user tier information to MongoDB.
- longUrl,user,userTier are mandatory feilds


#### Request Example:

```json
{
  "longUrl": "https://www.google.com/maps",
  "user": "Pranav",
  "userTier": 1,
  "preferredUrl": "custom_short_url"
}
```

### 2. History Endpoint  (`GET /history/:user`)
- This endpoint retrieves the history of shortened URLs for a given user. 
- It returns a JSON object containing user information, user tiers, and the history array.    

#### Response Example: 
 ```json
{
    "history": [
        {
            "_id": "654e70412fd901a2d73f6aa1",
            "longUrl": "https://www.google.com/maps",
            "shortUrl": "bitly",
            "user": "Pranav",
            "__v": 0
        },
    ]
}

```


### 3. Redirect Endpoint (`GET /:shortUrl`)
- This endpoint redirects short URLs to their corresponding long URLs. 
- It also handles 404 errors for non-existing short URLs.
#### Response Example: 
 ```json
{
    // Renders Webpage
}
```


| Feature | Description | Status |
| ------- | ----------- | ------ |
| Shorten URL Endpoint | Takes in a long URL and returns a shortened one with a random short ending. | ✅ Implemented |
| History Endpoint | Returns a history of all URLs shortened by a given user. | ✅ Implemented |
| Redirect Short URLs | Short URLs actually redirect to their long URL counterparts. | ✅ Implemented |
| Tier-based Requests | Requests are tier-based. For example, Tier 1 users can make 1000 requests, and Tier 2 users can make 100 requests. | ✅ Implemented |
| User-Preferred URL | Creation of a user-preferred URL is recommended over a random URL (not mandatory). | ✅ Implemented |


Acess to test api throught postman : https://api.postman.com/collections/12076549-15ac0635-7caa-44e0-9c89-95a404bbcce3?access_key=PMAT-01HEX92758VFNDZE6PC5PEXMJ6# TramGlobal_BackendAssignment
