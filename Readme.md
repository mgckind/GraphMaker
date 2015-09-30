# GraphMaker

A little graph manipulation tool written in javascript, based heavily in joint.js. Still under development

## Live Demo
[Here](http://mgckind.pythonanywhere.com/) you can see a live demo!

## Requirements

- [Phantom.js](http://phantomjs.org/)
- [Joint.js](http://www.jointjs.com/)
- [Graphviz](http://www.graphviz.org/)
- [Node.js](https://nodejs.org/en/)
- [Socket.io](http://socket.io/)

## Use

Run a server, with for example in python 2.* :

    python -m SimpleHTTPServer

Or in python 3.* :

    python3 -m http.server

and go to: http://localhost:8000/

In oder run with node.js and make use of websockets need to install npm_modules inside test_socket/

    npm install .

then inside test_socket/:

    node graphmaker.js

## Features

- Can save json file
- Can save svg
- Can save png
- Convert from json to dot file
- Drag & Drop
- Direct graph testing (in progress)

## Other tools

You can convert from json file to dot file to visualize using Graphviz

    python jointjs2dot.py <file.json>

You can also get the png as presented in the web by saving the svg file and running:

    python getpng.py <file.svg> 

This uses Phantom.js to re-render the graph and saving it to a file.
