import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { toast } from "sonner";

// It's the layout component
export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
