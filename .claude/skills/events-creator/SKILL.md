---
name: events-creator
description: Create new Craft Code Club events in Portuguese. Use when creating or updating event content, including event frontmatter, filenames, banners, and related links.
---

# Event Structure

Events must be created in the `_content/events/` folder using this format:

```markdown
---
title: "Event Title"
description: "Detailed description of the event, explaining the topic, objectives and what participants will learn during the session."
date: "2024-08-05"
time: "21:00-22:30"
location: "Online via Zoom"
type: "online"
banner: "banner-file-name.png"
recordingLink: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
postLink: "https://craftcodeclub.io/posts/post-slug"
excalidrawLink: "https://link.excalidraw.com/l/XXXXXXXXXXX"
registrationLink: "{{discord-link}}"
speakers:
  - name: "Speaker Name"
---
```

## Required Properties

- **title**: Event title (string), approximately up to 60 characters.
- **description**: Event summary (string), approximately 350 to 400 characters maximum. It is shown in the event cards, the meta description and the calendar invite, and on the detail page when the event has no body.
- **date**: Event date in `YYYY-MM-DD` format (string).
- **time**: Event time in `HH:MM-HH:MM` format (string).
- **location**: Event location, typically `Online via Zoom` (string).
- **type**: Event type, typically `online` (string).
- **banner**: Banner image filename (string); the file should be placed in `public/events/`.

## Optional Properties

- **recordingLink**: Link to the event recording on YouTube (string).
- **postLink**: Link to the related blog post (string).
- **excalidrawLink**: Link to the related Excalidraw board (string).
- **registrationLink**: Always use the placeholder `"{{discord-link}}"` for the event registration page link.
- **speakers**: List of speakers, each with a `name` property (array of objects).

## Optional Body

Everything after the closing `---` is optional Markdown content for the event detail page.

- With a body, the detail page renders the Markdown instead of `description`. The `description` is still the short summary used in the event cards, the meta description and the calendar invite, so it stays required.
- Without a body, the detail page shows `description`. An empty or comment-only body counts as no body.
- Use the body when the announcement has more than fits in the description, such as a topic list, agenda or prerequisites. Leave out what the page already shows (title, date, time, location, speakers) and relative dates like "na próxima segunda".
- The page already renders the title as `h1`, so don't use `#` headings in the body.

## Event Creation Workflow

1. Collect the event details from the prompt, including date, time, draft title and description, and any links.
2. Analyze previous event files in `_content/events/` to follow their formatting and writing style.
3. Create a new Markdown file in `_content/events/` with a descriptive, lowercase filename using hyphens between words, such as `my-new-event.md`.
   - Follow the pattern used by existing files.
   - If the event belongs to a series, add the series prefix to the filename, such as `book-sd-event-name.md`.
4. Fill in all required and applicable optional frontmatter properties.
   - Always set `registrationLink: "{{discord-link}}"` in the frontmatter.
   - Use clear and concise language.
   - Respect the suggested title and description limits.
   - Write the event content details in Portuguese.
5. If the announcement has more detail than fits in the description, add it as the Markdown body (see Optional Body).
