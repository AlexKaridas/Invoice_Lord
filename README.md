# Invoice Lord

**Invoice Lord** is a cross-platform desktop application designed to streamline product management and sales operations. Built with [Next.js](https://nextjs.org/) and [Tauri](https://tauri.app/), it leverages a Rust backend to deliver a fast and efficient user experience. The application reads product data from a text file, imports it into a SQLite database, and provides a comprehensive interface for managing products and processing sales.

## Features

- **Product Import:** Automatically reads product information from a specified text file and imports it into a SQLite database using Rust and Tauri.

- **Product Management:** View, add, edit, and delete products through a user-friendly interface built with Next.js and styled with Tailwind CSS.

- **Shopping Cart:** Add products to a shopping cart, adjust quantities, and process sales transactions seamlessly.

## Technologies Used

- **Frontend:**
  - [Next.js](https://nextjs.org/): A React-based framework for building fast and scalable user interfaces.
  - [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.

- **Backend:**
  - [Tauri](https://tauri.app/): A framework for building tiny, fast binaries for all major desktop platforms.
  - [Rust](https://www.rust-lang.org/): A systems programming language renowned for its performance and safety.
  - [SQLite](https://www.sqlite.org/): A lightweight, self-contained SQL database engine.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or later)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/YourUsername/invoice-lord.git
   cd invoice-lord
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

### Development

To run the application in development mode:

```bash
npm run tauri dev
```

This command starts the Next.js development server and launches the Tauri application, allowing you to view changes in real-time.

### Building for Production

To build the application for production:

```bash
npm run tauri build
```

This command compiles the application into a standalone executable for your operating system.

## Usage

1. **Import Products:**
   - Prepare a text file containing product information in the required format.
   - Place the text file in the designated directory.
   - The application will read the file and import the data into the SQLite database.

2. **Manage Products:**
   - Launch the application to view the list of products.
   - Use the interface to add new products, edit existing ones, or delete products as needed.

3. **Shopping Cart:**
   - Add products to the shopping cart by selecting them from the product list.
   - Adjust quantities and review the cart before proceeding to checkout.
   - Complete the sales transaction through the application's checkout process.

## Project Structure

- **`src/`**: Contains the Next.js frontend source files.
- **`src-tauri/`**: Contains the Tauri Rust backend source files.

For more detailed information on the technologies used, please refer to the [Next.js documentation](https://nextjs.org/docs) and the [Tauri documentation](https://tauri.app/docs).

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your enhancements.
