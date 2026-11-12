/**
 * API Client Simulation Layer
 * Simulates network latency, response wrapping, and error handling.
 * Designed so that when a real backend is attached, only this module requires URL configuration.
 */

const SIMULATED_LATENCY_MS = 250;

export const apiClient = {
  get: async (endpoint, dataCallback) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = dataCallback();
          resolve({
            data: result,
            status: 200,
            statusText: 'OK'
          });
        } catch (error) {
          reject({
            message: error.message || 'Network request failed',
            status: 500
          });
        }
      }, SIMULATED_LATENCY_MS);
    });
  },

  post: async (endpoint, payload, saveCallback) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const savedItem = saveCallback(payload);
          resolve({
            data: savedItem,
            status: 201,
            statusText: 'Created'
          });
        } catch (error) {
          reject({
            message: error.message || 'Creation failed',
            status: 400
          });
        }
      }, SIMULATED_LATENCY_MS);
    });
  }
};

export default apiClient;

