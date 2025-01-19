import { RouterProvider, createRouter } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// Import the auto generated route tree
import { routeTree } from "./routeTree.gen";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./components/theme-provider";

// Create a new router instance
const router = createRouter({ routeTree });

export default function App() {
  return (
    <>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <GoogleOAuthProvider clientId="935099519506-s9cmrmecgtuc957cfnrj5365e5ha3v88.apps.googleusercontent.com">
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </SidebarProvider>
    </ThemeProvider>
    </>
  );
}
