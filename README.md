# 🌱 FAIRplexica <!-- omit in toc -->

FAIRplexica is an open-source AI assistant for research data management (RDM). It is based on [Perplexica](https://github.com/ItzCrazyKns/Perplexica), uses the metasearch engine [SearXNG](https://github.com/searxng/searxng) to retrieve relevant RDM resources and local LLMs (via [Ollama](https://github.com/ollama/ollama)) to answer user questions. API providers like OpenAI, Groq, Anthropic, Google as well as custom API endpoints are available as well.

[![FAIRplexica Demo](https://github.com/user-attachments/assets/4639da23-e1e7-4739-ac43-9b0a3f592875)](https://github.com/user-attachments/assets/4639da23-e1e7-4739-ac43-9b0a3f592875)

## Table of Contents

1. [Local installation with docker](#local-installation-with-docker)
2. [Server installation with docker](#server-installation-with-docker)

## Local installation with docker

1. Ensure Docker is installed and running on your system.
2. Clone the FAIRplexica repository:

   ```bash
   git clone https://github.com/UB-Mannheim/FAIRplexica
   ```

3. Navigate to the project directory:

   ```bash
   cd FAIRplexica
   ```

4. Duplicate the `sample.config.toml` file and rename it to `config.toml`.

    - Fill in the  empty fields depending on the LLM Providers you want to use; i.e. provide valid API keys for `OpenAI`, `Anthropic` etc.
    - Set your `SearXNG` URL
    - Set your `Ollama` URL if you have Ollama running and want to use it
        > **Note**: You can change API keys after starting FAIRplexica inside the **Settings dashboard**.

5. Navigate to the `ui` folder inside the project's directory:

   ```bash
   cd ui
   ```

6. Make sure you can locate a file named `.env.example` in this folder.

7. Duplicate this file and rename it to `.env`. It should look like this:

    ```
    NEXT_PUBLIC_WS_URL=ws://localhost:3001
    NEXT_PUBLIC_API_URL=http://localhost:3001/api

    # Admin section
    ADMIN_USERNAME=""  
    ADMIN_PASSWORD="" # Provide a secure password

    # Provide a base64 string with a length of at least 32 characters
    NEXTAUTH_SECRET=""

    # Set to canonical URL of your site
    NEXTAUTH_URL="http://localhost:3001/"

    # Enable to show beta UI features
    NEXT_PUBLIC_ADMIN_MODE=false
    ```

8. Fill out the following fields and save your `.env`.
    - `ADMIN_USERNAME`
    - `ADMIN_PASSWORD`
    - `NEXTAUTH_SECRET`
        > **Note:** You can create your `NEXTAUTH_SECRET` with a common shell command like: `openssl rand -base64 32`.

9. Change to the main project directory (containing the `docker-compose.yaml`) and execute:

   ```bash
   docker compose up -d
   ```

    Docker will pull the images, install everything and start the server. This may take a while.

10. Open `http://localhost:3000/` in your browser, to check if everything works correctly.

11. Navigate to `http://localhost:3000/settings` and log into the **Admin Settings** with the `ADMIN_USERNAME` and `ADMIN_PASSWORD` you have set in section 7.

    - Inside the dashboard you can set your LLM and embedding models as well as API keys and your `Ollama` URL.

## Server installation with docker

1. Follow steps 1 to 6 from the [Local installation with docker](#local-installation-with-docker) section.

2. Duplicate the `.env.example` file and rename it to `.env`. It should look like this:

    ```
    NEXT_PUBLIC_WS_URL=wss://yourdomain.com
    NEXT_PUBLIC_API_URL=https://yourdomain.com/api

    # Admin section
    ADMIN_USERNAME=""  
    ADMIN_PASSWORD="" # Provide a secure password

    # Provide a base64 string with a length of at least 32 characters
    NEXTAUTH_SECRET=""

    # Set to canonical URL of your site
    NEXTAUTH_URL="https://yourdomain.com/"

    # Enable to show beta UI features
    NEXT_PUBLIC_ADMIN_MODE=false
    ```

3. Adjust out the following fields and save your `.env`.
    - `NEXT_PUBLIC_WS_URL`
    - `NEXT_PUBLIC_API_URL`
    - `ADMIN_USERNAME`
    - `ADMIN_PASSWORD`
    - `NEXTAUTH_SECRET`
        > **Note:** You can create your `NEXTAUTH_SECRET` with a common shell command like: `openssl rand -base64 32`.
    - `NEXTAUTH_URL`

4. Change to the main project directory (containing the `docker-compose.yaml`). Create a backup of the `docker-compose.yaml` file.

5. Replace the content of the `docker-compose.yaml` with the following and adjust `perplexica-frontend args` to your domain:

    ```yaml
    services:
    searxng:
        image: docker.io/searxng/searxng:latest
        volumes:
        - ./searxng:/etc/searxng:rw
        ports:
        - 4000:8080
        networks:
        - perplexica-network
        restart: unless-stopped

    perplexica-backend:
        build:
        context: .
        dockerfile: backend.dockerfile
        image: itzcrazykns1337/perplexica-backend:main
        environment:
        - SEARXNG_API_URL=http://searxng:8080
        depends_on:
        - searxng
        ports:
        - 3001:3001
        volumes:
        - backend-dbstore:/home/perplexica/data
        - uploads:/home/perplexica/uploads
        - ./config.toml:/home/perplexica/config.toml
        networks:
        - perplexica-network
        restart: unless-stopped

    perplexica-frontend:
        build:
        context: .
        dockerfile: app.dockerfile
        args:
            - NEXT_PUBLIC_API_URL=https://yourdomain.com/api
            - NEXT_PUBLIC_WS_URL=wss://yourdomain.com
        image: itzcrazykns1337/perplexica-frontend:main
        depends_on:
        - perplexica-backend
        ports:
        - 3000:3000
        networks:
        - perplexica-network
        restart: unless-stopped

    networks:
    perplexica-network:

    volumes:
    backend-dbstore:
    uploads:
    ```

6. Execute the following command:

   ```bash
   docker compose up -d
   ```

    Docker will pull the images, install everything and start the server. This may take a while.

7. Open `https://yourdomain.com/` in your browser, to check if everything works correctly.

8. Navigate to `https://yourdomain.com/settings` and log into the **Admin Settings** with the `ADMIN_USERNAME` and `ADMIN_PASSWORD` you have set in section 7.

    - Inside the dashboard you can set your LLM and embedding models as well as API keys and your `Ollama` URL.
