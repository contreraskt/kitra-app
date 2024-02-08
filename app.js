const express = require('express');
const treasuresRouter = require('./routes/treasures');
const app = express();
const PORT = process.env.PORT || 3000;

// Mount the treasures route
app.use('/api', treasuresRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
