#!/usr/bin/env python
import sys,os
import json
filesvg=sys.argv[1]
filehtml='temp.html'
filepng=filesvg[:-4]+'.png'
filejson=filesvg[:-4]+'.json'

csize=False
minx=5000
miny=5000
maxx=0
maxy=0

def findbb(x,y):
    global minx,miny,maxx,maxy
    minx=min(minx,x)
    miny=min(miny,y)
    maxx=max(maxx,x)
    maxy=max(maxy,y)

if os.path.exists(filejson):
    csize=True
    filein = filejson
    with open(filein) as data_file:    
        data = json.load(data_file)
    cells=data['cells']
    
    for i in range(len(cells)):
        C=cells[i]
        if C['type']=='link':
            if C['source'].has_key('id'):
                pass
            else:
                print C['source']
            if C['target'].has_key('id'):
                pass
            else:
                x=C['target']['x']
                y=C['target']['y']
                findbb(x,y)
        else:
            x=C['position']['x']+C['size']['width']
            y=C['position']['y']+C['size']['height']
            findbb(x,y)
            x=C['position']['x']
            y=C['position']['y']
            findbb(x,y)
    maxx=int(maxx+minx)
    maxy=int(maxy+miny)

F=open(filesvg,'r')
FF=F.readlines()
F.close()


if csize:
    New=FF[0][:FF[0].find('width')]+'width=\"'+str(maxx)+'\" height=\"'+str(maxy)+'\" '+FF[0][FF[0].find('><'):]  
else:
    New=FF[0]
F2=open(filehtml,'w')
Lines="""
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
<link rel="stylesheet" type="text/css" href="css/joint.css" />
<link rel="stylesheet" type="text/css" href="css/style.css" />
<link rel="stylesheet" type="text/css" href="css/mycss.css" />
</head>
<body>\n"""
Lines+=New
Lines+="\n"
Lines+="""
</body>
</html>"""
F2.write(Lines)
F2.close()

os.system("/Users/Matias/phantomjs/bin/phantomjs /Users/Matias/phantomjs/examples/rasterize.js temp.html "+filepng)
os.system("rm -f "+filehtml)
#os.system("rm -f "+filesvg)
