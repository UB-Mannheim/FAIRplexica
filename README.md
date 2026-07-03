# 🌱 FAIRplexica <!-- omit in toc -->

FAIRplexica is an open-source AI assistant for research data management (RDM). It is based on [Vane](https://github.com/ItzCrazyKns/vane) (formerly Perplexica), uses the metasearch engine [SearXNG](https://github.com/searxng/searxng) to retrieve relevant RDM resources and local LLMs (via [Ollama](https://github.com/ollama/ollama)) to answer user questions. API providers like OpenAI, Groq, Anthropic, Google as well as custom API endpoints are available as well.

[![FAIRplexica Demo](https://github.com/user-attachments/assets/4639da23-e1e7-4739-ac43-9b0a3f592875)](https://github.com/user-attachments/assets/4639da23-e1e7-4739-ac43-9b0a3f592875)

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

    ### Example `config.toml`

    ```toml
    [GENERAL]
    ...
    GLOBAL_CONTEXT = "research data management"

    ...

    [ADMIN]
    # Provide a username for the admin account
    USERNAME = "admin"

    # Provide a secure password for the admin account 
    PASSWORD = "changeme"

    # Provide a base64 string with a length of at least 32 characters.
    # You can create your JWT_SECRET with a common shell command like: 
    # openssl rand -base64 32.
    JWT_SECRET = "replace-with-secure-secret" 

    ...

    [MODELS.OLLAMA]
    # If running Ollama models make sure the correct Ollama port is used
    # depending on your setup
    API_URL = "http://host.docker.internal:11434"
    API_KEY = ""

    ...

    [API_ENDPOINTS]
    # Make sure the correct SearXNG port is used depending on your setup
    SEARXNG = "http://host.docker.internal:4001/"
    ```

5. Change to the main project directory (containing the `docker-compose.yaml`) and execute:

   ```bash
   docker compose up -d
   ```

    Docker will pull the image, install everything and start the server. This may take a while.

6. Open `http://localhost:3000/` in your browser, to check if everything works correctly.

7. Navigate to `http://localhost:3000/admin` and log into the **Admin Settings** with the `USERNAME` and `PASSWORD` you have set in section 4.

    - Inside the dashboard you can set your LLM and embedding models as well as API keys and your `Ollama` URL.
