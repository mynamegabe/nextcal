"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { title } from "process";
import { createEvent } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputSuffix } from "./ui/input-suffix";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import Autocomplete from "react-google-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "@/lib/config";
import { toast } from "sonner";

// class CalendarEvent(SQLModel, table=True):
//     id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
//     title: str
//     category: str | None = Field(default=None)
//     location: str | None = Field(default=None)
//     frequency: str | None = Field(default=None)
//     start_time: int
//     end_time: int
//     calendar_id: str = Field(foreign_key="Calendar.calendar_id")

const formSchema = z.object({
  title: z.string(),
  category: z.string().optional(),
  location: z.string().optional(),
  frequency: z.string().optional(),
  start_time: z.coerce.number(),
  end_time: z.coerce.number(),
  calendar_id: z.string().optional(),
});

export function AddEventForm({ calendar, date, events, setEvents, onSuccess, defaultValues={}, view=false }) {
  const [startTime, setStartTime] = useState("AM");
  const [endTime, setEndTime] = useState("AM");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      frequency: "One-time",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      values.calendar_id = calendar.calendar_id;
      // convert to unix with Date + 12 if pm
      values.start_time = date.setHours(values.start_time + (startTime === "PM" ? 12 : 0));
      values.end_time = date.setHours(values.end_time + (endTime === "PM" ? 12 : 0));
    
      // const newEvent = await createEvent({
      //   ...values,
      //   calendar_id: calendar.calendar_id,
      // });

      const res = await createEvent(values);
      const newEvent = res.event;

      
      // Update state immediately
      setEvents([...events, newEvent]); 
      
      // Reset form 
      form.reset();
      
      // Close dialog
      onSuccess?.();

      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive", 
        title: "Error",
        description: "Failed to create event",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Pool with Emily" {...field} />
              </FormControl>
              <FormDescription>Enter a title for your event.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Meeting" {...field} />
              </FormControl>
              <FormDescription>
                Enter a category for your event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                {/* <Input placeholder="Starbucks" {...field} /> */}
                <Autocomplete
                  apiKey={GOOGLE_MAPS_API_KEY}
                  options={{
                    types: [
                      "bowling_alley",
                      "cafe",
                      "restaurant",
                      "shopping_mall",
                      "park",
                    ],
                  }}
                  onPlaceSelected={(place) => {
                    field.onChange(place.formatted_address);
                    console.log(place);
                  }}
                  value={field.value}
                  className="w-full p-2 border rounded dark:bg-stone-950"
                />
              </FormControl>
              <FormDescription>
                Enter a location for your event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              {/* <Input placeholder="Weekly" {...field} /> */}
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="One-time">One-time</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Enter a frequency for your event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <InputSuffix
                    placeholder="12"
                    min="1"
                    max="12"
                    type="number"
                    suffix={
                      <Select defaultValue="AM" onValueChange={setStartTime}>
                        <SelectTrigger className="w-1/2 rounded-none rounded-r-md">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    }
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter a start time for your event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <p>-</p>

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <InputSuffix
                    placeholder="12"
                    min="1"
                    max="12"
                    type="number"
                    suffix={
                      <Select defaultValue="AM" onValueChange={setEndTime}>
                        <SelectTrigger className="w-1/2 rounded-none rounded-r-md">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    }
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter an end time for your event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogClose asChild>
          { view ? null : <Button type="submit">Submit</Button> }
        </DialogClose>
      </form>
    </Form>
  );
}
