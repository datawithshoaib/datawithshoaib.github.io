# Pandas groupby with multiple aggregations

Apply different aggregations to different columns in a single `groupby` pass instead of chaining multiple operations.

```python
import pandas as pd

df = pd.DataFrame({
    "region": ["north", "south", "north", "south"],
    "product": ["a", "a", "b", "b"],
    "sales": [100, 250, 80, 320],
    "qty": [4, 9, 3, 12],
})

summary = df.groupby("region").agg(
    total_sales=("sales", "sum"),
    avg_qty=("qty", "mean"),
    orders=("qty", "size"),
).reset_index()
```

The named-aggregation tuples (`output_name=("column", "func")`) keep the result columns explicit, so the output stays predictable when you add more metrics.
