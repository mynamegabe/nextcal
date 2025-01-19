import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { CalendarClock, MenuIcon, Search } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { AddEventForm } from "@/components/add-event-form";
import { getCalendar, getCalendars, getEvents, updateEvent} from "@/lib/api";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

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

function RouteComponent() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [firstDay, setFirstDay] = useState(new Date());
  const [lastDay, setLastDay] = useState(new Date());
  const [calendars, setCalendars] = useState([]);
  const [hoverDate, setHoverDate] = useState(null);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [month, setMonth] = useState(new Date());
  const [events, setEvents] = useState({});
  const [allEvents, setAllEvents] = useState([]);

  const [isDropped, setIsDropped] = useState(false);

  function handleDragEnd(event) {
    console.log(event);
    const { active, over } = event;
    // update active date to over event date
    if (over) {
      console.log(over);
      let newEvents = { ...events };
      if (newEvents[over.data.current.to] == null) {
        newEvents[over.data.current.to] = [active.data.current.event];
      } else {
        newEvents[over.data.current.index] = [
          ...newEvents[over.data.current.index],
          active.data.event,
        ];
      }
      console.log(newEvents[active.data.current.from], active.data.current.event);
      newEvents[active.data.current.from] = newEvents[
        active.data.current.from
      ].filter((event) => event.id !== active.data.current.event.id);
      setEvents(newEvents);
      let old_date = active.data.current.event.date_num;
      let new_date = over.id;
      console.log("EFINOENF: " + event);
      updateEvent({
        id: active.data.current.event.id,
        diff: (old_date - new_date) * 86400000,
      });
    }
    // if (event.over && event.over.id === "droppable") {
    //   setIsDropped(true);
    // }
  }

  const addEventButton = (e, date) => {
    setHoverDate(date);
  };

  useEffect(() => {
    getCalendars().then((data) => {
      setCalendars(data.calendars);
      setSelectedCalendar(data.calendars[0]);
    });
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((searchOpen) => !searchOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    getEvents(selectedCalendar?.calendar_id, firstDay, lastDay).then((data) => {
      setAllEvents(data.events);
    });
  }, [selectedCalendar, firstDay, lastDay]);

  useEffect(() => {
    if (selectedCalendar == null) return;
    let groupedEvents = {};
    getEvents(selectedCalendar?.calendar_id, firstDay, lastDay).then((data) => {
      for (let event of data.events) {
        event.start_time = new Date(event.start_time);
        event.end_time = new Date(event.end_time);
        event.date_num = event.start_time.getDate();
        // if date is in selected month
        if (event.start_time >= firstDay && event.start_time <= lastDay) {
          if (groupedEvents[event.date_num] == null) {
            groupedEvents[event.date_num] = [];
          }
          groupedEvents[event.date_num].push(event);
        }
      }
    });
    setEvents(groupedEvents);
  }, [selectedCalendar, firstDay, lastDay]);

  return (
    <>
      <div className="flex w-screen min-h-screen h-screen overflow-y-auto">
        <AppSidebar
          firstDay={firstDay}
          setFirstDay={setFirstDay}
          lastDay={lastDay}
          setLastDay={setLastDay}
          calendars={calendars}
          selectedCalendar={selectedCalendar}
          setSelectedCalendar={setSelectedCalendar}
          month={month}
          setMonth={setMonth}
          events={events}
        />
        {/* <h1>
        {firstDay.toDateString()} {lastDay.toDateString()}
      </h1> */}
        <div className="grow">
          <NavigationMenu className="flex justify-between w-full max-w-screen p-2 border-b border-stone-200">
            <NavigationMenuList>
              <SidebarTrigger />
            </NavigationMenuList>
            <NavigationMenuList>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="grid grid-cols-7 gap-0">
            <div className="col-span-1 p-4 py-2 border-b border-stone-200 text-stone-500">
              Su
            </div>
            <div className="col-span-1 p-4 py-2 border-b border-stone-200 text-stone-500">
              Mo
            </div>
            <div className="col-span-1 p-4 py-2 border-b border-stone-200 text-stone-500">
              Tu
            </div>
            <div className="col-span-1 p-4 py-2 border-b border-stone-200 text-stone-500">
              We
            </div>
            <div className="col-span-1 p-4 py-2 border-b border-stone-200 text-stone-500">
              Th
            </div>
            <div className="col-span-1 p-4 py-2 border-b border-stone-200 text-stone-500">
              Fr
            </div>
            <div className="col-span-1 p-4 py-2 border-b border-stone-200 text-stone-500">
              Sa
            </div>
          </div>

          <DndContext onDragEnd={handleDragEnd}>
            <div className="w-full h-[calc(100vh-6rem)] grid grid-rows-5 grid-cols-7 gap-0">
              {Array.from({ length: firstDay.getDay() }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 py-2 border text-stone-500 bg-stone-100 dark:bg-stone-900"
                >
                  {""}
                </div>
              ))}

              {Array.from({ length: lastDay.getDate() }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-2 border text-stone-500"
                  onMouseEnter={(e) => {
                    let date = new Date(
                      new Date(firstDay).setDate(firstDay.getDate() + index)
                    );
                    addEventButton(e, date);
                  }}
                  onMouseLeave={(e) => {
                    setHoverDate(null);
                  }}
                >
                  <div>{index + 1}</div>
                  <Droppable id={index + 1} key={index + 1} index={index + 1}>
                    {events[index + 1] &&
                      events[index + 1].map((event) => (
                        // <div
                        //   key={event.event_id}
                        //   className="bg-blue-500 text-left text-xs text-white rounded p-2"
                        // >
                        //   {event.title}
                        // </div>
                        <Draggable
                          id={event.id}
                          index={index + 1}
                          event={event}
                        />
                      ))}
                  </Droppable>
                  {hoverDate != null && hoverDate.getDate() === index + 1 && (
                    <Dialog>
                      <DialogTrigger className="bg-blue-300 text-left text-xs text-white rounded p-2">
                        + Add Event
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add an event</DialogTitle>
                          <AddEventForm
                            calendar={selectedCalendar}
                            date={hoverDate}
                            events={allEvents}
                            setEvents={setAllEvents}
                            
                          />
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              ))}

              {Array.from({ length: 7 - lastDay.getDay() - 1 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="p-4 py-2 border text-stone-500 bg-stone-100 dark:bg-stone-900"
                  >
                    {""}
                  </div>
                )
              )}
            </div>
          </DndContext>
        </div>
        <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {allEvents.map((event) => (
                <CommandItem
                  onMouseDown={() => {
                    setMonth(new Date(event.start_time));
                    setSearchOpen(false);
                  }}
                >
                  <span>{event.title}</span>
                  <CommandShortcut>
                    {new Date(event.start_time).toDateString()}
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    </>
  );
}
