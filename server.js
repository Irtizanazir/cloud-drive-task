const jsonServer = require('json-server');
const express = require('express');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage/files/');
  },
  filename: function (req, file, cb) {
    // Use the original file id as filename
    const fileId = req.body.id || Date.now().toString(36) + Math.random().toString(36).substring(2);
    const extension = path.extname(file.originalname);
    cb(null, fileId + extension);
  }
});

const upload = multer({ storage: storage });

// Use default middlewares (cors, static, etc)
server.use(middlewares);

// Parse JSON bodies
server.use(jsonServer.bodyParser);

// Serve files from storage directory
server.use('/content', express.static(path.join(__dirname, 'storage/files')));

// Handle file uploads
server.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileData = {
    id: path.parse(file.filename).name, // Remove extension
    name: req.body.name || file.originalname,
    type: file.mimetype,
    size: file.size,
    path: `/content/${file.filename}`,
    parentId: req.body.parentId || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modifiedDate: new Date().toISOString()
  };

  // Read current db.json
  const db = router.db.getState();
  
  // Add new file to files array
  db.files.push(fileData);

  // Update parent folder's files count if file has a parent
  if (fileData.parentId) {
    const parentFolder = db.files.find(f => f.id === fileData.parentId);
    if (parentFolder) {
      // Ensure files count is a number and increment it
      parentFolder.files = (Number(parentFolder.files) || 0) + 1;
      // Update the folder's modified date
      parentFolder.modifiedDate = new Date().toISOString();
    }
  }
  
  // Write back to db.json
  router.db.setState(db);
  
  // Force write to disk
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  
  res.json(fileData);
});

// Handle folder creation
server.post('/files/folder', (req, res) => {
  const folderData = {
    ...req.body,
    files: 0, // Initialize files count to 0
    type: 'application/folder' // Ensure type is set correctly
  };

  // Add folder entry to db.json
  const db = router.db.getState();
  db.files.push(folderData);
  router.db.setState(db);

  res.json(folderData);
});

// Use default router
server.use(router);

// Handle file deletion
server.delete('/files/:id', (req, res) => {
  const fileId = req.params.id;
  const db = router.db.getState();
  
  // Find the file in db.json
  const file = db.files.find(f => f.id === fileId);
  if (file) {
    // Decrement parent folder's files count if file has a parent
    if (file.parentId) {
      const parentFolder = db.files.find(f => f.id === file.parentId);
      if (parentFolder) {
        // Ensure files count is a number and decrement it
        parentFolder.files = Math.max(0, (Number(parentFolder.files) || 0) - 1);
        // Update the folder's modified date
        parentFolder.modifiedDate = new Date().toISOString();
      }
    }

    // Delete the actual file if it exists
    if (file.path) {
      const filePath = path.join(__dirname, 'storage/files', path.basename(file.path));
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
  }
  
  // Continue with normal json-server delete operation
  router.handle(req, res);
});

// Start server
const port = 3000;
server.listen(port, () => {
  console.log(`JSON Server with file storage is running on port ${port}`);
}); 