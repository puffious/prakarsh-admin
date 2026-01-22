# Prakarsh Admin Panel

Event Management Admin Panel for Prakarsh festival.

## Getting Started

### Local Development

You can work locally using your preferred IDE and push changes to the repository.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Run with Docker

You can build and serve the production bundle with Docker. Vite reads `VITE_*` variables at build time, so pass your Supabase values during the image build.

```sh
# Build (replace the placeholders with your Supabase settings)
docker build \
  --build-arg VITE_SUPABASE_URL=https://your-project.supabase.co \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY=your-public-anon-key \
  -t event-hub .

# Run the container on port 4173
docker run -p 4173:80 event-hub
```

The app is served by nginx and is available at http://localhost:4173.

## Deploy with Docker Compose

For repeatable deploys, use Docker Compose. It reads values from your `.env` file for the Vite build args.

```sh
cp .env.example .env
# Fill VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env

docker compose build
docker compose up -d
```

The site will be available at http://localhost:4173.

## Supabase Configuration

To use a custom domain like `admin.prakarsh.org`, update these settings in your Supabase dashboard:

- Go to **Authentication → URL Configuration**
- Set **Site URL** to `https://admin.prakarsh.org`
- Add **Redirect URLs** (including localhost for testing)
- Configure **CORS allowed origins** in Settings → API
