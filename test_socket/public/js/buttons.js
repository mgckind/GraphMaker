function onFileChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    };

   function onReaderLoad(event){
        var graphObj = JSON.parse(event.target.result);
        graph.clear();
        graph.fromJSON(graphObj);
         console.log('loaded');
         socket.emit('load',graph.toJSON());   
    }


function readit() {

    $.ajax({
      type: "GET",
      dataType: "json",
      cache: false,
      url: "./graphfile.json",
      success: function (jsonString, textStatus, errorThrown) {
         graph.clear();  
         graph.fromJSON(jsonString);   
        }
     });
    }

function openit(filename) {
   var filename2 = filename.replace(/^.*\\/, "");
   console.log(filename2);
       $.ajax({
      type: "GET",
      dataType: "json",
      cache: false,
      url: "./extraFiles/"+filename2,
      success: function (jsonString, textStatus, errorThrown) {
         graph.clear();  
        }
     });
    saved = false;
}


function newit(){
    graph.clear();
    saved = false;

}

function saveit(){
     //document.location = 'data:Application/octet-stream,' + encodeURIComponent(JSON.stringify(graph.toJSON()));
    var outfile = document.getElementById("theFile").value;
    if (outfile == "") {var outfile2 = "buffer.json";}
    else {var outfile2 = outfile.replace(/^.*\\/, "");}
    $.ajax({
        type : "POST",
        url : "./writejson.php",
        dataType : 'json',
        data : {fileout : outfile2, data : JSON.stringify(graph.toJSON())},
    });
};


function clearit(){
if (saved) {
    graph.clear();
    saved = false;
    socket.emit('clear');
}
else {
    alert("Warning: You haven't saved the current graph");
    saved = true;
}
};

function saveitas(){
     //document.location = 'data:Application/octet-stream,' + encodeURIComponent(JSON.stringify(graph.toJSON()));
     var jsonout = JSON.stringify(graph.toJSON());
     saveAs(new Blob([jsonout], {type:"application/json"}), "buffer.json");
     saved = true;
     //graph.clear();
};

function pngit(){
temp=graph.toJSON();
graphT.fromJSON(temp);
var bbox = paperT.getContentBBox();
paperT.setDimensions(bbox.width+bbox.x*2+30, bbox.height+bbox.y*2+30);
var svgDoc = paperT.svg;
var serializer = new XMLSerializer();
var svgString = serializer.serializeToString(svgDoc);
socket.emit('savepng',{svg:svgString, json:JSON.stringify(graph.toJSON())});
};

function svgit(){
//V(paper.svg).remove(hrr);

temp=graph.toJSON();
graphT.fromJSON(temp);
var els = graphT.getElements();
console.log(els.length, 'elements');
for (i = 0; i < els.length; i++) {
   els[i].attr('text/fill', "red"); 
};
var bbox = paperT.getContentBBox();
paperT.setDimensions(bbox.width+bbox.x*2+30, bbox.height+bbox.y*2+30);
var svgDoc = paperT.svg;
var serializer = new XMLSerializer();
var svgString = serializer.serializeToString(svgDoc);
socket.emit('modifysvg',{svg:svgString, json:JSON.stringify(graphT.toJSON())});
};

//socket.on('modifysvg', function(msg){
//saveAs(new Blob([msg.svg], {type:"application/svg+xml"}), "buffer.svg")
//});

function testit(){
 joint.layout.DirectedGraph.layout(graph);
};

