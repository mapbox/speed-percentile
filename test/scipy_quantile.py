from scipy.stats.mstats import mquantiles
from collections import Counter
import numpy as np
import sys, json

# load histogram
ctr = Counter(json.loads(sys.argv[2]))

# load list of percentiles
ps = np.array(sys.argv[3].split(',')).astype(float)
ps = sorted(ps, reverse=True)

# recreate array
arr = []
for key,val in ctr.iteritems():
    arr += [int(key)] * val

# R5 piece-wise linear interpolation
sys.stdout.write(','.join(mquantiles(arr, ps, alphap=0.5, betap=0.5).astype(str)))

# pass percentile speeds back via stdout
sys.stdout.flush()