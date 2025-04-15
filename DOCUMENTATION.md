# Cloud Drive Application Documentation

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Architecture](#architecture)
4. [Modules](#modules)
5. [Components](#components)
6. [Features](#features)
7. [Technical Implementation](#technical-implementation)
8. [Getting Started](#getting-started)
9. [Design Decisions](#design-decisions)

## Overview

The Cloud Drive Application is a modern web-based file management system built with Angular 17 and Node.js. It provides a user-friendly interface for managing files and folders with features like file upload, download, organization, and metadata management.

## Project Structure

```
cloud-drive/
├── src/
│   ├── app/
│   │   ├── core/           # Core functionality
│   │   ├── features/       # Feature modules
│   │   │   └── drive/     # Main drive module
│   │   └── shared/        # Shared components
│   ├── assets/
│   └── environments/
├── server.js              # Backend server
├── db.json               # Data storage
└── storage/             # File storage
```

## Architecture

The application follows a modular architecture with clear separation of concerns:

### Frontend (Angular)
- **Core Module**: Essential services and guards
- **Feature Modules**: Drive module (lazy loaded)
- **Shared Module**: Reusable components and directives

### Backend (Node.js/Express)
- RESTful API using JSON Server
- File storage management
- Metadata handling

## Modules

### Core Module
- **Purpose**: Contains essential services and guards
- **Components**: 
  - Services for file operations
  - Core models and interfaces

### Drive Module (Lazy Loaded)
- **Purpose**: Main feature module for file management
- **Components**:
  - File list
  - File operations
  - Empty drive state

### File Operations Module
- **Purpose**: Handles all file-related operations
- **Components**:
  - Create folder dialog
  - File delete dialog
  - File details dialog
  - File metadata editor

### Shared Module
- **Purpose**: Reusable components and utilities
- **Components**:
  - Common UI elements
  - Shared services
  - Utility functions

## Components

### File List
- Displays files and folders in a grid/list view
- Supports sorting and filtering
- Keyboard navigation support
- Accessibility features

### File Operations
- File upload functionality
- Folder creation
- File deletion
- Metadata editing

### Dialogs
1. **Create Folder Dialog**
   - Folder name input
   - Parent folder selection
   - Validation

2. **File Delete Dialog**
   - Confirmation interface
   - Multiple file selection
   - Warning messages

3. **File Detail Dialog**
   - Metadata viewing
   - Edit capabilities
   - File information display

## Features

### File Management
- Upload/download files
- Create/delete folders
- Move files between folders
- Multiple file selection
- Metadata editing

### User Interface
- Responsive design
- Keyboard navigation
- Accessibility support
- Modern Material Design

### Data Management
- Real-time updates
- Efficient file storage
- Metadata tracking
- Parent-child relationships

## Technical Implementation

### File Storage System
1. **File Upload Process**:
   - Files are uploaded to the server
   - Metadata is stored in db.json
   - Physical files stored in storage directory
   - Parent folder relationships maintained

2. **File Retrieval**:
   - Metadata fetched from db.json
   - Files served from storage directory
   - Efficient caching implementation

### Keyboard Navigation
- Arrow keys for navigation
- Enter for selection
- Space for multi-select
- Delete for removal
- F2 for rename

## Getting Started

### Prerequisites
- Node.js
- Angular CLI
- npm

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```
4. Start the Angular application:
   ```bash
   ng serve
   ```

## Design Decisions

### Why Lazy Loading?
- Although currently only one module, lazy loading was implemented for:
  - Future scalability
  - Better initial load performance
  - Module isolation


### Module Organization
- Clear separation of concerns
- Scalable architecture
- Maintainable codebase
- Feature isolation

## Accessibility

The application is built with accessibility in mind:
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast support
- Focus management

## Future Improvements

1. **Planned Features**:
   - File sharing
   - User authentication
   - File versioning
   - Advanced search

2. **Technical Improvements**:
   - Implement file request module
   - Add file sharing module
   - Enhance error handling
   - Add unit tests 