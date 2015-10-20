require('shelljs/global');
var express = require('express');
var app = express();
var fs = require('fs');

//var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var joint = require('jointjs');
var graph = new joint.dia.Graph;

var newpages = ['default'];
var graphdict = {};

graphdict['default']=graph;
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res){
  res.sendfile(__dirname + '/index3.html');
});

io.on('connection', function (socket){

    socket.on('shakehand', function(path){;
    path = path.slice(1);
    console.log(path);
    if (path == '') {
        path = 'default'
    }
    socket.room = path;
    socket.join(socket.room);
    socket.graph = graphdict[path];
    socket.emit('load0',socket.graph.toJSON());
    console.log('a user connected to room '+socket.room);
    });

    
    socket.on('clear', function(){
        socket.graph.clear();
        socket.broadcast.to(socket.room).emit('clear');
    });

    socket.on('busy', function(){
        socket.broadcast.to(socket.room).emit('busy');
    });
    
    socket.on('free', function(){
        socket.broadcast.to(socket.room).emit('free');
    });

    socket.on('load', function(gph){
        socket.broadcast.to(socket.room).emit('load',gph);
    });

    socket.on('addCell', function(cell){
        socket.broadcast.to(socket.room).emit('addCell',cell);
    });
    
    socket.on('removeCell', function(cell){
        socket.broadcast.to(socket.room).emit('removeCell',cell.id);
    });

    socket.on('moveCell', function(msg){
        socket.broadcast.to(socket.room).emit('moveCell',msg);
    });
    
    socket.on('moveLink', function(msg){
        socket.broadcast.to(socket.room).emit('moveLink',msg);
    });
    
    socket.on('upLink', function(msg){
        socket.broadcast.emit('upLink',msg);
    });


    socket.on('upGroup', function(msg){
        socket.broadcast.to(socket.room).emit('upGroup',msg);
    });
    
    socket.on('resizeCell', function(msg){
        socket.broadcast.to(socket.room).emit('resizeCell',msg);
    });
    
    socket.on('selectCell', function(msg){
        socket.broadcast.to(socket.room).emit('selectCell',msg);
    });

    socket.on('savegraph', function(msg){
        socket.graph.fromJSON(msg.json);
        socket.broadcast.to(socket.room).emit('load',socket.graph.toJSON());
    });

    socket.on('testdagre', function(msg){
        socket.graph.fromJSON(msg.json);
        socket.broadcast.to(socket.room).emit('load',socket.graph.toJSON());
    });

    socket.on('savepng', function(msg){
        fs.writeFile("buffer.svg", msg.svg, function(err) {
    if(err) {return console.log(err);}
    console.log("The svg file was saved!");

    exec('python getpng.py buffer.svg');
    exec('rm -f public/buffer.png');
    cp( 'buffer.png', 'public/buffer.png'); 
    socket.emit('openpng');
       });

    });


    socket.on('newroom', function (text){
        console.log(text);
        console.log(newpages.length);
        if (newpages.length < 50){
          newpages.push(text);
          app.get('/'+text, function (req, res) {
            res.sendfile(__dirname + '/index3.html');
              });
          socket.leave(socket.room);
          socket.join(text);
          if (text in graphdict){
             console.log('graph in room exists already');
            }
            else{
                console.log('new grpah');
                graphdict[text]=new joint.dia.Graph;
            }
          socket.room=text;
          console.log('new room '+socket.room);
          socket.graph=graphdict[text];
          socket.emit('moveroom', text);
        }
        else {
            socket.emit('nomoveroom', newpages);
        }
    });


    
    socket.on('modifysvg', function(msg){

        fs.writeFile("buffer.svg", msg.svg, function(err) {
    if(err) {return console.log(err);}
    console.log("The svg file was saved!");
    exec('python getsvg.py buffer.svg');
       });


    });  


});



http.listen(3000, function(){
  console.log('listening on *:3000');
});


