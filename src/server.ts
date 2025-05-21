import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import { extractGoogleDocId } from './validation';

const server = new FastMCP({
  name: 'ireader',
  version: '1.0.1',
});

server.addTool({
  name: 'get_webpage_markdown',
  description: 'Fetch the content of a url using jina reader',
  parameters: z.object({
    url: z.string(),
  }),
  execute: async (args) => {
    const response = await fetch(`https://r.jina.ai/${args.url}`);
    const data = await response.text();
    return data;
  },
});

server.addTool({
  name: 'get_youtube_transcript',
  description: 'Fetch the transcript of a YouTube video',
  parameters: z.object({
    videoURL: z.string().describe('The YouTube video ID or URL'),
  }),
  execute: async (args) => {
    const response = await fetch(
      'https://api.kome.ai/api/tools/youtube-transcripts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_id: args.videoURL, format: true }),
      },
    );

    const data = await response.json();
    return (data as { transcript: string }).transcript;
  },
});

server.addTool({
  name: 'get_tweet_thread',
  description: 'Fetch the thread of a tweet',
  parameters: z.object({
    tweetURL: z.string().describe('The tweet ID or URL'),
  }),
  execute: async (args) => {
    const tweetIdMatch = args.tweetURL.match(/\/status\/(\d+)/);
    const tweetId = tweetIdMatch ? tweetIdMatch[1] : args.tweetURL;

    const response = await fetch(
      `https://r.jina.ai/https://twitter-thread.com/t/${tweetId}`,
    );
    const data = await response.text();
    return data;
  },
});

server.addTool({
  name: 'get_pdf',
  description: 'Extract text content from a PDF file',
  parameters: z.object({
    url: z.string().describe('The URL of the PDF file to extract text from'),
  }),
  execute: async (args) => {
    const response = await fetch('https://api.kome.ai/api/tools/pdf-to-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: args.url }),
    });

    const data = await response.json();
    return (data as { text: string }).text;
  },
});

server.addTool({
  name: 'get_public_google_doc_markdown',
  description: 'Fetch the markdown content of a public Google Doc by URL',
  parameters: z.object({
    url: z.string().describe('The public Google Doc URL'),
  }),
  execute: async (args) => {
    // Extract the document ID from the URL
    const docId = extractGoogleDocId(args.url);
    if (!docId) {
      throw new Error('Invalid Google Doc URL');
    }

    // Construct the export URL for markdown format
    // This only works if the document's sharing setting is "Anyone with the link can view".
    // If it requires login, this method will likely fail or redirect to a login page.
    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=md`;

    // Fetch the markdown content as a blob and convert to text
    const response = await fetch(exportUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch document markdown: ${response.statusText}`,
      );
    }
    const markdown = await response.text();
    return markdown;
  },
});

server.addResource({
  uri: 'file:///logs/app.log',
  name: 'Application Logs',
  mimeType: 'text/plain',
  async load() {
    return {
      text: 'Example log content',
    };
  },
});

// Start the server
async function main() {
  try {
    await server.start({
      transportType: 'stdio',
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
