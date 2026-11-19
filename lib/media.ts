/**
 * Public URL for a file in the media library.
 * Paths stay rooted at /ace. Set NEXT_PUBLIC_MEDIA_CDN to the S3 CDN origin
 * in production. Leave it empty to serve the same paths from public/.
 */
export function media(path: string) {
  const file = path.startsWith("/") ? path : `/${path}`;
  const cdn = process.env.NEXT_PUBLIC_MEDIA_CDN?.replace(/\/$/, "");
  return cdn ? `${cdn}${file}` : file;
}
