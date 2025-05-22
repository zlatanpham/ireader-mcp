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

| Tool                             | Description                                                 | Parameters                                       |
| -------------------------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| `get_webpage_markdown`           | Fetches the content of a webpage using Jina reader.         | `url`: string - The URL of the webpage to fetch  |
| `get_youtube_transcript`         | Fetches the transcript of a YouTube video.                  | `videoURL`: string - The YouTube video ID or URL |
| `get_tweet_thread`               | Fetches the thread of a tweet.                              | `tweetURL`: string - The tweet URL or ID         |
| `get_pdf`                        | Extracts text content from a PDF file.                      | `url`: string - The URL of the PDF file          |
| `get_public_google_doc_markdown` | Fetches the markdown content of a public Google Doc by URL. | `url`: string - The public Google Doc URL        |

## Testing the Tools

Run the following command to test the tools:

```bash
pnpm dev
```

## FAQ

### How to use with Claude Desktop or MCP Clients?

Follow the guide https://modelcontextprotocol.io/quickstart/user and add the following configuration:

```json
{
  "mcpServers": {
    "ireader": {
      "command": "npx",
      "args": ["-y", "@x-mcp/ireader@latest"]
    }
  }
}
```

or if you want to run the server locally, add the following configuration:

```json
{
  "mcpServers": {
    "ireader": {
      "command": "npx",
      "args": ["-y", "@x-mcp/ireader@latest"]
    }
  }
}
```

The server will start and listen for MCP client connections via stdio.

## License

MIT
