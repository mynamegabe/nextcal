import {
  ArrowUpDown,
  Calendar as CalendarIcon,
  Home,
  Inbox,
  PlusIcon,
  RefreshCcw,
  Search,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import {
  getProfile,
  updateRecommendations,
  getRecommendations,
} from "@/lib/api";
import { AddCalendarForm } from "./add-calendar-form";
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "./ui/button";
import { AddEventForm } from "./add-event-form";

function Droppable({ index, id, ...props }) {
  const { setNodeRef } = useDroppable({
    id: id,
    data: { to: index },
  });

  return (
    <div ref={setNodeRef} className="flex flex-col gap-2 grow">
      {props.children}
    </div>
  );
}

function Draggable({ id, index, event }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: {
      from: index,
      event: event,
    },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-blue-500 text-left text-xs text-white rounded p-2"
    >
      {event.title}
    </div>
  );
}

const calendars = [
  {
    color: "#ef476f",
    id: 1,
    name: "Personal",
    description: "Personal calendar",
  },
  {
    color: "#ffd166",
    id: 2,
    name: "Work",
    description: "Work calendar",
  },
  {
    color: "#06d6a0",
    id: 3,
    name: "Work",
    description: "Work calendar",
  },
  {
    color: "#118ab2",
    id: 4,
    name: "Work",
    description: "Work calendar",
  },
  {
    color: "#073b4c",
    id: 5,
    name: "Work",
    description: "Work calendar",
  },
];
// first and last day props
export function AppSidebar({
  firstDay,
  setFirstDay,
  lastDay,
  setLastDay,
  selectedCalendar,
  setSelectedCalendar,
  calendars,
  setCalendars,
  month,
  setMonth,
  events,
}) {
  const [userInfo, setUserInfo] = useState({});
  const [recommendations, setRecommendations] = useState([{}]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  // const [events, setEvents] = useState({});
  const [allEvents, setAllEvents] = useState([]);
  const [hoverDate, setHoverDate] = useState(null);
  const [isDropped, setIsDropped] = useState(false);
  const today = new Date();

  function handleDragEnd(event) {
    console.log("THIS IS EVENT:" + event);
    const { active, over } = event;
    // update active date to over event date
    if (over) {
      console.log(over);
      let newEvents = { ...events };
      if (newEvents[over.data.current.to] == null) {
        newEvents[over.data.current.to] = [active.data.current.event];
      } else {
        newEvents[over.data.current.to] = [
          ...newEvents[over.data.current.to],
          active.data.event,
        ];
      }
      console.log(
        newEvents[active.data.current.from],
        active.data.current.event
      );
      newEvents[active.data.current.from] = newEvents[
        active.data.current.from
      ].filter((event) => event.id !== active.data.current.event.id);
      setEvents(newEvents);
    }
    // if (event.over && event.over.id === "droppable") {
    //   setIsDropped(true);
    // }
  }

  const getCurrentPosition = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position: any) => resolve(position),
        (error: any) => reject(error)
      );
    });
  };

  const handleRecommend = async () => {
    try {
      const position = await getCurrentPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      const data = await updateRecommendations({
        latitude: latitude,
        longitude: longitude,
        calendar_id: selectedCalendar.calendar_id,
        // should not hard code location
      });
      console.log("GOTTEEE" + JSON.stringify(data));
      getRecommendations(selectedCalendar.calendar_id).then((data) => {
        console.log(data.events);
        setRecommendations(data.events);
      });
    } catch (error) {
      console.error("Failed to fetch new recommendations:", error);
    }
  };

  useEffect(() => {
    let fDay = new Date(month.getFullYear(), month.getMonth(), 1);
    let lDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    setFirstDay(fDay);
    setLastDay(lDay);
  }, [month]);

  useEffect(() => {
    getProfile().then((data) => {
      setUserInfo(data);
    });
  }, []);

  useEffect(() => {
    if (!selectedCalendar) return;
    getRecommendations(selectedCalendar.calendar_id).then((data) => {
      setRecommendations(data.events);
    });
  }, [selectedCalendar]);

  return (
    <Sidebar>
      <SidebarHeader className="mb-0">
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-md outline-none hover:bg-gray-100 focus:bg-gray-100 p-2 dark:hover:bg-stone-800 dark:focus:bg-stone-800">
            {selectedCalendar && (
              <div className="flex gap-2 items-center">
                <div
                  className="flex justify-center items-center w-10 h-10 rounded-lg"
                  style={{ backgroundColor: selectedCalendar.color }}
                >
                  <CalendarIcon size={16} />
                </div>
                <div className="flex flex-col justify-start items-start grow">
                  <p className="text-sm font-semibold">
                    {selectedCalendar.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedCalendar.description}
                  </p>
                </div>
                <div>
                  <ArrowUpDown size={16} />
                </div>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full"
            sideOffset={4}
            align="start"
            side="right"
          >
            <DropdownMenuLabel>Calendars</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {calendars.length > 0 &&
              calendars.map((calendar) => (
                <DropdownMenuItem
                  key={calendar.id}
                  onClick={() => setSelectedCalendar(calendar)}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-stone-800"
                >
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded-md"
                      style={{ backgroundColor: calendar.color }}
                    />
                    <div className="flex flex-col justify-start items-start">
                      <p className="text-sm font-semibold">{calendar.title}</p>
                      <p className="text-xs text-gray-500">
                        {calendar.description}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-stone-800"
              onSelect={(e) => e.preventDefault()}
            >
              <Dialog>
                <DialogTrigger className="flex items-center gap-2">
                  <div
                    className="flex justify-center items-center w-8 h-8 rounded-md"
                    style={{ backgroundColor: "#118ab2" }}
                  >
                    <PlusIcon size={16} />
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-sm font-semibold">Add Calendar</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a Calendar</DialogTitle>
                    <AddCalendarForm 
                      calendars={calendars}
                      setCalendars={setCalendars}
                    />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent className="py-0">
        <SidebarGroup className="py-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={month}
            onMonthChange={setMonth}
            className="rounded-md border"
          />
          <SidebarGroupLabel className="flex justify-between items-center">
            Recommendations
            <button onClick={handleRecommend} style={{ marginLeft: "10px" }}>
              <RefreshCcw size={12} />
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            {/* <SidebarMenu> */}
            {recommendations &&
              recommendations.map((item) => (
                <Card className="flex flex-col gap-1 w-full">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {item.name}

                      {/* <Button
                        size="sm"
                        onClick={() => {
                          console.log("clicked");
                        }}
                      >
                        <PlusIcon size={12} />
                      </Button> */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <PlusIcon size={12} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add an event</DialogTitle>
                            <AddEventForm
                              calendar={selectedCalendar}
                              date={new Date(item.date)}
                              events={allEvents}
                              setEvents={setAllEvents}
                              // convert "date": "20 Jan 2025 to Date object
                              defaultValues={{
                                title: item.name,
                                location: item.location,
                                date: new Date(item.date),
                              }}
                            />
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </CardTitle>
                    {item.novel_reason && (
                      <CardDescription>{item.location}</CardDescription>
                    )}
                    <p className="text-sm">{item.date}</p>
                  </CardHeader>
                </Card>
              ))}
            {/* </SidebarMenu> */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          {/* <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div>
                <Settings />
                <span>Settings</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
          <SidebarMenuItem>
            <div className="flex gap-2 items-center p-2">
              <Avatar className="rounded-md">
                <AvatarImage
                  src={userInfo.picture}
                  alt={userInfo.first_name}
                  className="rounded-md"
                />
                <AvatarFallback className="rounded-md bg-[#118ab2] text-white">
                  CN
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-start items-start grow">
                <p className="text-sm font-semibold">
                  {userInfo.first_name} {userInfo.last_name}
                </p>
                <p className="text-xs text-gray-500">{userInfo.email}</p>
              </div>
              <div>
                <ModeToggle />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
