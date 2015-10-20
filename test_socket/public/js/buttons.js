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


  function makeid()
  {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 9; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

    function newroom(){
    var text = makeid();
    socket.emit('newroom',text);
    //window.location.replace("/abc");
  };

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
socket.emit('savepng',{svg:svgString});
};

function svgit(){
//V(paper.svg).remove(hrr);

temp=graph.toJSON();
graphT.fromJSON(temp);
var els = graphT.getElements();
console.log(els.length, 'elements');
//for (i = 0; i < els.length; i++) {
//   els[i].attr('text/fill', "red"); 
//};
var bbox = paperT.getContentBBox();
paperT.setDimensions(bbox.width+bbox.x*2+30, bbox.height+bbox.y*2+30);
var svgDoc = paperT.svg;
var serializer = new XMLSerializer();
var svgString = serializer.serializeToString(svgDoc);
var nbreak = svgString.search('><');
var headline = svgString.slice(0,nbreak);
headline = headline.concat(' style="background: #333">')
var rest = svgString.slice(nbreak+1);
//console.log(headline.concat(mystyles, rest), svgString.length, rest);
//socket.emit('modifysvg',{svg:svgString});
//};
saveAs(new Blob([headline.concat(mystyles, rest)], {type:"application/svg+xml"}), "buffer.svg");
};

function testit(){
 joint.layout.DirectedGraph.layout(graph);
 socket.emit('testdagre',{json:graph.toJSON()});
};

var mystyles='\
  <style type="text/css"><![CDATA[ \
    .connection-wrap { \
   fill: none; \
   stroke: black; \
   stroke-width: 15; \
   stroke-linecap: round; \
   stroke-linejoin: round; \
   opacity: 0; \
} \
 \
.connection { \
   fill: none; \
   stroke-linejoin: round; \
} \
 \
.marker-source, .marker-target { \
   vector-effect: non-scaling-stroke; \
} \
 \
 \
.marker-vertices { \
   opacity: 0; \
} \
.marker-arrowheads { \
   opacity: 0; \
} \
.link-tools { \
   opacity: 0; \
} \
.link-tools .tool-options { \
   display: none;      \
} \
.link-tools .tool-remove circle { \
   fill: red; \
} \
.link-tools .tool-remove path { \
   fill: white; \
} \
 \
.marker-vertex { \
   fill: #1ABC9C; \
} \
 \
.marker-arrowhead { \
   fill: #1ABC9C; \
} \
 \
.marker-vertex-remove { \
   opacity: .1; \
   fill: white; \
} \
 \
.marker-vertex-group:hover .marker-vertex-remove { \
   opacity: 1; \
} \
 \
.marker-vertex-remove-area { \
   opacity: .1; \
} \
 \
.highlighted { \
    opacity: 0.7; \
} \
 \
text.highlighted { \
    fill: #FF0000; \
} \
 \
@media screen and (-webkit-min-device-pixel-ratio:0) { \
    .highlighted { \
        outline: 2px solid #FF0000; \
        opacity: initial; \
    } \
} \
 \
.element .fobj { \
    overflow: hidden; \
} \
.element .fobj body { \
    background-color: transparent; \
    margin: 0px; \
} \
.element .fobj div { \
    text-align: center; \
    vertical-align: middle; \
    display: table-cell; \
    padding: 0px 5px 0px 5px; \
} \
.element .element-tools { \
        display: none; \
} \
 \
  ]]></style> ';

