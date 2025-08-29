# User Admin Dashboard
A metadata-driven data grid for managing users, built with modern React and TypeScript.

## Features
*   **Metadata-Driven Grid**: Renders a high-performance [Material React Table (MRT)](https://www.material-react-table.com/) data grid - React Query Table.
*   **Nested Data Support**: Displays complex, nested data like user groups and roles.
*   **Optimistic UI**: Provides instant feedback for user status updates using TanStack Query.
*   **Performance**: Demonstrates efficient data handling for filtering, sorting, and pagination.
*   **Dual-Mode API Handling**:
    *   **Development**: Uses Mock Service Worker (MSW) to seamlessly intercept and mock API calls for a smooth development experience without a live backend.
    *   **Production**: Switches to a zero-backend, in-memory data source for the deployed application, allowing it to function independently.

## Tech Stack
*   **Frontend**: React, TypeScript, Material UI, Material React Table (MRT), TanStack Query (React Query)
*   **Tools**: Vite, ESLint, Prettier, VS Code
*   **API**: Mock Service Worker (MSW) for development, with a conditional switch to in-memory data for production.

## Getting Started
1.  **Clone the repository**.
    ```bash
    git clone https://github.com/DhruthiV/admin-dashboard-vegam.git
    ```
2.  **Install dependencies**.
    ```bash
    npm install
    ```
3.  **Run the project in development mode** (with MSW mocking enabled).
    ```bash
    npm run dev
    ```
4.  **Create a production build** (with in-memory data).
    ```bash
    npm run build
    ```

## Data Handling Strategy
For this project, a conditional API layer was implemented in `src/api/userApi.ts`.

*   **During Development**: The application makes standard `fetch` calls, which are intercepted and handled by **Mock Service Worker (MSW)**. This allows for realistic API interactions during development.
*   **When Deployed to Production**: The application automatically bypasses all `fetch` calls and instead uses the imported **in-memory data** from `src/mocks/data.ts`. This ensures the live application is fully functional without a dedicated backend server.

This approach provides a robust development workflow while ensuring a deployable, self-contained, and performant application.
