# MCP Server Setup Guide

This guide will help you install the recommended Model Context Protocol (MCP) servers to enhance your web design workflow.

## Recommended Servers

1.  **@modelcontextprotocol/server-filesystem**
    -   *Why*: Allows the AI to create and edit files directly in your project.
2.  **@modelcontextprotocol/server-github**
    -   *Why*: Manage your repositories, commits, and branches.
3.  **@modelcontextprotocol/server-puppeteer**
    -   *Why*: Allows the AI to browse the web, scrape design references, and test your site.
4.  **context7** (Optional but recommended)
    -   *Why*: Provides up-to-date documentation for libraries like Tailwind, React, etc.

## Installation Instructions

You need to edit your Claude Desktop configuration file.

**config file location**: `%APPDATA%\Claude\claude_desktop_config.json`
*(You can paste this path into your file explorer address bar)*

### Configuration to Copy

Add (or merge) the following into your `mcpServers` object in the config file.

> [!WARNING]
> Make sure you have `node` and `npm` installed on your system.

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "g:\\내 드라이브\\Coding\\web disign"
      ]
    },
    "puppeteer": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ]
    },
     "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    }
  }
}
```

### Notes
-   **Filesystem**: I've set the path to your current workspace `g:\내 드라이브\Coding\web disign`. You can add more paths to the `args` list if needed.
-   **GitHub**: You will need to generate a Personal Access Token on GitHub and replace `YOUR_GITHUB_TOKEN_HERE`.
-   **Restart**: After saving the file, **restart Claude Desktop** for changes to take effect.
