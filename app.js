/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var ibmdb = require('ibm_db');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var bodyParser = require('body-parser');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, function() {

  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
app.use(express.static(path.join(__dirname, 'public')));

//sql service name
var SQLDBconfig = appEnv.getService("");
var db2 = SQLDBconfig.credentials;
db2.db = SQLDBconfig.credentials.db;
db2.username = SQLDBconfig.credentials.username;
db2.hostname = SQLDBconfig.credentials.hostname;
db2.password = SQLDBconfig.credentials.password;
db2.port = SQLDBconfig.credentials.port;
var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

app.post('/', routes.insert(ibmdb,connString));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

