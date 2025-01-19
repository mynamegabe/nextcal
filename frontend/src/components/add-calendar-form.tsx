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
import { createCalendar } from "@/lib/api";
import { DialogClose } from "./ui/dialog";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  color: z.string(),
});

export function AddCalendarForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: "#06d6a0",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let res = await createCalendar(values);
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
                <Input placeholder="Work" {...field} />
              </FormControl>
              <FormDescription>
                Enter a title for your calendar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Work calendar" {...field} />
              </FormControl>
              <FormDescription>
                Enter a description for your calendar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input {...field} type="color" defaultValue="#06d6a0" />
              </FormControl>
              <FormDescription>
                Enter a color for your calendar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogClose asChild>
          <Button type="submit">Submit</Button>
        </DialogClose>
      </form>
    </Form>
  );
}
