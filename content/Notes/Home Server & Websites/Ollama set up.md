Here's the key info for your Ollama setup:

Installation Steps:

1. Created `ollama-network` (172.25.0.0/16)
2. Deployed Ollama container:
    - Image: `ollama/ollama:latest`
    - Port: 11434:11434
3. Deployed WebUI:
    - Image: `ghcr.io/ollama-webui/ollama-webui:main`
    - Port: 3000:8080
    - Critical fix: Change API URL to `http://192.168.5.56:11434/api`

Important URLs:

- Ollama API: `http://192.168.5.56:11434`
- WebUI: `http://192.168.5.56:3000`

Key Lesson:

- Container networking requires full IP address for external connections, not container names

Test API Command:

bash

Copy

`curl http://192.168.5.56:11434/api/version`