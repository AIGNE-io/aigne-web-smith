/**
 * @module retry-utils
 * @description Utility functions for managing retry attempts and failure handling in agent tools.
 * Provides counter management, error handling with configurable limits, and context value management.
 */

/**
 * Default configuration for retry behavior
 */
const DEFAULT_CONFIG = {
  maxRetries: 3,
  contextKey: "toolFailureCount",
  errorName: "MaxRetryError",
  errorMessage: "Maximum retry attempts reached. Please refine your request and try again.",
};

/**
 * Get the user context from options
 * @param {object} options - The options object containing context
 * @returns {object|null} The user context or null if not available
 */
function getUserContext(options) {
  return options?.context?.userContext || null;
}

/**
 * Initialize a counter in userContext if it doesn't exist
 * @param {object} options - The options object containing context
 * @param {string} [key] - The key name for the counter (default: 'toolFailureCount')
 * @param {number} [initialValue=0] - The initial value for the counter
 */
export function initializeCounter(options, key = DEFAULT_CONFIG.contextKey, initialValue = 0) {
  const userContext = getUserContext(options);
  if (userContext && userContext[key] === undefined) {
    userContext[key] = initialValue;
  }
}

/**
 * Increment a counter in userContext
 * @param {object} options - The options object containing context
 * @param {string} [key] - The key name for the counter (default: 'toolFailureCount')
 * @returns {number} The updated counter value
 */
export function incrementCounter(options, key = DEFAULT_CONFIG.contextKey) {
  const userContext = getUserContext(options);
  if (!userContext) {
    return 0;
  }

  if (userContext[key] === undefined) {
    userContext[key] = 0;
  }

  userContext[key]++;
  return userContext[key];
}

/**
 * Get the current value of a counter
 * @param {object} options - The options object containing context
 * @param {string} [key] - The key name for the counter (default: 'toolFailureCount')
 * @returns {number} The current counter value
 */
export function getCounter(options, key = DEFAULT_CONFIG.contextKey) {
  const userContext = getUserContext(options);
  return userContext?.[key] ?? 0;
}

/**
 * Reset a counter to a specific value
 * @param {object} options - The options object containing context
 * @param {string} [key] - The key name for the counter (default: 'toolFailureCount')
 * @param {number} [value=0] - The value to reset to
 */
export function resetCounter(options, key = DEFAULT_CONFIG.contextKey, value = 0) {
  const userContext = getUserContext(options);
  if (userContext) {
    userContext[key] = value;
  }
}

/**
 * Create a custom error with a specific name
 * @param {string} name - The error name
 * @param {string} message - The error message
 * @returns {Error} The created error
 */
export function createError(name, message) {
  const error = new Error(message);
  error.name = name;
  return error;
}

/**
 * Increment the failure count and throw an error if max retries is reached
 * @param {object} options - The options object containing context
 * @param {object} [config] - Optional configuration
 * @param {number} [config.maxRetries] - Maximum number of retries before throwing error
 * @param {string} [config.contextKey] - The key name for the counter
 * @param {string} [config.errorName] - The name of the error to throw
 * @param {string} [config.errorMessage] - The error message
 * @throws {Error} When retry limit is reached
 */
export function handleFailure(options, config = {}) {
  const {
    maxRetries = DEFAULT_CONFIG.maxRetries,
    contextKey = DEFAULT_CONFIG.contextKey,
    errorName = DEFAULT_CONFIG.errorName,
    errorMessage = DEFAULT_CONFIG.errorMessage,
  } = config;

  const userContext = getUserContext(options);
  if (!userContext) {
    return;
  }

  const currentCount = incrementCounter(options, contextKey);

  if (currentCount >= maxRetries) {
    throw createError(errorName, errorMessage);
  }
}

/**
 * Initialize the failure count (convenience wrapper for backward compatibility)
 * @param {object} options - The options object containing context
 */
export function initializeFailureCount(options) {
  initializeCounter(options, DEFAULT_CONFIG.contextKey, 0);
}

/**
 * Reset the failure count (convenience wrapper for backward compatibility)
 * @param {object} options - The options object containing context
 */
export function resetFailureCount(options) {
  resetCounter(options, DEFAULT_CONFIG.contextKey, 0);
}

/**
 * Get or set a value in userContext
 * @param {object} options - The options object containing context
 * @param {string} key - The key name
 * @param {*} [value] - If provided, sets the value; otherwise gets the value
 * @returns {*} The value (when getting) or undefined (when setting)
 */
export function contextValue(options, key, value) {
  const userContext = getUserContext(options);
  if (!userContext) {
    return undefined;
  }

  if (value !== undefined) {
    userContext[key] = value;
    return undefined;
  }

  return userContext[key];
}

/**
 * Check if a key exists in userContext
 * @param {object} options - The options object containing context
 * @param {string} key - The key name
 * @returns {boolean} True if the key exists
 */
export function hasContextKey(options, key) {
  const userContext = getUserContext(options);
  return userContext ? key in userContext : false;
}
