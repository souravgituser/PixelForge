/**
 * PixelForge AI Editor - Google Drive Service Module
 * Handles direct REST API communication with Google Drive.
 */

export class GoogleDriveService {
  constructor() {}

  /**
   * Uploads an image blob to the user's Google Drive.
   * @param {Blob} imageBlob - The file content to upload.
   * @param {string} fileName - The desired name of the file in Google Drive.
   * @param {string} accessToken - The Google OAuth access token.
   * @returns {Promise<Object>} The API response metadata containing the file ID.
   */
  async uploadFile(imageBlob, fileName, accessToken) {
    if (!accessToken) {
      throw new Error("No Google OAuth access token provided. Please log in first.");
    }

    const boundary = 'foo_bar_boundary';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: fileName,
      mimeType: imageBlob.type || 'image/png',
      description: 'Edited and saved via PixelForge AI Editor'
    };

    // Metadata part
    const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
    
    // Media file part header
    const mediaPartHeader = `${delimiter}Content-Type: ${metadata.mimeType}\r\n\r\n`;

    // Construct the multipart body as a Blob
    const multipartBody = new Blob([
      metadataPart,
      mediaPartHeader,
      imageBlob,
      closeDelimiter
    ], { type: `multipart/related; boundary=${boundary}` });

    try {
      console.log(`Uploading file '${fileName}' to Google Drive...`);
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google Drive API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log("Google Drive upload completed successfully. File ID:", data.id);
      return data;
    } catch (error) {
      console.error("Google Drive upload failed:", error);
      throw error;
    }
  }
}
