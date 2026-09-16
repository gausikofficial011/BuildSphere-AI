import platform

class HardwareDetector:
    @staticmethod
    def detect():
        """
        Detects hardware constraints. 
        In Phase 3, this ensures we don't crash by assuming GPUs exist.
        """
        # We mock torch/CUDA detection since torch might not be fully installed in the container
        # but the abstract logic remains correct.
        has_cuda = False
        has_mps = False
        
        try:
            import torch
            has_cuda = torch.cuda.is_available()
            if hasattr(torch.backends, "mps"):
                has_mps = torch.backends.mps.is_available()
        except ImportError:
            pass

        device = "cpu"
        if has_cuda:
            device = "cuda"
        elif has_mps:
            device = "mps"
            
        return {
            "os": platform.system(),
            "cpu_architecture": platform.machine(),
            "device": device,
            "has_cuda": has_cuda,
            "has_mps": has_mps
        }
