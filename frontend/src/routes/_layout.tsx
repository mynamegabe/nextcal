import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { CalendarClock } from "lucide-react";
import { getCookie } from "@/lib/utils";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie("access_token");
      console.log(token);
      setIsAuthenticated(token !== undefined);
    };

    // Check on mount
    checkAuth();

    // Set up interval to check periodically
    const interval = setInterval(checkAuth, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <NavigationMenu className="flex justify-between w-full max-w-screen fixed px-4 py-2 z-50 bg-background border-b">
        <NavigationMenuList>
          <CalendarClock className="text-foreground" />
          <p className="font-bold px-2 text-foreground">NextCal</p>

          {isAuthenticated && (
            <>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/app">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Calendar
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </>
          )}
        </NavigationMenuList>

        <NavigationMenuList>
          {!isAuthenticated ? (
            <NavigationMenuItem>
              <Link to="/auth?action=login">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Login
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} cursor-pointer bg-rose-600 text-white hover:bg-rose-700 hover:text-white`}
                onMouseDown={() => {
                  document.cookie =
                    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=gabrielseet.com";
                  setIsAuthenticated(false);
                  window.location.href = "/";
                }}
              >
                Logout
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex flex-col w-screen min-h-screen h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
