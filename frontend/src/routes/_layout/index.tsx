import { Button } from "@/components/ui/button";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRightIcon, BrainCircuit } from "lucide-react";

export const Route = createFileRoute("/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      console.log(credentialResponse);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });
  return (
    <div>
      <img
        src="/public/meeting.jpg"
        alt="meeting"
        className="w-screen h-screen object-cover fixed top-0 left-0 brightness-[0.3] blur-sm z-10"
      />
      {/* <div className="flex flex-col justify-center w-screen min-h-screen h-screen overflow-y-auto p-4 pt-16 relative z-20">
        <div className="flex flex-col gap-2 ml-16">
          <h1 className="text-7xl text-white doto">NEXTCAL</h1>
          <p className="text-white">
            Boost your productivity and time management with NextCal
          </p>
          <Button className="w-fit mt-4">Get Started <ArrowRightIcon/></Button>
        </div>
      </div> */}
      <div className="flex flex-col w-screen min-h-screen h-screen overflow-y-auto relative z-20">
        <div className="flex flex-col gap-2 ml-16 mt-32">
          <h1 className="text-7xl text-white doto">NEXTCAL</h1>
          <p className="text-white">
            Boost your productivity and time management with NextCal
          </p>
          <div className="flex gap-4 mt-4">
            {/* <div className="flex flex-col gap-2">
              <BrainCircuit className="text-white" size={48} />
            </div> */}
          </div>
        </div>

        <Button
          className="w-fit mt-4 bg-emerald-500 fixed bottom-16 right-16 hover:bg-emerald-600"
          asChild
        >
          <Link to="/app">
            Get Started <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </div>
  );
}
