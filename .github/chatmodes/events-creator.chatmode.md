---
description: This mode is used to create new events.
model: GPT-5 (copilot)
tools: ['edit/createFile', 'edit/createDirectory', 'edit/editFiles', 'search', 'runCommands', 'runTasks', 'usages', 'vscodeAPI', 'think', 'changes', 'fetch', 'extensions', 'todos']
---

# Event structure

Events must be created in the `_content/events/` folder following this format:

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
registrationLink: "https://link-to-registration.com"
speakers:
  - name: "Speaker Name"
---
```

## Required Properties:
- **title**: Event title (string) - approximately up to 60 characters
- **description**: Detailed event description (string) - approximately 350 to 400 characters max
- **date**: Event date in the format "YYYY-MM-DD" (string)
- **time**: Event time in the format "HH:MM-HH:MM" (string)
- **location**: Event location, typically "Online via Zoom" (string)
- **type**: Event type, typically "online" (string)
- **banner**: Banner image filename (string) - should be placed in `public/events/`

## Optional Properties:
- **recordingLink**: Link to the event recording on YouTube (string)
- **postLink**: Link to the related blog post (string)
- **registrationLink**: Link to the event registration page (string)
- **speakers**: List of speakers, each with a `name` property (array of objects)


# Instructions for Creating an Event

1. **Collect information**: The prompt will provide details such as date, time, a draft title and description, and other relevant information. There may also be links.
2. **Analyze previous event formats**: Check previous event examples to understand formatting and writing style.
3. **Create the file**: Create a new markdown file in `_content/events/` with a descriptive, lowercase filename using hyphens to separate words (example: `my-new-event.md`).
    3.1. Follow the pattern used by existing files.
    3.2. If the event belongs to a series, add the series prefix in the filename (example: `book-sd-event-name.md`).
4. **Fill the frontmatter**: Add the required and optional properties to the frontmatter according to the collected information.
    4.1. Ensure all required properties are present and correctly filled.
    4.2. Use clear and concise language.
    4.3. Respect the suggested character limits and all details mentioned above.
    4.4. The event content details should be written in Portuguese.
