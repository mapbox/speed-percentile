from scipy.stats.mstats import mquantiles
from collections import Counter
import numpy as np
import sys, json, time

ctr = Counter(json.loads(sys.argv[2]))
ps = np.array(sys.argv[3].split(',')).astype(float)

# recreate array
arr = []
for key,val in ctr.iteritems():
    arr += [int(key)] * val

# R5 piece-wise linear interpolation
print ','.join(mquantiles(arr, ps, alphap=0.5, betap=0.5).astype(str))

sys.stdout.flush()