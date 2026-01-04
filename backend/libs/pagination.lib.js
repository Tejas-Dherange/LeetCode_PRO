/**
 * Pagination Utility
 * 
 * Helper functions for consistent pagination across all endpoints
 */

/**
 * Get pagination parameters from query string
 * @param {Object} query - Express req.query object
 * @param {Object} options - Default options
 * @returns {Object} Validated pagination params
 */
export const getPaginationParams = (query, options = {}) => {
  const {
    defaultPage = 1,
    defaultLimit = 20,
    maxLimit = 100
  } = options;

  let page = parseInt(query.page) || defaultPage;
  let limit = parseInt(query.limit) || defaultLimit;

  // Validation
  page = Math.max(1, page);
  limit = Math.max(1, Math.min(limit, maxLimit));

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    take: limit
  };
};

/**
 * Create pagination metadata for response
 * @param {number} total - Total count of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export const createPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;
  const hasPrevious = page > 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasMore,
    hasPrevious,
    nextPage: hasMore ? page + 1 : null,
    prevPage: hasPrevious ? page - 1 : null
  };
};

/**
 * Create paginated response
 * @param {Array} data - Array of items
 * @param {number} total - Total count
 * @param {number} page - Current page  
 * @param {number} limit - Items per page
 * @returns {Object} Standardized paginated response
 */
export const paginatedResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: createPaginationMeta(total, page, limit)
  };
};
