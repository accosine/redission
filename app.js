'use strict';

var redsess = require('redsess');

function Redission (routes, cookiename, cookieexpire, redisclient, keys) {
  this.routes = routes;
  this.cookiename = cookiename;
  this.cookieexpire = cookieexpire;
  this.redisclient = redisclient;
  this.keys = keys;

  this.redSession = function redSession (req, res, cb) {
    var entrypoint = req.url.split('/')[1];

    if(routes.indexOf(entrypoint) > -1) {
      var session = new redsess(req, res, {
        cookieName: cookiename,
        expire: cookieexpire,
        client: redisclient,
        keys: [keys] // this becomes a keygrip obj
      });

      req.session = session;
      res.session = session;

      req.session.get('auth', function (err, auth) {
        if(err) throw err; // This should catch errors in the future
        if(!auth && routes.indexOf(entrypoint) > -1) {
          req.session.legit = false;
          cb();
        }
        else {
          req.session.legit = true;
          cb();
        }
      });
    }
    else {
      cb();
    }
  };
}

module.exports = Redission;

