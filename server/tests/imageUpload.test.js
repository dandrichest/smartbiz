import test from 'node:test';
import assert from 'node:assert/strict';
import { uploadImageIfNeeded, isCloudinaryConfigured } from '../src/utils/imageUpload.js';

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

test('detects Cloudinary configuration from CLOUDINARY_URL', () => {
  process.env.CLOUDINARY_URL = 'cloudinary://test:test@demo';
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;

  assert.equal(isCloudinaryConfigured(), true);
});
