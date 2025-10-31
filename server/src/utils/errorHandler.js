export function handleError(error, res, message) {
  console.error(`Error in controller: ${message}`, error);
  
  if (error.name === 'BSONError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid todo ID format',
    });
  }
  
  return res.status(500).json({
    success: false,
    message,
    error: error.message,
  });
}

