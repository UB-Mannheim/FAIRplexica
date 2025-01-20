# FAIRplexica

## Installation with Docker

1. Ensure Docker is installed and running on your system.
2. Clone the FAIRplexica repository:

   ```bash
   git clone https://github.com/tsmdt/FAIRplexica
   ```

3. After cloning, navigate to the project directory:

   ```bash
   cd FAIRplexica
   ```

4. Rename the `sample.config.toml` file to `config.toml`.

    - Fill in the  empty fields depending on the LLM Providers you want to use; i.e. provide valid API keys for `OpenAI`, `Anthropic` etc.
    - Set your `SearXNG` URL
    - Set your `Ollama` URL if you have Ollama running and want to use it

        > **Note**: You can change API keys after starting FAIRplexica inside the **Admin dashboard**.

5. Navigate to the `ui` folder inside the project's directory:

   ```bash
   cd ui
   ```

6. Make sure you can locate a file named `.env.example` is this folder.

7. Create a new file named `.env`, open it and paste the following lines into it:

    ```
    NEXT_PUBLIC_WS_URL=ws://localhost:3001
    NEXT_PUBLIC_API_URL=http://localhost:3001/api

    # Admin section
    ADMIN_USERNAME="admin"
    ADMIN_PASSWORD="" # Provide a secure password

    # Provide a base64 string with a length of 32 characters
    NEXTAUTH_SECRET=""

    # Set to canonical URL of your site
    NEXTAUTH_URL=

    # Enable to show beta UI features
    NEXT_PUBLIC_ADMIN_MODE=false
    ```

8. Fill out the following fields and save your `.env`.
    1. `ADMIN_PASSWORD`
    2. `NEXTAUTH_SECRET`
    3. `NEXTAUTH_URL`

        > **Note:** You can create your `NEXTAUTH_SECRET` with a common shell command like: `openssl rand -base64 32`.

9. Ensure you are in the directory containing the `docker-compose.yaml` file (main project directory) and execute:

   ```bash
   docker compose up -d
   ```

    Docker will pull the images, install everything and start the server. This may take a while.

10. Open `http://localhost:3000/` in your browser, to check if everything works correctly.

11. Navigate to `http://localhost:3000/admin` and log in into the **Admin Dashboard** with the username and password you have set in section 7.

    - Inside the dashboard you can set your LLM and embedding models as well as API keys and your `Ollama` URL.
