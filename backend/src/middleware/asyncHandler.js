/**
 * 15@B:0 4;O 0A8=E@>==KE DC=:F89 Express 4;O 02B><0B8G5A:>3> ?5@5E20B0 >H81>:
 * @param {Function} fn - A8=E@>==0O DC=:F8O middleware
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;