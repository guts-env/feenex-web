export const ALLOWED_IMAGE_TYPES = {
  'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'],
  'application/*': ['.pdf'],
} as const;

export const ALLOWED_DOCUMENT_TYPES = {
  'application/*': ['.xls', '.xlsx', '.csv'],
} as const;
