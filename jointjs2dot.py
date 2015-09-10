#!/usr/bin/env python
import json
import numpy as np
import sys,os



filein = sys.argv[1]

with open(filein) as data_file:    
    data = json.load(data_file)

    

cells=data['cells']

All=[]
for i in range(len(cells)):
    All.append(cells[i]['id'])

All=np.array(All)


Lines = 'digraph G { \n'

dict={u'#7cbf00':'\"#7CBF00\"', u'#bf0000':'\"#BF0000\"',u'#6495ED':'\"#6495ED\"'}


Lines+= """
    graph [bgcolor=\"#333333\"];
    edge [color=\"#bf5600\", penwidth=1.5];
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
Lines2=""
for i in range(len(cells)):
    C=cells[i]
    #print C['type'], C['id']
    if C['type'] == 'link' :
        S_idx=np.where(All==C['source']['id'])[0][0]
        S=cells[S_idx]['attrs']['text']['text']
        if S not in cell_names:
        
            cs=dict[cells[S_idx]['attrs']['rect']['stroke']]
            ls='solid'
            if cells[S_idx]['attrs']['rect'].has_key('stroke-dasharray'): ls='dashed'
            Lines2 += '\"' + S + '\" [color = '+cs+', style='+ls+'];\n'
            cell_names.append(S)
        
        T_idx=np.where(All==C['target']['id'])[0][0]
        T=cells[T_idx]['attrs']['text']['text']

        if T not in cell_names:
        
            cs=dict[cells[T_idx]['attrs']['rect']['stroke']]
            ls='solid'
            if cells[T_idx]['attrs']['rect'].has_key('stroke-dasharray'): ls='dashed'
            Lines2 += '\"' + T + '\" [color = '+cs+', style='+ls+'];\n'
            cell_names.append(T)
        

        #cs=dict[cells[T_idx]['attrs']['rect']['stroke']]#
        #ls='solid'
        #if cells[T_idx]['attrs']['rect'].has_key('stroke-dasharray'): ls='dashed'#
        #Lines += '\"' + T + '\" [color = '+cs+', style='+ls+'];\n' 

        label=C['labels'][0]['attrs']['text']['text']

        lls = 'solid'
        if C['attrs']['.connection'].has_key('stroke-dasharray'): lls='dashed'

        if C['attrs'].has_key('.marker-source') and C['attrs'].has_key('.marker-target') : dir = 'both'
        if not C['attrs'].has_key('.marker-source') and not C['attrs'].has_key('.marker-target') : dir = 'none'
        if C['attrs'].has_key('.marker-source') and not C['attrs'].has_key('.marker-target') : dir = 'back'
        if not C['attrs'].has_key('.marker-source') and C['attrs'].has_key('.marker-target') : dir = 'forward'

        if label != '':
            Lines += '\"' + S + '\" -> ' + '\"'+ T + '\" [dir='+dir+', label = \"'+label+'\", fontcolor=\"#bfac00\", style='+lls+']' + ';\n'
        else:
            Lines += '\"' + S + '\" -> ' + '\"'+ T + '\" [dir='+dir+', style='+lls+'];\n'

Lines += Lines2
Lines += '}'

dotfile = filein[:-4]+'dot'
F=open(dotfile,'w')
F.write(Lines)
F.close()

pngfile=filein[:-4]+'png'

if os.path.exists(pngfile):
    os.remove(pngfile)
os.system('dot -Tpng '+ dotfile + ' > ' + pngfile)
            
