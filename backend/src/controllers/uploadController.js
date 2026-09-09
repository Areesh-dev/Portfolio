import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToBucket, ALLOWED_BUCKETS } from '../services/storageService.js';

export const upload = asyncHandler(async (req, res) => {
  const { bucket } = req.params;
  if (!ALLOWED_BUCKETS.includes(bucket)) {
    throw new ApiError(400, `Unknown bucket. Allowed: ${ALLOWED_BUCKETS.join(', ')}`);
  }
  if (!req.file) {
    throw new ApiError(400, 'No file provided');
  }
  const result = await uploadToBucket(bucket, req.file);
  res.status(201).json(result);
});
