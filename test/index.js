var Lab = require('lab')
  , redsess = require('redsess')
  , Redission = require('../app')
  , redisClient = require('fakeredis').createClient();
  // , redisClient = require('redis').createClient();

var lab = exports.lab = Lab.script();

lab.experiment('Test if valid session is recognized', function () {
  var redission = new Redission(['admin'], 'bare', 60000, redisClient, 'asdf');
  redisClient.set('session:g8/yaok0HrTJhOza9LEFnUPnVP3sZMXe7wuc5Apd',
    '{\"auth\":\"test\"}');

  var req = {
    url:'/admin',
    headers: {
      'cookie': 'bare=g8/yaok0HrTJhOza9LEFnUPnVP3sZMXe7wuc5Apd; bare.sig=CQYjuFIzzPs1bbCusIRnOPflozc'
    },
    connection: {encrypted:true}
  }
    , res = {
      set: true,
      getHeader: function() {},
    };

  lab.before(function (done) {

    function next() {
      done();
    }
    redission.redSession(req, res, next);
  });

  lab.test('Validate redission instance', function (done) {
    Lab.expect(redission).to.be.an.instanceof(Redission);
    Lab.expect(redission).to.be.an('object');
    Lab.expect(redission).to.have.property('routes');
    Lab.expect(redission.routes).to.be.an('array');
    Lab.expect(redission.redSession).to.be.a('function');
    Lab.expect(redission.routes[0]).to.equal('admin');
    Lab.expect(redission.cookiename).to.equal('bare');
    Lab.expect(redission.cookieexpire).to.equal(60000);
    Lab.expect(redission.redisclient).to.be.an('object');
    Lab.expect(redission.keys).to.equal('asdf');
    Lab.expect(req.session.legit).to.equal(true);
    done();
  });
});

lab.experiment('Test if invalid session is recognized', function () {
  var redission = new Redission(['admin'], 'bare', 60000, redisClient, 'asdf');

  var req = {
    url:'/admin',
    headers: {
      'cookie': ''
    },
    connection: {encrypted:true}
  }
    , res = {
      set: true,
      getHeader: function() {},
    };

  lab.before(function (done) {

    function next() {
      done();
    }
    redission.redSession(req, res, next);
  });

  lab.test('Validate redission instance', function (done) {
    Lab.expect(redission).to.be.an.instanceof(Redission);
    Lab.expect(redission).to.be.an('object');
    Lab.expect(redission).to.have.property('routes');
    Lab.expect(redission.routes).to.be.an('array');
    Lab.expect(redission.redSession).to.be.a('function');
    Lab.expect(redission.routes[0]).to.equal('admin');
    Lab.expect(redission.cookiename).to.equal('bare');
    Lab.expect(redission.cookieexpire).to.equal(60000);
    Lab.expect(redission.redisclient).to.be.an('object');
    Lab.expect(redission.keys).to.equal('asdf');
    Lab.expect(req.session.legit).to.equal(false);
    done();
  });
});

