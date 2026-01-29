/**
 * Health check endpoint
 */

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.status(200).json({
    status: 'ok',
    service: 'gmail-mail-service',
    timestamp: new Date().toISOString(),
  });
};
