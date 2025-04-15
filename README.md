# Cloud Drive Application

A modern web-based file management system built with Angular 17 and Node.js.

## Features

- File upload and download
- Folder creation and management
- File metadata editing
- Keyboard navigation
- Accessibility support
- Modern Material Design UI

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v17)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd cloud-drive
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the backend server:
```bash
node server.js
```
The server will run on http://localhost:3000

2. In a new terminal, start the Angular application:
```bash
ng serve
```
The application will be available at http://localhost:4200

## Development

- Backend server runs on port 3000
- Frontend development server runs on port 4200
- File storage is in the `storage/` directory
- Metadata is stored in `db.json`

## Project Structure

```
cloud-drive/
├── src/                    # Angular source code
│   ├── app/
│   │   ├── core/          # Core functionality
│   │   ├── features/      # Feature modules
│   │   └── shared/        # Shared components
│   ├── assets/
│   └── environments/
├── server.js              # Backend server
├── db.json               # Data storage
└── storage/             # File storage
```

## Documentation

For detailed documentation, please refer to [DOCUMENTATION.md](DOCUMENTATION.md)

## License

[Your License]
