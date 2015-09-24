var express = require('express');
var app = express();

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
    //io.emit('ggg',graph.toJSON()); #initial graph
    socket.on('pos', function(msg){
        console.log(msg.id,msg.x,msg.y);
        cell=graph.getCell(msg.id);
        cell.position(msg.x, msg.y);
        socket.broadcast.emit('ggg',graph.toJSON());
    });
    
    socket.on('clear', function(){
        graph.clear();
        socket.broadcast.emit('clear');
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
        socket.broadcast.emit('upLink',msg);
    });
    
    socket.on('upGroup', function(msg){
        socket.broadcast.emit('upGroup',msg);
    });
    
    socket.on('resizeCell', function(msg){
        socket.broadcast.emit('resizeCell',msg);
    });
    
    socket.on('selectCell', function(msg){
        socket.broadcast.emit('selectCell',msg);
    });

    


});



http.listen(3000, function(){
  console.log('listening on *:3000');
});


