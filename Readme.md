# GraphMaker

A little graph manipulation tool written in javascript, based in joint.js. Still under development. Tested on all browsers, works better in Chrome.

## Live Demo
[Here](http://matias-ck.com/graph/) you can see a live demo with some of the features!

## Requirements

- [Phantom.js](http://phantomjs.org/) (To save graph to png)
- [Joint.js](http://www.jointjs.com/) (Base library)
- [Graphviz](http://www.graphviz.org/) (convert json to dot file)
- [Node.js](https://nodejs.org/en/) (To use websockets)
- [Socket.io](http://socket.io/)  (To use web sockets)

## Use

Run a web server, (in python 2.*, for example) :

    python -m SimpleHTTPServer

Or in python 3.* :

    python3 -m http.server

and go to: http://localhost:8000/ (or the port used for the server)

In oder run with node.js and make use of websockets need to install npm_modules inside test_socket/

    npm install .

then inside test_socket/:

    node graphmaker.js

## Features

- Can save json file of the graph
- Can save to svg
- Can save to png
- Convert from json to dot file and recreate graph using GraphViz (dot)
- Drag & Drop 
- Direct graph Layout testing (in progress)

## Other tools

You can convert from json file to dot file to visualize using Graphviz

    python jointjs2dot.py <file.json>

You can also get the png as presented in the web by saving the svg file and running:

    python getpng.py <file.svg> 

This uses Phantom.js to re-render the graph and saving it to a file.
