Key learnings from Ollama software optimization:

1. Storage
- Successfully moved model storage to SSD using bind mount
- Configuration required precise Docker volume settings
- Path must use forward slashes: `/c/ollama-data`

2. Memory Performance
- Container uses ~3.4GB out of 36GB allocated (9.5%)
- Memory usage ramps up gradually during model loading
- CPU utilization peaks at ~290-296% (good multi-core usage)

3. Model Optimization Options
- Moving from base model to quantized version (q3_k_m)
- Tradeoff: slightly lower quality for better performance
- Size reduction: 2.0GB → 1.7GB
- Based on the stats, the quantized model offers minimal benefits:
	- Only ~140MB memory savings (4.3% reduction)
	- No significant CPU usage improvement
	- Same multi-core utilization pattern

Given it might come with a quality tradeoff for such minimal gains, I don't think it's worth it. The planned RTX 2060 upgrade would likely give much more meaningful performance improvements. I'd recommend staying with the standard model for now until the GPU is added.

4. Compose File Benefits
- Documents all settings
- Makes configuration reproducible
- Easier to maintain than manual container setup

5. Next Steps
- Test quantized model performance
- Consider GPU upgrade when available (RTX 2060)
- Monitor block I/O for storage performance

All optimizations (SSD storage, memory allocation, and potential quantization) are now properly configured through Docker Compose, making the setup reproducible and maintainable.