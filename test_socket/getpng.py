#!/usr/bin/env python
import sys,os
import json
filesvg=sys.argv[1]
filehtml='temp.html'
filepng=filesvg[:-4]+'.png'


F=open(filesvg,'r')
FF=F.readlines()
F.close()


New=FF[0][:FF[0].find('><')]+' style=\"background: #333\">\n'

ww=('').join(New.split());
ww=ww.split('width=\"')[1]
ww=ww[:ww.find('\"')]
print ww

hh=('').join(New.split());
hh=hh.split('height=\"')[1]
hh=hh[:hh.find('\"')]
print hh
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



F2=open(filehtml,'w')
Lineshtml="""
<!DOCTYPE html>
<html>
<head>
<style>
body {
    background-color: #333;
    color: #fff;
    font: 300 100.1% "Helvetica Neue", Helvetica, "Arial Unicode MS", Arial, sans-serif;
    }
</style>
</head>
<body>\n"""
Lineshtml+=New
Lineshtml+="\n"
Lineshtml+="""
</body>
</html>"""
F2.write(Lineshtml)
F2.close()

os.system("/Users/Matias/phantomjs/bin/phantomjs /Users/Matias/phantomjs/examples/rasterize.js temp.html "+filepng+' '+ww+'px*'+hh+'px')
#os.system("rm -f "+filehtml)
#os.system("rm -f "+filesvg)
