# Creating Custom Ollama Models in Docker

## Prerequisites
- Ollama running in Docker on Windows
- PowerShell access to the Windows host
- Model files directory (e.g., `C:\Users\[user]\Syncthing\ollama-models`)

## Steps

1. **Check Available Models**
```powershell
docker exec ollama ollama list
```
Note the exact model name and tag (e.g., `llama3.2:latest`)

2. **Create Modelfile**
- Create a file named exactly `Modelfile` (capital M, no extension)
- Use this format:
```
FROM llama3.2:latest
SYSTEM """
[Your system prompt here]
"""
```

3. **Copy to Container**
```powershell
docker cp [path-to-Modelfile] ollama:/Modelfile
```

4. **Create Model**
```powershell
docker exec ollama ollama create [modelname]:latest -f /Modelfile
```

5. **Test Model**
```powershell
docker exec -it ollama ollama run [modelname]
```

## Common Issues
- Model name must exactly match available models (including `:latest` tag)
- Modelfile must be copied into container before creation
- Windows paths don't work inside Docker container - use Linux paths
- File must be named exactly "Modelfile"

## Example Path
```powershell
C:\Users\clark\Syncthing\ollama-models\[modelname]\Modelfile
```
