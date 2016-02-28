# BCS Hackathon Workshop App

## Tech we are using

### NodeJS
https://nodejs.org/en/

NodeJS is a runtime for JavaScript that is well suited for a wide variety of web applications. NodeJS is "non-blocking" so when you make a call that could be slow (eg. a database query or a call to another web service) your application doesn't just stop, it continues processing other events.

NodeJS code is often written in a fairly functional manner so for those of you who know Racket you should be fairly comfortable diving in to NodeJS.

### Express
http://expressjs.com/

Express is a framework on top of NodeJS that makes it easy to build a web application. It handles the HTTP layer for you without doing soo much that you no longer know what is happening.

The key aspects for a simple app like this is the route handling using app.<get|post|put>('/url/route/:variable', handler_function). The handler function is then passed a request object usually labelled "req" which holds data from the request such as parameter data or the JSON body. It is also passed a response object usually labelled "res" which is used to format the response.

### Socket.IO
http://socket.io/

Socket.IO is great for supporting real time communication between your web server and your client app.

To use it simply call io.emit('message header', 'message body'). If you want to make the message body a complex data structure simply use JSON.stringify(complexObject) to create your message body and then use JSON.parse() on the other end to turn it back into a Javascript object.

### Bootstrap
http://getbootstrap.com/

Bootstrap provides an easy way to make your website look decent with little knowledge of HTML/CSS. I am not going to go over it much in this workshop but you can find many helpful resources online.

## Example App

A simple app that connects everyone to one chat server and emits every message to everyone.

### Setup

Make sure you have NodeJS installed. Clone this repository to a directory on your computer. In a terminal window navigate to that directory and run 'npm install' to install the libraries specified in the package.json file.

### Run the app

Type 'node index.js' in the command line to run the server and then navigate to 'localhost:3000' in your browser to view the page.

## How to extend the app

Use Socket.IO to extend any "real-time" aspects of the app. Examples would be live quizzes, following a stream of data(eg. a twitter feed or updates to an API),