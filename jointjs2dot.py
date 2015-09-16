#!/usr/bin/env python
import json
import numpy as np
import sys,os


filein = sys.argv[1]

with open(filein) as data_file:    
    data = json.load(data_file)

    

cells=data['cells']

All=[]
Groups=[]
label=0
for i in range(len(cells)):
    All.append(cells[i]['id'])
    if cells[i]['name']['text']== 'Group':
        Groups.append(cells[i]['id'])
        label+=1

All=np.array(All)
Groups=np.array(Groups)


Head = 'digraph G { \n'

def ccolor(inputcolor):
    return '\"%s\"' % inputcolor.upper()

Head+= """
    compound=true;
    graph [bgcolor=\"#333333\"];
    edge [penwidth=1.5];
    node [  shape = polygon,
        sides = 4,
        penwidth = 2,
        distortion = "0.0",
        orientation = "0.0",
        skew = "0.0",
        style= "solid",
        color = white,
        fontcolor = white,
        fontname = "Helvetica-Outline" ];\n"""


cell_names=[]
group_names=[]
link_names=[]


def add_cell(buffer, cell_names, id):
    idx = np.where(All==id)[0][0]
    CC = cells[idx]
    if CC['name']['text'] == 'Cell':
        label = CC['attrs']['text']['text']
    if id not in cell_names:          
        cs=ccolor(CC['attrs']['rect']['stroke'])
        ls='solid'
        if CC['attrs']['rect'].has_key('stroke-dasharray'): ls='dashed'
        buffer += '\"' + id + '\" [color = '+cs+', style='+ls+', label='+label+'];\n'
        cell_names.append(id)
    return buffer, cell_names
        
    
    
def add_link(buffer, link_names, C, Source, Target):
    label=C['labels'][0]['attrs']['text']['text']

    lls = 'solid'
    if C['attrs']['.connection'].has_key('stroke-dasharray'): lls='dashed'

    if C['attrs'].has_key('.marker-source') and C['attrs'].has_key('.marker-target') : dir = 'both'
    if not C['attrs'].has_key('.marker-source') and not C['attrs'].has_key('.marker-target') : dir = 'none'
    if C['attrs'].has_key('.marker-source') and not C['attrs'].has_key('.marker-target') : dir = 'back'
    if not C['attrs'].has_key('.marker-source') and C['attrs'].has_key('.marker-target') : dir = 'forward'

    linkc=ccolor(C['attrs']['.connection']['stroke'])
    textc=ccolor(C['labels'][0]['attrs']['text']['fill'])

    options=''

    if Source.find('dummy') > -1 :
        options+='ltail = \"' + Source.replace('dummy','cluster') + '\",'

    if Target.find('dummy') >-1 :
        options+='lhead = \"' + Target.replace('dummy','cluster') + '\",'       

    if label != '':
        buffer += '\"' + Source + '\" -> ' + '\"'+ Target + '\" ['+options+' dir='+dir+', color ='+linkc+', label = \"'+label+'\", fontcolor='+textc+', style='+lls+']' + ';\n'
    else:
        buffer += '\"' + Source + '\" -> ' + '\"'+ Target + '\" ['+options+' dir='+dir+', color='+linkc+', style='+lls+'];\n'
    link_names.append(C['id'])

    return buffer, link_names


for ig in range(len(Groups)):

    id = Groups[ig]
    Lines="subgraph "+'\"cluster'+id+'\"'+" { \n  "+'\"dummy'+id+'\"'+" [shape=point, style=invis];\n "
    Lines2="" #for cells
    Lines3="" #for groups
    inside=[]

    idg=np.where(All==id)[0][0]
    G=cells[idg]
    print idg
    Lines+="color = "+ccolor(G['attrs']['rect']['stroke'])+";\n"
    for inside_id in G['embeds']:
        inside.append(inside_id)
                   

    for i in range(len(cells)):
        C=cells[i]
        #print C['type'], C['id']
        if C['type'] == 'link' :
            idlink = C['id']
            if idlink not in link_names:           
                S_id=C['source']['id']
                if S_id in inside:
                    Lines2, cell_names = add_cell(Lines2, cell_names, S_id)
                T_id=C['target']['id']
                if T_id in inside:
                    Lines2, cell_names = add_cell(Lines2, cell_names, T_id)
                if S_id in inside and T_id in inside:
                    Lines, link_names = add_link(Lines, link_names, C, S_id, T_id)

    
    Lines+=Lines2+'}\n'
    Head+=Lines


Lines=""
Lines2="" #for cells
Lines3="" #for groups

for i in range(len(cells)):
    C=cells[i]
    #print C['type'], C['id']
    if C['type'] == 'link' :
        idlink = C['id']
        if idlink not in link_names:           
            S_id=C['source']['id']
            if S_id in Groups:
                S_id='dummy'+S_id
            else:
                Lines2, cell_names = add_cell(Lines2, cell_names, S_id)
            T_id=C['target']['id']
            if T_id in Groups:
                T_id='dummy'+T_id
            else:
                Lines2, cell_names = add_cell(Lines2, cell_names, T_id)
            Lines, link_names = add_link(Lines, link_names, C, S_id, T_id)           
        

Lines += Lines2
Lines += '}'


dotfile = filein[:-4]+'dot'
F=open(dotfile,'w')
F.write(Head+Lines)
F.close()

pngfile=filein[:-4]+'png'

if os.path.exists(pngfile):
    os.remove(pngfile)
os.system('dot -Tpng '+ dotfile + ' > ' + pngfile)
            
