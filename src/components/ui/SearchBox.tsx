/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
 
import { Check, LoaderCircle, Search } from "lucide-react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./command"
import { cn } from "@/lib/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addBusiness, getBusinessDetails, getBusinessSuggestions } from "@/lib/apis"
import { Input } from "./input"
import { Card } from "./card"
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from "@/contexts/AuthContext"
import { toast } from "sonner"
 
export function SearchBox() {

  const { auth } = useAppContext();
  const [open, setOpen] = useState(false);
  const [ input, setInput ] = useState("");
  const [value, setValue] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [ "getBusinessSuggestions", input ],
    queryFn: () => getBusinessSuggestions({ input, uuid: uuidv4(), token: auth?.token as string }),
    select: (res) => res?.data?.data?.predictions?.map((item: any) => ({
      label: item.description,
      value: item.place_id
    })),
    gcTime: 0,
    staleTime: 0,
    enabled: Boolean(input),
    refetchOnWindowFocus: false,
    retry:  3
  });

  const { mutate: addBusinessMutation, isPending: addBusinessPending } = useMutation({
    mutationKey: [ "addBusiness" ],
    mutationFn: addBusiness,
    onSuccess: () => {
      window.location.reload();
      toast.success("Request Success", { description: "Business Added Successfully" });
    },
    onError: (error) => {
      toast.success("Request Failed", { description: error.message })
    },
  })

  const { mutate, isPending: getBusinessDetailsPending } = useMutation({
    mutationKey: [ "getBusinessDetails" ],
    mutationFn: getBusinessDetails,
    onSuccess: (res) => {
      addBusinessMutation({
        placeId: value,
        businessName: res?.data?.data?.result?.name,
        streetNumber: res?.data?.data?.result?.address_components[1].long_name,
        street: res?.data?.data?.result?.address_components[2].long_name,
        city: res?.data?.data?.result?.address_components[3].long_name,
        zipCode: res?.data?.data?.result?.address_components.at(-1).long_name,
        email: auth?.data?.email,
        token: auth?.token
      });

      queryClient.invalidateQueries({ queryKey: ['getAllBusiness'] })
      setValue("");
    },
    onError: (error) => {
      toast.success("Request Failed", { description: error.message })
    }
  });


  const getDetailedBusiness = () => {
    mutate({
      placeId: value,
      uuid: uuidv4(),
      token: auth?.token as string
    })
  }
  
 
  return (
    <>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          role="combobox"
          aria-expanded={open}
          aria-label="Search Business"
          className="w-[400px] h-12 dark:text-white justify-start gap-5"
        >
            <Search className="w-5 stroke-slate-400" />
          {value
            ? <span className="text-ellipsis overflow-hidden">{data?.find((item: any) => item.value === value)?.label}</span>
            : "Search Business..."}
          {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 hidden lg:block" /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <Card className="flex flex-row items-center gap-2 px-2 py-1 h-fit border-none border-b-1">
            <Search className="w-5 stroke-slate-400" />
            <Input 
              placeholder="Search Business..." 
              className="border-none outline-none focus-visible:ring-transparent"
              value={input}
              onChange={(val) => setInput(val.target.value)}
            />
          </Card>
          <CommandList>
            <CommandEmpty>{isLoading ? <LoaderCircle className="h-5 w-5 animate-spin mx-auto" /> : "No business found"}</CommandEmpty>
            <CommandGroup>
              {data?.map((item: any) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    {value && 
      <Button 
        onClick={getDetailedBusiness} 
          className="h-12"
        >{getBusinessDetailsPending || addBusinessPending ? 
          <LoaderCircle className="h-5 w-5 animate-spin mx-auto" /> : 
          "Add Business"}
      </Button>
    }
    </>
  )
}