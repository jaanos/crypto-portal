import findimports

imports, unused_names = findimports.find_imports_and_track_names('./crypto.py')
for imp in imports:
    #print(imp)
    pass

from findimports import ModuleGraph
g = ModuleGraph()
g.parsePathname('.')
g.printImports()

cg = g.collapseCycles()
#p = cg.printImports()