# Retry a flaky call with exponential backoff

Wrap an unreliable function with a small retry loop that waits longer after each failure.

```python
import time

def retry(fn, attempts=3, base_delay=1.0):
    for i in range(attempts):
        try:
            return fn()
        except Exception as err:
            if i == attempts - 1:
                raise
            delay = base_delay * (2 ** i)
            print(f"attempt {i + 1} failed ({err}); retrying in {delay}s")
            time.sleep(delay)
```

Exponential backoff avoids hammering a service that is already struggling: the delay doubles each time, and the last attempt re-raises so the original error is never swallowed.
