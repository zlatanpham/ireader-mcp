# iReader MCP

A Model Context Protocol (MCP) server that provides tools for reading and extracting content from internet.

## Installation

```bash
# Clone the repository
git clone https://github.com/zlatanpham/ireader-mcp.git
cd ireader-mcp

# Install dependencies
pnpm install
```

## Available Tools

| Tool                     | Description                                         | Parameters                                       |
| ------------------------ | --------------------------------------------------- | ------------------------------------------------ |
| `get_webpage_markdown`   | Fetches the content of a webpage using Jina reader. | `url`: string - The URL of the webpage to fetch  |
| `get_youtube_transcript` | Fetches the transcript of a YouTube video.          | `videoURL`: string - The YouTube video ID or URL |

## Running Your Server

### Test with mcp-cli

The fastest way to test and debug your server is with fastmcp dev:

```bash
pnpm test
```

This will run your server with `mcp-cli` for testing and debugging your MCP server in the terminal.

### Inspect with MCP Inspector

Another way is to use the official MCP Inspector to inspect your server with a Web UI:

```bash
pnpm inspect
```

## FAQ

### How to use with Claude Desktop?

Follow the guide https://modelcontextprotocol.io/quickstart/user and add the following configuration:

```json
{
  "mcpServers": {
    "ireader": {
      "command": "npx",
      "args": ["tsx", "/PATH/TO/YOUR_PROJECT/src/index.ts"],
      "env": {
        "YOUR_ENV_VAR": "value"
      }
    }
  }
}
```

The server will start and listen for MCP client connections via stdio.

## License

MIT
