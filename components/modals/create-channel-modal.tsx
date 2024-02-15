"use client";

import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import qs from "query-string";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/app/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Hash, Headphones, Volume2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Channel name is required." })
    .refine((name) => name !== "general", { message: "Channel name cannot be 'general" }),
  type: z.nativeEnum(ChannelType),
});

type formSchemaValidator = z.infer<typeof formSchema>;

export const CreateChannelModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const [selectedRadio, setSelectedRadio] = useState("TEXT");
  const isModalOpen = isOpen && type === "createChannel";
  const router = useRouter();
  const params = useParams();
  const { channelType } = data;

  const handleRadioChange = (event: any) => {
    setSelectedRadio(event.target.value);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channelType || ChannelType.TEXT,
    },
  });

  useEffect(() => {
    if (channelType) {
      form.setValue("type", channelType);
      setSelectedRadio(channelType);
    } else {
      form.setValue("type", ChannelType.TEXT);
      setSelectedRadio(ChannelType.TEXT);
    }
  }, [form, channelType]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: formSchemaValidator) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: {
          serverId: params?.serverId,
        },
      });
      await axios.post(url, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[460px] bg-white dark:bg-darkBg dark:text-darkBgText text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-xl text-left font-medium">Create Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              {/* Channel type & radio */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3 ">
                    <FormLabel className="flex-1 uppercase text-xs font-bold text-zinc-500 dark:text-darkLabelText">
                      Channel type
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem
                          className={cn(
                            "flex items-center space-x-3 space-y-0 bg-[#F2F3F5]/80 hover:bg-[#F2F3F5] dark:bg-[#2B2D31] hover:dark:bg-[#4E5058]/30 mb-2 rounded py-2 px-3 cursor-pointer",
                            selectedRadio == ChannelType.TEXT &&
                              "!bg-[#80848E]/20 !dark:bg-[#4E5058]"
                          )}
                        >
                          <FormLabel className="cursor-pointer">
                            <Hash className="text-gray-400" />
                          </FormLabel>
                          <FormLabel className="flex-1 font-medium leading-tight text-gray-500 dark:text-[#DBDEE1] cursor-pointer">
                            Text
                            <FormDescription className="text-xs dark:text-darkLabelText mt-1">
                              Send messages, images, GIFs, emoji, opinions, and puns
                            </FormDescription>
                          </FormLabel>
                          <FormControl>
                            <RadioGroupItem
                              value={ChannelType.TEXT}
                              className="absolute right-10 "
                              onClick={(event) => handleRadioChange(event)}
                            />
                          </FormControl>
                        </FormItem>

                        <FormItem
                          className={cn(
                            "flex items-center space-x-3 space-y-0 bg-[#F2F3F5]/80 hover:bg-[#F2F3F5] dark:bg-[#2B2D31] hover:dark:bg-[#4E5058]/30 mb-2 rounded py-2 px-3 cursor-pointer",
                            selectedRadio == ChannelType.AUDIO &&
                              "!bg-[#80848E]/20 !dark:bg-[#4E5058]"
                          )}
                        >
                          <FormLabel className="cursor-pointer">
                            <Headphones className=" text-gray-400" />
                          </FormLabel>
                          <FormLabel className="flex-1 font-medium leading-tight text-gray-500 dark:text-[#DBDEE1] cursor-pointer">
                            Audio
                            <FormDescription className="text-xs dark:text-darkLabelText mt-1">
                              Hang out together with voice share
                            </FormDescription>
                          </FormLabel>
                          <FormControl>
                            <RadioGroupItem
                              value={ChannelType.AUDIO}
                              className="absolute right-10"
                              onClick={(event) => handleRadioChange(event)}
                            />
                          </FormControl>
                        </FormItem>

                        <FormItem
                          className={cn(
                            "flex items-center space-x-3 space-y-0 bg-[#F2F3F5]/80 hover:bg-[#F2F3F5] dark:bg-[#2B2D31] hover:dark:bg-[#4E5058]/30 mb-2 rounded py-2 px-3 cursor-pointer",
                            selectedRadio == ChannelType.VIDEO &&
                              "!bg-[#80848E]/20 !dark:bg-[#4E5058]"
                          )}
                        >
                          <FormLabel className="cursor-pointer">
                            <Volume2Icon className="text-gray-400" />
                          </FormLabel>
                          <FormLabel className="flex-1 font-medium leading-tight text-gray-500 dark:text-[#DBDEE1] cursor-pointer">
                            Video
                            <FormDescription className="text-xs dark:text-darkLabelText mt-1">
                              Hang out together with video, and screen share
                            </FormDescription>
                          </FormLabel>
                          <FormControl>
                            <RadioGroupItem
                              value={ChannelType.VIDEO}
                              className="absolute right-10"
                              onClick={(event) => handleRadioChange(event)}
                            />
                          </FormControl>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Channel name & input */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-[#DBDEE1]">
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 dark:bg-[#1E1F22] border-0 focus-visible:ring-0 text-black dark:text-[#DBDEE1] focus-visible:ring-offset-0"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 dark:bg-dark-bg-secondary px-6 py-4">
              <Button disabled={isLoading} variant={"primary"}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
