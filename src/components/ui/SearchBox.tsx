/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
 
import { Check, LoaderCircle, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./command"
import { cn } from "@/lib/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addBusiness, getBusinessDetails, getBusinessSuggestions } from "@/lib/apis"
import { Input } from "./input"
import { Card } from "./card"
import { useAppContext } from "@/contexts/AuthContext"
import { toast } from "sonner"
import Loader from "./Loader"
import { AxiosError } from "axios"
 
export function SearchBox() {

  const { auth } = useAppContext();
  const [open, setOpen] = useState(false);
  const [ input, setInput ] = useState("");
  const [value, setValue] = useState("");
  const queryClient = useQueryClient();
  const [userLocation, setUserLocation] = useState<{ latitude: number | null, longitude: number | null }>({
    latitude: null,
    longitude: null
  });
  const messages = [
    <p className='text-white text-center'><span className='text-primary'>Tip: </span>Personalize your review responses to show customers you really care.</p>,
    <p className='text-white text-center'><span className='text-primary'>Pro Tip: </span>Use our sentiment analysis to pinpoint areas where you can improve your service.</p>,
    <p className='text-white text-center'><span className='text-primary'>Quick Tip: </span>Consistency is key—maintain the same tone across all your responses.</p>,
    <p className='text-white text-center'><span className='text-primary'>Tip: </span>Leverage positive reviews in your marketing materials to build trust.</p>,
    <p className='text-white text-center'><span className='text-primary'>Pro Tip: </span>Use sentiment analysis to identify areas of improvement in your customer service.</p>,
    <p className='text-white text-center'><span className='text-primary'>Quick Tip: </span>Make it a habit to respond to all reviews, whether positive or negative. Consistent engagement shows that you value customer feedback.</p>,
    <p className='text-white text-center'>Did you know? AI-generated responses can save you up to 70% of the time you’d spend crafting responses.</p>,
    <p className='text-white text-center'><span className='text-primary'>Pro Tip: </span>Don’t shy away from negative feedback. Addressing it publicly can show potential customers that you’re committed to improving.</p>,
];
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 15000); // Change every 15 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  const { latitude, longitude } = position.coords;
                  setUserLocation({ latitude, longitude });
              },
              (error) => {
                  console.error('Error getting user location:', error);
              }
          );
      }else {
          console.error('Geolocation is not supported by this browser.');
      }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: [ "getBusinessSuggestions", input ],
    queryFn: () => getBusinessSuggestions({ 
      input, 
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      token: auth?.token as string 
    }),
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
      // window.location.reload();
      queryClient.invalidateQueries({ queryKey: ['getAllBusiness'] })
      toast.success("Request Success", { description: "Business Added Successfully" });
    },
    onError: (error: AxiosError<any>) => {
      
      if(error.response?.status === 410 || error.response?.status === 411){
        return toast.success("Request Success", { description: error.response?.data.message, position: "top-center" });
      }else{
        queryClient.invalidateQueries({ queryKey: ['getAllBusiness'] })
        toast.success("Request Success", { description: "Business Added Successfully" });
      }
      
    },
  })

  const { mutate, isPending: getBusinessDetailsPending } = useMutation({
    mutationKey: [ "getBusinessDetails" ],
    mutationFn: getBusinessDetails,
    onSuccess: (res) => {
      addBusinessMutation({
        placeId: value,
        businessName: res?.data?.data?.result?.name,
        streetNumber: res?.data?.data?.result?.address_components[1]?.long_name ? res?.data?.data?.result?.address_components[1]?.long_name : "",
        street: res?.data?.data?.result?.address_components[2]?.long_name ? res?.data?.data?.result?.address_components[2]?.long_name : "",
        city: res?.data?.data?.result?.address_components[3]?.long_name ? res?.data?.data?.result?.address_components[3]?.long_name : "",
        zipCode: res?.data?.data?.result?.address_components?.at(-1)?.long_name ? res?.data?.data?.result?.address_components?.at(-1)?.long_name : "",
        totalReviews: res?.data?.data?.result?.user_ratings_total,
        email: auth?.data?.email,
        token: auth?.token
      });
      setValue("");
    },
    onError: (error) => {
      toast.error("Request Failed", { description: error.message })
    }
  });


  const getDetailedBusiness = () => {
    mutate({
      placeId: value,
      token: auth?.token as string
    })
  }

  useEffect(() => {
    if(input === ""){
      setValue("");
    }
  }, [input])


  if(addBusinessPending || getBusinessDetailsPending){
      return (
          <div className="h-screen flex items-center justify-center flex-col gap-3 w-full fixed top-0 left-0 z-[50] bg-transparent backdrop-brightness-[0.3]">
              <div>
                  <Loader/>
              </div>
              {messages[currentMessageIndex]}
          </div>
      )
  }
  
 
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-5 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex flex-col">
            <p className="text-orange-400 text-xs my-2 pl-3">E.g. Starbucks, Michigan, USA</p>
            <Button
              variant="outline"
              size={"sm"}
              role="combobox"
              aria-expanded={open}
              aria-label="Search Business"
              className="w-[360px] md:w-[400px] h-12 dark:text-white justify-start gap-5"
            >
                <Search className="w-5 stroke-slate-400" />
              {value
                ? <span className="text-ellipsis overflow-hidden">{data?.find((item: any) => item.value === value)?.label}</span>
                : "Search Business..."}
              {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 hidden lg:block" /> */}
            </Button>
          </div>
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
            className="h-12 mt-8"
          >{getBusinessDetailsPending || addBusinessPending ? 
            <LoaderCircle className="h-5 w-5 animate-spin mx-auto" /> : 
            "Add Business"}
        </Button>
      }
    </div>
  )
}