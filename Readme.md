# GraphMaker

A little graph manipulation tool written in javascript, based heavily in joint.js. Still under development

## Live Demo
[Here](http://mgckind.pythonanywhere.com/) you can see a live demo!

## Requirements

- [Phantom.js](http://phantomjs.org/)
- [Joint.js](http://www.jointjs.com/)
- [Graphviz](http://www.graphviz.org/)

## Use

Run a server, with for example in python 2.* :

    python -m SimpleHTTPServer

Or in python 3.* :

    python3 -m http.server

and go to: http://localhost:8000/

## Other tools

You can convert from json file to dot file to visualize using Graphviz

    python jointjs2dot.py <file.json>

You can also get the png as presented in the web by saving the svg file and running:

    python getpng.py <file.svg> 

This uses Phantom.js to re-render the graph and saving it to a file.
