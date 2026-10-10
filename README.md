# The Museum of Ordinary Things

A small personal museum for everyday artifacts, places, and moments worth remembering. Add an exhibit, browse the collection, and notice the unexpected connections between things you have kept.

## What You Can Do

- Browse six sample exhibits or add your own with a title, category, date, place, story, and optional image URL.
- Filter the collection by Objects, Moments, Places, or Notes, and search across exhibit details.
- Mark exhibits as favorites and view them together.
- Open an exhibit for its full story, or use **Surprise me** to bring one into view at random.
- Visit the **Room of Strange Connections** to draw two exhibits, write what links them, and save that thought as a thread.
- Follow a saved thread from either exhibit to the other. Drawn pairs prefer exhibits that have not already been connected.

## Run Locally

### Requirements

- Node.js 20.19+ or 22.12+
- npm (included with Node.js)

### Install and start

From the project directory, run:

```sh
npm install
npm run dev
```

Open the local address printed by Vite in your terminal. It is usually `http://localhost:5173/`.

## Your Data

Exhibits and connection threads are saved in your browser's `localStorage`. No account or server is required. This also means your collection is specific to the browser and device where you created it; it does not automatically sync to GitHub or another device. Clearing this site's browser data removes locally saved exhibits and threads. The initial sample exhibits appear when there is no saved collection.

The sample and custom exhibit images use image URLs, and the page loads its typefaces from Google Fonts. Those external assets require an internet connection. A custom image is optional; exhibits without an image use a colored placeholder.

## Project Commands

Run these from the project directory:

| Command           | Purpose                                                               |
| ----------------- | --------------------------------------------------------------------- |
| `npm run dev`     | Start the Vite development server.                                    |
| `npm run build`   | Create a production build in `dist/`.                                 |
| `npm run preview` | Preview the production build locally after running the build command. |
| `npm run lint`    | Run Oxlint against the project.                                       |

## Built With

- React
- Vite
- Oxlint

The app is a client-side project; it currently has no backend or user accounts.
