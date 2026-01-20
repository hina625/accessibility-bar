# Accessibility Bar - Embed Guide

## Quick Start

To embed the Accessibility Bar on any website, simply add this script tag before the closing `</body>` tag:

```html
<script src="./public/embed-standalone.js"></script>
```

Or if hosting on a CDN:

```html
<script src="https://your-domain.com/embed-standalone.js"></script>
```

## Build the Embed

Before using the embed, you need to build it:

```bash
npm run build:embed
```

This will create the `embed-standalone.js` file in the `public` folder.

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>Your content here...</p>

    <!-- Embed Accessibility Bar -->
    <script src="./public/embed-standalone.js"></script>
</body>
</html>
```

## Features

- ✅ Automatically mounts on page load
- ✅ Shadow DOM isolation (won't affect your site's styles)
- ✅ No dependencies required
- ✅ Works with any website
- ✅ All accessibility features included

## Notes

- The embed script automatically initializes when the page loads
- It uses Shadow DOM to prevent style conflicts
- The accessibility bar will appear as a floating button on your page
- All settings are stored in the user's browser localStorage
