require('shelljs/global');
var express = require('express');
var app = express();
var fs = require('fs');

//var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var joint = require('jointjs');
var graph = new joint.dia.Graph;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index3.html');
});

io.on('connection', function(socket){
    socket.emit('load0',graph.toJSON());


    console.log('a user connected');
    
    socket.on('clear', function(){
        graph.clear();
        socket.broadcast.emit('clear');
    });

    socket.on('busy', function(){
        socket.broadcast.emit('busy');
    });
    
    socket.on('free', function(){
        socket.broadcast.emit('free');
    });

    socket.on('load', function(gph){
        socket.broadcast.emit('load',gph);
    });

    socket.on('addCell', function(cell){
        graph.addCells([cell]);
        socket.broadcast.emit('addCell',cell);
    });
    
    socket.on('removeCell', function(cell){
        oldCell = graph.getCell(cell.id);
            if (oldCell) {oldCell.remove();}
        socket.broadcast.emit('removeCell',cell.id);
    });

    socket.on('moveCell', function(msg){
        socket.broadcast.emit('moveCell',msg);
    });
    
    socket.on('moveLink', function(msg){
        socket.broadcast.emit('moveLink',msg);
    });
    
    socket.on('upLink', function(msg){
        mLink = graph.getCell(msg.id);
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
        mCell = graph.getCell(msg.id);
        mCell.translate(msg.x-mCell.get('position').x, msg.y-mCell.get('position').y);
    });
    
    socket.on('upGroup', function(msg){
        mCell = graph.getCell(msg.id);
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
        socket.broadcast.emit('upGroup',msg);
    });
    
    socket.on('resizeCell', function(msg){
        mCell = graph.getCell(msg.id);
        var inside= mCell.getEmbeddedCells();
        for (i = 0; i < inside.length; i++) {
        mCell.unembed(inside[i]);
    };
    mCell.position(msg.x,msg.y);
    mCell.resize(msg.w,msg.h);
        socket.broadcast.emit('resizeCell',msg);
    });
    
    socket.on('selectCell', function(msg){
        socket.broadcast.emit('selectCell',msg);
    });

    socket.on('savepng', function(msg){
        fs.writeFile("buffer.svg", msg.svg, function(err) {
    if(err) {return console.log(err);}
    console.log("The svg file was saved!");
       });

        fs.writeFile("buffer.json", msg.json, function(err) {
    if(err) {return console.log(err);}

    console.log("The json file was saved!");
    exec('python getpng.py buffer.svg');
    exec('rm -f public/buffer.png');
    cp( 'buffer.png', 'public/buffer.png'); 
       });
    socket.emit('openpng');

    });

    
    socket.on('modifysvg', function(msg){

        fs.writeFile("buffer.svg", msg.svg, function(err) {
    if(err) {return console.log(err);}
    console.log("The svg file was saved!");
       });

        fs.writeFile("buffer.json", msg.json, function(err) {
    if(err) {return console.log(err);}

    console.log("The json file was saved!");
    exec('python getsvg.py buffer.svg');
       });

    });  


});



http.listen(3000, function(){
  console.log('listening on *:3000');
});


