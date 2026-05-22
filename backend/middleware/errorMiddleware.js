export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  console.error(`
╔════════════════════════════════════════╗
║            404 NOT FOUND               ║
╚════════════════════════════════════════╝
Path: ${req.originalUrl}
Method: ${req.method}
Timestamp: ${new Date().toISOString()}
  `);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Enhanced error logging to terminal with detailed formatting
  console.error(`
╔════════════════════════════════════════╗
║         ERROR HANDLER TRIGGERED        ║
╚════════════════════════════════════════╝
┌─ ERROR DETAILS ─────────────────────────┐
│ Status Code: ${String(statusCode).padEnd(27)} │
│ Message: ${err.message.substring(0, 30).padEnd(28)} │
│ Path: ${req.path.substring(0, 33).padEnd(33)} │
│ Method: ${req.method.padEnd(31)} │
│ Timestamp: ${new Date().toISOString().padEnd(28)} │
├─────────────────────────────────────────┤
│ Request Body: ${JSON.stringify(req.body).substring(0, 27)} │
│ Query Params: ${JSON.stringify(req.query).substring(0, 25)} │
└─────────────────────────────────────────┘
${err.stack ? `\nStack Trace:\n${err.stack}` : ''}
`);

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  });
};
