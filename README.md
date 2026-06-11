# CattleScope



CattleScope is an AI-powered web application designed for the accurate and rapid identification of cattle and buffalo breeds. Built to assist field-level workers and enthusiasts, it provides real-time analysis via a device's camera or through image uploads, complemented by a comprehensive and searchable breed database.

## Key Features

*   **AI-Powered Breed Recognition**: Utilizes a machine learning model trained via Teachable Machine and TensorFlow.js to identify over 40 distinct cattle and buffalo breeds.
*   **Dual Analysis Modes**:
    *   **Live AI Feed**: Activate your device's camera for real-time breed identification, complete with a live confidence panel.
    *   **Static Analysis**: Upload a picture of a cow or buffalo to receive a detailed analysis of the most likely breeds.
*   **Comprehensive Breed Database**: A searchable database containing information on various breeds, including their origin, physical characteristics, and primary use (e.g., milk, draught).
*   **Multi-Language Support**: Integrated with Google Translate to make the application accessible to users across various regions of India.
*   **Responsive Design**: A clean, modern interface built with Tailwind CSS that works seamlessly on desktop and mobile devices.

## Technology Stack

*   **Frontend**: React.js, Vite
*   **AI/Machine Learning**: TensorFlow.js, Teachable Machine
*   **Styling**: Tailwind CSS
*   **Routing**: React Router

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/ryuk956983/CattleScope.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd CattleScope
    ```

3.  **Install the dependencies:**
    ```sh
    npm install
    ```

4.  **Start the development server:**
    ```sh
    npm run dev
    ```
    This will launch the application, which you can access at `http://localhost:5173` (or another port if 5173 is in use).

## Usage

The application is divided into three main sections:

### 1. Breed Recognition (`/recognition`)

This is the core AI tool for identifying breeds.

*   **Static Analysis**:
    1.  Click the "Click to Upload" area to select an image file (PNG or JPG).
    2.  Once the image preview appears, click the "Identify Breed" button.
    3.  The results will be displayed in the "Recognition Results" panel, with the highest-confidence match highlighted.

*   **Live AI Feed**:
    1.  Click the "Start" button to activate your device's camera. You may need to grant camera permissions.
    2.  Point the camera at a cow or buffalo.
    3.  The "Live Confidence Panel" on the right will show real-time predictions and their confidence levels.
    4.  Use the "Switch Source" button if you have multiple cameras on your device.
    5.  Click "Stop" to deactivate the camera feed.

### 2. Breed Database (`/database`)

*   Navigate to this page to browse a list of cattle and buffalo breeds.
*   Use the search bar at the top to filter breeds by name or location.
*   Each card provides a summary of the breed's origin and characteristics.

### 3. Landing Page (`/`)

*   The main entry point of the application, providing an overview of the features and links to the **Breed Recognition** tool and the **Breed Database**.
