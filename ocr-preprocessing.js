/**
 * OCR Preprocessing Module
 * Shared preprocessing pipeline for consistent handwriting recognition
 * Used by both the main app (index.html) and validation tool (test.html)
 */

const OCRPreprocessing = (() => {
  // Configuration - adjust these to improve accuracy
  const CONFIG = {
    contrast: {
      factor: 2.0,  // Increase for stronger contrast
      enabled: true
    },
    binarize: {
      threshold: 130,  // Adjust threshold (0-255)
      enabled: true
    },
    sharpen: {
      strength: 1.5,
      enabled: true
    },
    denoise: {
      enabled: true
    },
    deskew: {
      enabled: false  // Experimental
    }
  };

  /**
   * Apply full preprocessing pipeline
   * @param {HTMLCanvasElement} canvas - Source canvas with image
   * @param {Object} options - Override default config options
   * @returns {HTMLCanvasElement} Processed canvas
   */
  function preprocess(canvas, options = {}) {
    const mergedConfig = { ...CONFIG };
    if (options.contrast !== undefined) mergedConfig.contrast.enabled = options.contrast;
    if (options.binarize !== undefined) mergedConfig.binarize.enabled = options.binarize;
    if (options.sharpen !== undefined) mergedConfig.sharpen.enabled = options.sharpen;
    if (options.denoise !== undefined) mergedConfig.denoise.enabled = options.denoise;

    // Create working canvas
    const ctx = canvas.getContext('2d');
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Apply preprocessing in sequence
    if (mergedConfig.contrast.enabled) {
      imageData = applyContrast(imageData, mergedConfig.contrast.factor);
    }

    if (mergedConfig.sharpen.enabled) {
      imageData = applySharpen(imageData, mergedConfig.sharpen.strength);
    }

    if (mergedConfig.binarize.enabled) {
      imageData = applyBinarization(imageData, mergedConfig.binarize.threshold);
    }

    if (mergedConfig.denoise.enabled) {
      imageData = applyDenoise(imageData);
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  /**
   * Enhance contrast
   */
  function applyContrast(imageData, factor) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * factor + 128));
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * factor + 128));
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * factor + 128));
    }
    return imageData;
  }

  /**
   * Sharpen using kernel convolution
   */
  function applySharpen(imageData, strength) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const kernel = [-1, -1, -1, -1, 9, -1, -1, -1, -1].map(k => k * strength);
    const output = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let r = 0, g = 0, b = 0;
        let k = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            r += data[idx] * kernel[k];
            g += data[idx + 1] * kernel[k];
            b += data[idx + 2] * kernel[k];
            k++;
          }
        }

        const idx = (y * width + x) * 4;
        output[idx] = Math.min(255, Math.max(0, r));
        output[idx + 1] = Math.min(255, Math.max(0, g));
        output[idx + 2] = Math.min(255, Math.max(0, b));
      }
    }

    return new ImageData(output, width, height);
  }

  /**
   * Convert to black & white at threshold
   */
  function applyBinarization(imageData, threshold) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const value = gray > threshold ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = value;
    }
    return imageData;
  }

  /**
   * Simple median filter for noise reduction
   */
  function applyDenoise(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const pixels = [];

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            pixels.push(data[idx]);
          }
        }

        pixels.sort((a, b) => a - b);
        const median = pixels[Math.floor(pixels.length / 2)];

        const idx = (y * width + x) * 4;
        output[idx] = output[idx + 1] = output[idx + 2] = median;
      }
    }

    return new ImageData(output, width, height);
  }

  /**
   * Get current configuration
   */
  function getConfig() {
    return JSON.parse(JSON.stringify(CONFIG));
  }

  /**
   * Update configuration
   */
  function updateConfig(newConfig) {
    Object.assign(CONFIG, newConfig);
  }

  /**
   * Get Tesseract options optimized for handwriting
   */
  function getTesseractOptions() {
    return {
      lang: 'eng',
      oem: 1,  // Use LSTM only
      psm: 6,  // Single uniform block of text
    };
  }

  return {
    preprocess,
    getConfig,
    updateConfig,
    getTesseractOptions
  };
})();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OCRPreprocessing;
}
