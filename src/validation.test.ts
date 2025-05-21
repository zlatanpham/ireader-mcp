import { expect, it } from 'vitest';
import { extractGoogleDocId } from './validation';

it('extractGoogleDocId should extract the ID from a Google Docs URL', () => {
  const url = 'https://docs.google.com/document/d/1234567890abcdefg/edit';
  const id = extractGoogleDocId(url);
  expect(id).toBe('1234567890abcdefg');
});

it('extractGoogleDocId should handle Google Docs URLs with www', () => {
  const url = 'https://www.docs.google.com/document/d/1234567890abcdefg/edit';
  const id = extractGoogleDocId(url);
  expect(id).toBe('1234567890abcdefg');
});

it('extractGoogleDocId should return null if the URL is not a Google Docs URL', () => {
  const url = 'https://example.com/document/d/1234567890abcdefg/edit';
  const id = extractGoogleDocId(url);
  expect(id).toBe(null);
});

it('extractGoogleDocId should return null if the URL is invalid', () => {
  const url = 'invalid-url';
  const id = extractGoogleDocId(url);
  expect(id).toBe(null);
});

it('extractGoogleDocId should handle URLs with additional parameters', () => {
  const url = 'https://docs.google.com/document/d/1234567890abcdefg/edit?usp=sharing';
  const id = extractGoogleDocId(url);
  expect(id).toBe('1234567890abcdefg');
});

it('extractGoogleDocId should handle different Google Docs URL formats', () => {
    const url1 = 'https://docs.google.com/document/d/abcdefg1234567890/view';
    const id1 = extractGoogleDocId(url1);
    expect(id1).toBe('abcdefg1234567890');

    const url2 = 'https://docs.google.com/document/d/zyxwvu9876543210/';
    const id2 = extractGoogleDocId(url2);
    expect(id2).toBe('zyxwvu9876543210');
});
