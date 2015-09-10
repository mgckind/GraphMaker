#!/usr/bin/env python
import sys,os
filesvg=sys.argv[1]
filehtml='temp.html'
filepng=filesvg[:-4]+'.png'

F=open(filesvg,'r')
FF=F.readlines()
F.close()

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
for line in FF:
    Lines+=line
Lines+="\n"
Lines+="""
</body>
</html>"""
F2.write(Lines)
F2.close()

os.system("/Users/Matias/phantomjs/bin/phantomjs /Users/Matias/phantomjs/examples/rasterize.js temp.html "+filepng)
os.system("rm -f "+filehtml)
os.system("rm -f "+filesvg)
