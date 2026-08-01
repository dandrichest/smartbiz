import test from 'node:test';
import assert from 'node:assert/strict';
import { uploadImageIfNeeded } from '../src/utils/imageUpload.js';

test('returns the original data URL when Cloudinary is not configured', async () => {
  const dataUrl = 'data:image/png;base64,abc123';
  const result = await uploadImageIfNeeded(dataUrl);

  assert.equal(result, dataUrl);
});

test('preserves remote image URLs without changing them', async () => {
  const remoteUrl = 'https://example.com/product.jpg';
  const result = await uploadImageIfNeeded(remoteUrl);

  assert.equal(result, remoteUrl);
});
