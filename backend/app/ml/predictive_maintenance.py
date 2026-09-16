import collections
import statistics

class AnomalyDetector:
    def __init__(self, window_size=10, threshold_z=2.0):
        self.window_size = window_size
        self.threshold_z = threshold_z
        self.history = collections.deque(maxlen=window_size)
        
    def predict(self, value):
        if len(self.history) < self.window_size:
            self.history.append(value)
            return False, 0.0
            
        mean = statistics.mean(self.history)
        stdev = statistics.stdev(self.history)
        
        # Avoid division by zero
        if stdev == 0:
            z_score = 0
        else:
            z_score = abs(value - mean) / stdev
            
        is_anomaly = z_score > self.threshold_z
        confidence = min(99.9, (z_score / self.threshold_z) * 50) if is_anomaly else 0.0
        
        # Update history
        self.history.append(value)
        
        return is_anomaly, confidence
