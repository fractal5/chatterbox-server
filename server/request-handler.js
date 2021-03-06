/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var _ = require('underscore');
var fs = require('fs');

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // request is an http.IncomingMessage
  // response is an http.ServerResponse
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "text/plain";

  // Execute response based on the request method (POST, GET, etc.)
  if (request.method === 'POST') {
    var fullBody = '';
    request.on('data', function (chunk) {
      fullBody += chunk.toString();
    });

    request.on('end', function() {
      fs.exists('messages.json', function (exists) {
        if (!exists) {
          fullBody = '[' + fullBody + ']';
          fs.appendFile('messages.json', fullBody, function (err) {
            // TODO: handle errors ... possibly return error code to client
            console.log(err);
          });
        } else {
          fs.readFile('messages.json', function(err, data) {
            var newData = JSON.parse(data.toString());
            newData.push(JSON.parse(fullBody));
            newData = JSON.stringify(newData);
            fs.writeFile('messages.json', newData, function (err) {
              // error handling with ref to err
            });
          });
        }
      });
    });
  }
  // else if (request.method === 'GET')

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end("Hello, World!");
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var responses = {};

responses.POST = function () {

};

responses.GET = function () {

};

exports.requestHandler = requestHandler;
