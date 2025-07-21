# QI

QI is a minimalist note-taking application that focuses on privacy and simplicity.

## Features

- **Local Storage**: Everything saves locally in your browser - no cloud, no tracking
- **PIN Protection**: Secure your notes with a 4-digit PIN
- **Dark/Light Mode**: Choose your preferred theme
- **Automatic Timestamps**: Add timestamps automatically or manually
- **Export/Import**: Save your notes to a file or import from a text file
- **Print**: Print your notes with a clean, formatted layout
- **Zero Distractions**: Focus on your content with a minimal interface

## Getting Started

### Installation

\`\`\`bash
# Install dependencies
npm install
# or
pnpm install

# Run the development server
npm run dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Usage

1. **Writing Notes**: Simply start typing in the main text area
2. **Adding Timestamps**: 
   - Press `Ctrl+T` (or `Cmd+T` on Mac) to insert a timestamp manually
   - Double-press Enter to automatically insert a timestamp
   - Enable/disable automatic timestamps with the clock icon
3. **Securing Your Notes**:
   - Click the lock icon to set a 4-digit PIN
   - Your notes will be locked when you return to the app
4. **Exporting/Importing**:
   - Use the download icon to save your notes as a text file
   - Use the upload icon to import notes from a text file
5. **Printing**:
   - Click the document icon to open a print-friendly version

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## License

This project is open source and available under the [MIT License](LICENSE).
