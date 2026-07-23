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

  /**
   * Fetches the user's Google Drive storage quota details.
   * @param {string} accessToken - The Google OAuth access token.
   * @returns {Promise<Object>} Object containing limit and usage in bytes.
   */
  async getStorageDetails(accessToken) {
    if (!accessToken) {
      throw new Error("No Google OAuth access token provided.");
    }

    if (accessToken === 'mock-google-drive-access-token') {
      // Mock storage details for Demo Mode
      return {
        limit: 15 * 1024 * 1024 * 1024, // 15 GB
        usage: 3.4 * 1024 * 1024 * 1024  // 3.4 GB
      };
    }

    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/about?fields=storageQuota', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Google Drive API error (${response.status})`);
      }

      const data = await response.json();
      return {
        limit: parseInt(data.storageQuota.limit || 0, 10),
        usage: parseInt(data.storageQuota.usage || 0, 10)
      };
    } catch (error) {
      console.error("Failed to fetch Google Drive storage details:", error);
      throw error;
    }
  }
}
