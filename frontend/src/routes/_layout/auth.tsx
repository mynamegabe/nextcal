import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleOAuthFlow } from "@/lib/api";
import { getCookie, setCookie, deleteCookie } from "@/lib/utils";

export const Route = createFileRoute("/_layout/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const login = useGoogleLogin({
    // onSuccess: (tokenResponse) => console.log(tokenResponse),
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      let data = await googleOAuthFlow(tokenResponse.access_token);
      setCookie("access_token", data.access_token, 7);
      const token = data.access_token;
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.new_user) {
        window.location.href = "/user";
      }
      else {
        window.location.href = "/app";

      }
    },
  });
 

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
      <CalendarClock size={36} />
      <h1 className="text-2xl font-bold">NextCal</h1>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Log in to your account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="johndoe@gmail.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 items-center">
              <Button className="w-full">Login</Button>
              <p className="text-center text-sm text-gray-500">or</p>
              <Button
                onClick={login}
                className="w-full bg-secondary text-primary hover:bg-secondary hover:brightness-95 hover:text-primary transition-all"
              >
                <img
                  src="/public/google.png"
                  alt="Google"
                  width={16}
                  height={16}
                />
                Login with Google
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
