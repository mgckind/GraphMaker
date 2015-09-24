joint.shapes.tm = {};
joint.shapes.tm.toolElement = joint.shapes.basic.Generic.extend({

    toolMarkup: ['<g class="element-tools">',
        '<g class="element-tool-remove"><circle fill="red" r="11"/>',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this element from the model</title>',
        '</g>',
        '</g>'].join(''),

    defaults: joint.util.deepSupplement({
        attrs: {
            text: { 'font-weight': 400, 'font-size': 'small', fill: 'black', 'text-anchor': 'middle', 'ref-x': .5, 'ref-y': .5, 'y-alignment': 'middle' },
        },
    }, joint.shapes.basic.Generic.prototype.defaults)

});



joint.shapes.tm.Actor = joint.shapes.tm.toolElement.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect/><title class="tooltip"/></g><a><text/></a></g>',

    defaults: joint.util.deepSupplement({

        type: 'tm.Actor',
        attrs: {
            rect: { fill: 'white', stroke: 'black', 'stroke-width': 1, 'follow-scale': true, width: 160, height: 80 },
            text: { ref: 'rect'}
        },
        size: { width: 160, height: 80 }
    }, joint.shapes.tm.toolElement.prototype.defaults)
});

joint.shapes.tm.MyText = joint.shapes.basic.TextBlock.extend({
 toolMarkup: ['<g class="element-tools">',
        '<g class="element-tool-remove"><circle fill="red" r="11"/>',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this element from the model</title>',
        '</g>',
        '</g>'].join(''),
         defaults: joint.util.deepSupplement({

        type: 'tm.Actor',
        attrs: {
            rect: { fill: 'white', stroke: 'black', 'stroke-width': 1, 'follow-scale': true, width: 160, height: 80 },
            text: { ref: 'rect'}
        },
        size: { width: 160, height: 80 }
    }, joint.shapes.basic.TextBlock.prototype.defaults)

});

joint.shapes.tm.ActorText = joint.shapes.tm.MyText.extend({

  defaults: joint.util.deepSupplement({

        type: 'tm.ActorText',
        attrs: {
            rect: { fill: 'white', stroke: 'black', 'stroke-width': 1, 'follow-scale': true, width: 160, height: 80 },
            text: { ref: 'rect'}
        },
        size: { width: 160, height: 80 }
    }, joint.shapes.tm.MyText.prototype.defaults)
});


//custom view

joint.shapes.tm.ToolElementView = joint.dia.ElementView.extend({
    initialize: function() {
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
    },
    render: function () {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.renderTools();
        this.update();
        return this;
    },
    renderTools: function () {
        var toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');
        if (toolMarkup) {
            var nodes = V(toolMarkup);
            V(this.el).append(nodes);
        }
        return this;
    },
    pointerclick: function (evt, x, y) {
        this._dx = x;
        this._dy = y;
        this._action = '';
        var className = evt.target.parentNode.getAttribute('class');
        switch (className) {
            case 'element-tool-remove':
                this.model.remove();
                return;
                break;
            default:
        }
        joint.dia.CellView.prototype.pointerclick.apply(this, arguments);
    }
});


joint.shapes.tm.ActorView = joint.shapes.tm.ToolElementView;
joint.shapes.tm.ActorTextView = joint.shapes.tm.ToolElementView;







function onCreateButtonClick(){
  graph0.clear();
  var cname = document.forms["NewCell"]["fname"].value;
  var charL = cname.length;
  console.log(charL);
  //var clink = javaScript:void(0);
  var clink = document.forms["NewCell"]["flink"].value;

  var celldashed = document.getElementById("iscelldashed").checked;
   
if (clink.length < 2) {
    var clink = "javaScript:void(0);";}

if (cellkind == 1) { var cellcolor =  "#7cbf00";}
if (cellkind == 2) { var cellcolor =  "#bf0000";}
if (cellkind == 3) { var cellcolor =  "#6495ED";}


var actor = new joint.shapes.tm.Actor({
    position: {x:(300-(Math.max(charL*10,45)))/2, y:40},
    size: { width: Math.max(charL*10,45), height: 40 },
    attrs: { rect: { fill: 'transparent', stroke : cellcolor, 'stroke-width': 3 }, 
        a: { 'xlink:href': clink,  'xlink:show': 'new', cursor: 'pointer' },
             text: { text: cname,  fill: '#fff' } }
});

var actor_d = new joint.shapes.tm.Actor({
    position: {x:(300-(Math.max(charL*10,45)))/2, y:40},
    size: { width: Math.max(charL*10,45), height: 40 },
    attrs: { rect: { fill: 'transparent', stroke : cellcolor, 'stroke-width': 3, 'stroke-dasharray' : "5 5" }, 
        a: { 'xlink:href': clink,  'xlink:show': 'new', cursor: 'pointer' },
             text: { text: cname,  fill: '#fff' } }
});

  //console.log(cellkind);
  if (celldashed) {
    actor_d.prop({ name: { text: 'Cell' } });
    actor_d.prop({ kind: { text: cellkind } });
    graph0.addCell([actor_d]);
  }
  else {
    actor.prop({ name: { text: 'Cell' } });
    actor.prop({ kind: { text: cellkind } });
    graph0.addCell([actor]);
  }
  document.getElementById("mytext").innerHTML = "INFO: Drag this cell below. Move inside Group to embed. <br/> This cell does not re-scale.";
};


function onCreateGroup(gg){
  graph0.clear();
  var celldashed = document.getElementById("iscelldashed").checked;
   

if (gg==1) { var gcolor =  "yellow";}
if (gg==2) { var gcolor =  "#C974FF";}

var actor = new joint.shapes.tm.Actor({
    position: {x:80, y:10},
    size: { width: 140, height: 100 },
    attrs: { rect: { fill: 'transparent', stroke : gcolor, 'stroke-width': 3 }, 
        a: { cursor: 'pointer' },
           }
});

var actor_d = new joint.shapes.tm.Actor({
    position: {x:80, y:10},
    size: { width: 140, height: 100 },
    attrs: { rect: { fill: 'transparent', stroke : gcolor, 'stroke-width': 3, 'stroke-dasharray' : "5 5" }, 
        a: { cursor: 'pointer' },
       }
});



  //console.log(cellkind);
  if (celldashed) {
    actor_d.prop({ name: { text: 'Group' } });
    actor_d.prop({ kind: { text: gg } });
    graph0.addCell([actor_d]);
  }
  else {
    actor.prop({ name: { text: 'Group' } });
    actor.prop({ kind: { text: gg } });
    graph0.addCell([actor]);
  }

  document.getElementById("mytext").innerHTML = "INFO: Drag this group cell below. Use all corners but top-left to rescale.  <br/> Move on top of cells or move cells inside to embed content.";
};


function onCreateText(){
  graph0.clear();
   
var actort = new joint.shapes.tm.ActorText({
    position: {x:80, y:10},
    size: { width: 140, height: 100 },
    attrs: { rect: { fill: 'transparent', stroke : "white", 'stroke-width': 2 }, text:{fill:'white'}},
    content: "<p style='color:white;'>asdf asdf asdf asdf this needs to word wrap</p>"
});

    actort.prop({ name: { text: 'Group' } });
    actort.prop({ kind: { text: 0 } });
    graph0.addCell([actort]);

  document.getElementById("mytext").innerHTML = "INFO: Drag this group cell below. Use all corners but top-left to rescale.";
};




function onCreateLinkClick(lc){
  graph0.clear();
  var Lname = document.forms["NewLink"]["Lname"].value;

  var hh = $(window).height()*0.15;
  var ww = $(window).width()*0.01;

  var dashed = document.getElementById("isdashed").checked;

  if (lc==1) {
    var linecolor = "#bf5600";
    var textcolor = "#bfac00";
  }
  if (lc ==2){
    var linecolor = "#7FFFD4"//"#bf5600";
    var textcolor = "#FF80AA" //"#bfac00";
  }

   var cell = new joint.dia.Link({
        //source: { x:ww, y:hh*0.1 },
        //target: { x: ww*2, y:hh },
        source: { x:70, y:50 },
        target: { x: 230, y:70 },
        labels: [{ position: .5, attrs: { 
            text: { text: Lname , 'font-weight': 'bold' , fill: textcolor},
            rect : {fill : '#333'} } }],
        attrs: { 
        '.connection': { 'stroke-width': 3, stroke: linecolor },
                },

    });

   var cell_d = new joint.dia.Link({
        source: { x:70, y:50 },
        target: { x: 230, y:70 },
        labels: [{ position: .5, attrs: { 
            text: { text: Lname , 'font-weight': 'bold' , fill: textcolor},
            rect : {fill : '#333'} } }],
        attrs: { 
        '.connection': { 'stroke-width': 3, stroke: linecolor, 'stroke-dasharray' : "5 5" },
                },

    });

   
  if (dashed) {
    if (linkkind == 1) {
        cell_d.attr({ '.marker-target': {fill: linecolor, stroke: linecolor, d: 'M 10 0 L 0 5 L 10 10 z'}});
        }
    if (linkkind == 2) {
      cell_d.attr({ '.marker-source': {fill: linecolor, stroke: linecolor, d: 'M 10 0 L 0 5 L 10 10 z'}});
      cell_d.attr({ '.marker-target': {fill: linecolor, stroke: linecolor, d: 'M 10 0 L 0 5 L 10 10 z'}});
       }
       }
    else {
        if (linkkind == 1) {
        cell.attr({ '.marker-target': {fill: linecolor, stroke: linecolor, d: 'M 10 0 L 0 5 L 10 10 z'}});
        }
    if (linkkind == 2) {
      cell.attr({ '.marker-source': {fill: linecolor, stroke: linecolor, d: 'M 10 0 L 0 5 L 10 10 z'}});
      cell.attr({ '.marker-target': {fill: linecolor, stroke: linecolor, d: 'M 10 0 L 0 5 L 10 10 z'}});
       }


    }


   //cell_d.attr({ '.marker-source': {fill: '#bf5600', stroke: '#bf5600', d: 'M 10 0 L 0 5 L 10 10 z'}});
   //cell_d.attr({ '.marker-target': {fill: '#bf5600', stroke: '#bf5600', d: 'M 10 0 L 0 5 L 10 10 z'}});

    if (dashed) { 
        cell_d.set('smooth' , true);
        cell_d.prop({ name: { text: 'Link' } });
        cell_d.prop({ kind: { text: linkkind} });
        graph0.addCell(cell_d);
        }
    else {
        
        cell.set('smooth' , true);
        cell.prop({ name: { text: 'Link' } });
        cell.prop({ kind: { text: linkkind} });
        graph0.addCell(cell);

    }
  document.getElementById("mytext").innerHTML = "INFO: Drag this link below, select endpoints and connect them to cells";
};




