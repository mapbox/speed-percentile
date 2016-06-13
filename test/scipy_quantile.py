from scipy.stats.mstats import mquantiles
from collections import Counter
import numpy as np
import sys, json, time

ctr = Counter(json.loads(sys.argv[2]))
p = float(sys.argv[3])

# recreate array
arr = []
for key,val in ctr.iteritems():
    arr += [int(key)] * val

# R5 piece-wise linear interpolation
print mquantiles(arr, p, alphap=0.5, betap=0.5)[0]

sys.stdout.flush()