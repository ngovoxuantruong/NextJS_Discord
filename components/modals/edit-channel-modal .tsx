"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import axios from "axios";
import qs from "query-string";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/hooks/use-modal-store";
import { useEffect } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Must be between 1 and 100 in length. Channel name cannot be ''." }),
});

type formSchemaValidator = z.infer<typeof formSchema>;

export const EditChannelModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "editChannel";
  const router = useRouter();
  const { server, channel } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
    }
  }, [form, channel]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: formSchemaValidator) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      await axios.patch(url, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[440px] bg-white dark:bg-[#313338] dark:text-[#F2F3F5] text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Channel Name</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-[#B5BAC1]">
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 dark:bg-[#1E1F22] border-0 focus-visible:ring-0 text-black dark:text-[#DBDEE1] focus-visible:ring-offset-0"
                        placeholder="Edit your channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 dark:bg-dark-bg-secondary px-6 py-4">
              <Button type="submit" disabled={isLoading} variant={"primary"}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
