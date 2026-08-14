services:
  ollama:
    image: ollama/ollama
    container_name: ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    ports:
      - 11434:11434
    volumes:
      - ollama-vol:/root/.ollama
    restart: unless-stopped
  ollama-webui:
    image: ghcr.io/ollama-webui/ollama-webui:main
    container_name: ollama-webui
    ports:
      - 3000:8080
    depends_on:
      - ollama
    environment:
      - OLLAMA_API_BASE_URL=http://ollama:11434/api
    volumes:
      - ollama-webui-vol:/app/backend/data
    restart: unless-stopped
volumes:
  ollama-vol:
    external: true
  ollama-webui-vol:
    external: true


OR w/o web ui volume

services:
  ollama:
    image: ollama/ollama
    container_name: ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    ports:
      - 11434:11434
    volumes:
      - ollama-vol:/root/.ollama
    restart: unless-stopped
  ollama-webui:
    image: ghcr.io/ollama-webui/ollama-webui:main
    container_name: ollama-webui
    ports:
      - 3000:8080
    depends_on:
      - ollama
    environment:
      - OLLAMA_API_BASE_URL=http://ollama:11434/api
    restart: unless-stopped
volumes:
  ollama-vol:
    external: true

