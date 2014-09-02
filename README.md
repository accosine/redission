redission
=========

A session middleware on top of redSess. Written for
[bare](https://github.com/accosine/bare "Not a framework™").

Possibly compatible with express (not tested).

    var Redission = require('redission');

    //Then, sometime later, add routes, cookie name, session expiration time, 
    //redisClient and the keys with which you want to sign the cookie.
    var redission = new Redission(['admin', 'secret'], 'cookiename', 6000, redisClient, 'signingkey');

If you are authenticated, the request object will have a key `session.legit` which is `true`, otherwise `false`.
