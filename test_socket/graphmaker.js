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
        socket.graph.addCells([cell]);
        socket.broadcast.to(socket.room).emit('addCell',cell);
    });
    
    socket.on('removeCell', function(cell){
        oldCell = socket.graph.getCell(cell.id);
            if (oldCell) {oldCell.remove();}
        socket.broadcast.to(socket.room).emit('removeCell',cell.id);
    });

    socket.on('moveCell', function(msg){
        socket.broadcast.to(socket.room).emit('moveCell',msg);
    });
    
    socket.on('moveLink', function(msg){
        socket.broadcast.to(socket.room).emit('moveLink',msg);
    });
    
    socket.on('upLink', function(msg){
        mLink = socket.graph.getCell(msg.id);
    if (msg.vertices !== undefined){
        mLink.set('vertices',msg.vertices);
    }

        if (msg.source.id === undefined){
        mLink.set('source',{x:msg.source.x, y:msg.source.y});
    }
    else{
        mLink.set('source',{id:msg.source.id});
    }
    if (msg.target.id === undefined){
        mLink.set('target',{x:msg.target.x, y:msg.target.y});
    }
    else{
        mLink.set('target',{id:msg.target.id});
    }
        socket.broadcast.emit('upLink',msg);
    });

        socket.on('upCell', function(msg){
        mCell = socket.graph.getCell(msg.id);
        mCell.translate(msg.x-mCell.get('position').x, msg.y-mCell.get('position').y);
    });
    
    socket.on('upGroup', function(msg){
        mCell = socket.graph.getCell(msg.id);
        /*
        var inside= msg.inside;
        console.log(inside.length,inside[0].id);
        if (inside.length > 0) {
        for (i = 0; i < inside.length; i++) { 
             if (inside[i].get('parent') !== mCell.id){
             mCell.embed(inside[i]);
             //inside[i].toFront();
                    }
            }
            mCell.toBack();
        }
        */
        mCell.translate(msg.x-mCell.get('position').x, msg.y-mCell.get('position').y);
        socket.broadcast.to(socket.room).emit('upGroup',msg);
    });
    
    socket.on('resizeCell', function(msg){
        mCell = socket.graph.getCell(msg.id);
        var inside= mCell.getEmbeddedCells();
        for (i = 0; i < inside.length; i++) {
        mCell.unembed(inside[i]);
    };
    mCell.position(msg.x,msg.y);
    mCell.resize(msg.w,msg.h);
        socket.broadcast.to(socket.room).emit('resizeCell',msg);
    });
    
    socket.on('selectCell', function(msg){
        socket.broadcast.to(socket.room).emit('selectCell',msg);
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
        if (newpages.length < 30){
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


