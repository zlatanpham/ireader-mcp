import { FastMCP } from 'fastmcp';
import { z } from 'zod';

import { extractGoogleDocId } from './validation.js';

const server = new FastMCP({
  name: 'ireader',
  version: '1.0.2',
});

server.addTool({
  description: 'Fetch the content of a url using jina reader',
  execute: async args => {
    const response = await fetch(`https://r.jina.ai/${args.url}`);
    const data = await response.text();
    return data;
  },
  name: 'get_webpage_markdown',
  parameters: z.object({
    url: z.string(),
  }),
});

server.addTool({
  description: 'Fetch the transcript of a YouTube video',
  execute: async args => {
    const response = await fetch(
      'https://api.kome.ai/api/tools/youtube-transcripts',
      {
        body: JSON.stringify({ format: true, video_id: args.videoURL }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    const data = await response.json();
    return (data as { transcript: string }).transcript;
  },
  name: 'get_youtube_transcript',
  parameters: z.object({
    videoURL: z.string().describe('The YouTube video ID or URL'),
  }),
});

server.addTool({
  description: 'Fetch the thread of a tweet',
  execute: async args => {
    const tweetIdMatch = args.tweetURL.match(/\/status\/(\d+)/);
    const tweetId = tweetIdMatch ? tweetIdMatch[1] : args.tweetURL;

    const response = await fetch(
      `https://r.jina.ai/https://twitter-thread.com/t/${tweetId}`,
    );
    const data = await response.text();
    return data;
  },
  name: 'get_tweet_thread',
  parameters: z.object({
    tweetURL: z.string().describe('The tweet ID or URL'),
  }),
});

server.addTool({
  description: 'Extract text content from a PDF file',
  execute: async args => {
    const response = await fetch('https://api.kome.ai/api/tools/pdf-to-text', {
      body: JSON.stringify({ url: args.url }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const data = await response.json();
    return (data as { text: string }).text;
  },
  name: 'get_pdf',
  parameters: z.object({
    url: z.string().describe('The URL of the PDF file to extract text from'),
  }),
});

server.addTool({
  description: 'Fetch the markdown content of a public Google Doc by URL',
  execute: async args => {
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
  name: 'get_public_google_doc_markdown',
  parameters: z.object({
    url: z.string().describe('The public Google Doc URL'),
  }),
});

server.addResource({
  async load() {
    return {
      text: 'Example log content',
    };
  },
  mimeType: 'text/plain',
  name: 'Application Logs',
  uri: 'file:///logs/app.log',
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

main().catch(error => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
