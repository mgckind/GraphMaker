#!/usr/bin/env python
import sys
filesvg=sys.argv[1]

F=open(filesvg,'r')
FF=F.readlines()
F.close()


New=FF[0][:FF[0].find('><')]+' style=\"background: #333\">\n'
Lines="""
  <style type="text/css"><![CDATA[
    .connection-wrap {
   fill: none;
   stroke: black;
   stroke-width: 15;
   stroke-linecap: round;
   stroke-linejoin: round;
   opacity: 0;
}

.connection {
   fill: none;
   stroke-linejoin: round;
}

.marker-source, .marker-target {
   vector-effect: non-scaling-stroke;
}


.marker-vertices {
   opacity: 0;
}
.marker-arrowheads {
   opacity: 0;
}
.link-tools {
   opacity: 0;
}
.link-tools .tool-options {
   display: none;       /* by default, we don't display link options tool */
}
.link-tools .tool-remove circle {
   fill: red;
}
.link-tools .tool-remove path {
   fill: white;
}

.marker-vertex {
   fill: #1ABC9C;
}

.marker-arrowhead {
   fill: #1ABC9C;
}

.marker-vertex-remove {
   opacity: .1;
   fill: white;
}

.marker-vertex-group:hover .marker-vertex-remove {
   opacity: 1;
}

.marker-vertex-remove-area {
   opacity: .1;
}

.highlighted {
    opacity: 0.7;
}

text.highlighted {
    fill: #FF0000;
}

@media screen and (-webkit-min-device-pixel-ratio:0) {
    .highlighted {
        outline: 2px solid #FF0000;
        opacity: initial;
    }
}


.element .fobj {
    overflow: hidden;
}
.element .fobj body {
    background-color: transparent;
    margin: 0px;
}
.element .fobj div {
    text-align: center;
    vertical-align: middle;
    display: table-cell;
    padding: 0px 5px 0px 5px;
}
.element .element-tools {
        display: none;
}

  ]]></style>

"""
New+=Lines+FF[0][FF[0].find('><')+1:]  
F2=open(filesvg[:-4]+'_2.svg','w')
F2.write(New)
F2.close()

