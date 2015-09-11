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

function onCreateButtonClick(){
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
    position: {x:0, y:0},
    size: { width: Math.max(charL*8,45), height: 40 },
    attrs: { rect: { fill: ' #333', stroke : cellcolor, 'stroke-width': 3 }, 
        a: { 'xlink:href': clink,  'xlink:show': 'new', cursor: 'pointer' },
             text: { text: cname,  fill: '#fff' } }
});

var actor_d = new joint.shapes.tm.Actor({
    position: {x:0, y:0},
    size: { width: Math.max(charL*8,45), height: 40 },
    attrs: { rect: { fill: ' #333', stroke : cellcolor, 'stroke-width': 3, 'stroke-dasharray' : "5 5" }, 
        a: { 'xlink:href': clink,  'xlink:show': 'new', cursor: 'pointer' },
             text: { text: cname,  fill: '#fff' } }
});

  //console.log(cellkind);
  if (celldashed) {graph.addCell([actor_d]);}
  else {graph.addCell([actor]);}
};



function onCreateLinkClick(){
  var Lname = document.forms["NewLink"]["Lname"].value;

  var hh = $(window).height()*0.15;
  var ww = $(window).width()*0.01;

  var dashed = document.getElementById("isdashed").checked;

   var cell = new joint.dia.Link({
        source: { x:ww, y:hh*0.1 },
        target: { x: ww*2, y:hh },
        labels: [{ position: .5, attrs: { 
            text: { text: Lname , 'font-weight': 'bold' , fill: '#bfac00'},
            rect : {fill : '#333'} } }],
        attrs: { 
        '.connection': { 'stroke-width': 3, stroke: '#bf5600' },
                },

    });

   var cell_d = new joint.dia.Link({
        source: { x:ww, y:hh*0.1 },
        target: { x: ww*2, y:hh },
        labels: [{ position: .5, attrs: { 
            text: { text: Lname , 'font-weight': 'bold' , fill: '#bfac00'},
            rect : {fill : '#333'} } }],
        attrs: { 
        '.connection': { 'stroke-width': 3, stroke: '#bf5600', 'stroke-dasharray' : "5 5" },
                },

    });

   
  if (dashed) {
    if (linkkind == 1) {
        cell_d.attr({ '.marker-target': {fill: '#bf5600', stroke: '#bf5600', d: 'M 10 0 L 0 5 L 10 10 z'}});
        }
    if (linkkind == 2) {
      cell_d.attr({ '.marker-source': {fill: '#bf5600', stroke: '#bf5600', d: 'M 10 0 L 0 5 L 10 10 z'}});
      cell_d.attr({ '.marker-target': {fill: '#bf5600', stroke: '#bf5600', d: 'M 10 0 L 0 5 L 10 10 z'}});
       }
       }
    else {
        if (linkkind == 1) {
        cell.attr({ '.marker-target': {fill: '#bf5600', stroke: '#bf5600', d: 'M 10 0 L 0 5 L 10 10 z'}});
        }
    if (linkkind == 2) {
      cell.attr({ '.marker-source': {fill: '#bf5600', stroke: '#bf5600', d: 'M 10 0 L 0 5 L 10 10 z'}});
      cell.attr({ '.marker-target': {fill: '#bf5600', stroke: '#bf5600', d: 'M 10 0 L 0 5 L 10 10 z'}});
       }


    }


   //cell_d.attr({ '.marker-source': {fill: '#bf5600', stroke: '#bf5600', d: 'M 10 0 L 0 5 L 10 10 z'}});
   //cell_d.attr({ '.marker-target': {fill: '#bf5600', stroke: '#bf5600', d: 'M 10 0 L 0 5 L 10 10 z'}});




    if (dashed) { 
        cell_d.set('smooth' , true);
        graph.addCell(cell_d);
        }
    else {
        cell.set('smooth' , true);
        graph.addCell(cell);

    }
};

