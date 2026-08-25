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
registrationLink: "https://link-to-registration.com"
speakers:
  - name: "Speaker Name"
---
```

## Required Properties

- **title**: Event title (string), approximately up to 60 characters.
- **description**: Detailed event description (string), approximately 350 to 400 characters maximum.
- **date**: Event date in `YYYY-MM-DD` format (string).
- **time**: Event time in `HH:MM-HH:MM` format (string).
- **location**: Event location, typically `Online via Zoom` (string).
- **type**: Event type, typically `online` (string).
- **banner**: Banner image filename (string); the file should be placed in `public/events/`.

## Optional Properties

- **recordingLink**: Link to the event recording on YouTube (string).
- **postLink**: Link to the related blog post (string).
- **excalidrawLink**: Link to the related Excalidraw board (string).
- **registrationLink**: Link to the event registration page (string).
- **speakers**: List of speakers, each with a `name` property (array of objects).

## Event Creation Workflow

1. Collect the event details from the prompt, including date, time, draft title and description, and any links.
2. Analyze previous event files in `_content/events/` to follow their formatting and writing style.
3. Create a new Markdown file in `_content/events/` with a descriptive, lowercase filename using hyphens between words, such as `my-new-event.md`.
   - Follow the pattern used by existing files.
   - If the event belongs to a series, add the series prefix to the filename, such as `book-sd-event-name.md`.
4. Fill in all required and applicable optional frontmatter properties.
   - Use clear and concise language.
   - Respect the suggested title and description limits.
   - Write the event content details in Portuguese.
