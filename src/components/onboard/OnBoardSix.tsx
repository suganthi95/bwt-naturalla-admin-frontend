import { Button } from '../ui/button'
import { Check, LoaderCircle, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../ui/command';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addBusiness, getBusinessDetails, getBusinessSuggestions, setActiveBusiness, setUserOnboardStatus } from '@/lib/apis';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ASSETS } from '@/assets/assets';
import Loader from '../ui/Loader';
import { useNavigate } from 'react-router-dom';

function OnBoardSix() {

    const { auth } = useAppContext();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [ input, setInput ] = useState("");
    const [value, setValue] = useState("");
    const [ valueError, setValueError ] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<{ latitude: number | null, longitude: number | null }>({
        latitude: null,
        longitude: null
    });

    const messages = [
        <p className='text-slate-500 text-center'><span className='text-primary'>Tip: </span>Personalize your review responses to show customers you really care.</p>,
        <p className='text-slate-500 text-center'><span className='text-primary'>Pro Tip: </span>Use our sentiment analysis to pinpoint areas where you can improve your service.</p>,
        <p className='text-slate-500 text-center'><span className='text-primary'>Quick Tip: </span>Consistency is key—maintain the same tone across all your responses.</p>,
        <p className='text-slate-500 text-center'><span className='text-primary'>Tip: </span>Leverage positive reviews in your marketing materials to build trust.</p>,
        <p className='text-slate-500 text-center'><span className='text-primary'>Pro Tip: </span>Use sentiment analysis to identify areas of improvement in your customer service.</p>,
        <p className='text-slate-500 text-center'><span className='text-primary'>Quick Tip: </span>Make it a habit to respond to all reviews, whether positive or negative. Consistent engagement shows that you value customer feedback.</p>,
        <p className='text-slate-500 text-center'>Did you know? AI-generated responses can save you up to 70% of the time you’d spend crafting responses.</p>,
        <p className='text-slate-500 text-center'><span className='text-primary'>Pro Tip: </span>Don’t shy away from negative feedback. Addressing it publicly can show potential customers that you’re committed to improving.</p>,
    ];
      
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    // set user as onboarded
    const { mutate: setUserOnboardMutate, isPending: isOnboardStatusPending } = useMutation({
        mutationKey: [ "setUserOnboardStatus" ],
        mutationFn: setUserOnboardStatus,
        onSuccess: () => {
            toast.success("Request Success", { description: "Business Added Successfully" });
            navigate("/");
            window.location.reload();
        },
        onError: (error: AxiosError<any>) => {
            toast.error("Request Failed", { description: error?.response?.data?.message })
        }
    })

    // set active business

    const { mutate: setActiveBusinessMutate, isPending: setActiveBusinessPending } = useMutation({
        mutationKey: [ "setActiveBusiness" ],
        mutationFn: setActiveBusiness,
        onSuccess: async () => {
            setUserOnboardMutate({ token: auth?.token as string })
        },
        onError: (error: AxiosError<any>) => {
            toast.error("Request Failed", { description: error?.response?.data?.message })
        }
    });

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
            setActiveBusinessMutate({
                place_id: value,
                token: auth?.token as string
            })

            setValue("");
        },
        onError: () => {
            toast.error("Request Failed", { description: "Please try after sometimes" })
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
                city: res?.data?.data?.result?.address_components[3]?.long_name ? res?.data?.data?.result?.address_components[3]?.long_name: "",
                zipCode: res?.data?.data?.result?.address_components?.at(-1)?.long_name ? res?.data?.data?.result?.address_components?.at(-1)?.long_name : "",
                email: auth?.data?.email,
                token: auth?.token
            });
        },
        onError: (error) => {
            toast.error("Request Failed", { description: error.message })
        }
    });


    const getDetailedBusiness = () => {

        if(value === ""){
            return setValueError("Select one business");
        }

        mutate({
            placeId: value,
            token: auth?.token as string
        })
    }

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

    let loader = null;

    if(addBusinessPending || setActiveBusinessPending || isOnboardStatusPending){
        loader = (
            <div className="h-screen flex items-center justify-center flex-col gap-3 w-full fixed top-0 left-0 bg-white">
                <div className="hidden lg:flex flex-row items-center gap-1">
                    <img className="h-8 w-8" src={ASSETS.LOGO} alt="logo" />
                    <p className="font-bold text-3xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                </div>
                <div>
                    <Loader/>
                </div>
                {messages[currentMessageIndex]}
            </div>
        )
    }

    useEffect(() => {
        if(input === ""){
            setValue("");
        }
    }, [input])

    return (
        <>
        <div className="mt-10">
            <h1 className="text-2xl lg:text-5xl font-medium">Add your business</h1>
            <p className='pb-3 text-slate-500'>Please add one business</p>
            <div>
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
                                className="w-[360px] md:w-[400px] h-12 dark:bg-white hover:dark:bg-slate-50/90 hover:dark:text-black dark:border-slate-200 justify-start gap-5"
                            >
                                <Search className="w-5 stroke-slate-400" />
                                {value
                                    ? <span className="text-ellipsis overflow-hidden">{data?.find((item: any) => item.value === value)?.label}</span>
                                    : "Search Business..."}
                                {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 hidden lg:block" /> */}
                            </Button>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0 dark:border-none dark:bg-white">
                        <Command className='dark:border-none dark:bg-white'>
                        <Card className="flex flex-row items-center gap-2 px-2 py-1 h-fit border-none border-b-1 dark:bg-white">
                            <Search className="w-5 stroke-slate-400" />
                            <Input 
                                placeholder="Search Business..." 
                                className="border-none outline-none focus-visible:ring-transparent dark:bg-white dark:border-slate-200 dark:text-black dark:ring-offset-none dark:placeholder:text-slate-400 dark:focus-visible:ring-none"
                                value={input}
                                onChange={(val) => {
                                    setValueError(null);
                                    setInput(val.target.value)
                                }}
                            />
                        </Card>
                        <CommandList className='dark:bg-white dark:text-black'>
                            <CommandEmpty>{isLoading ? <LoaderCircle className="h-5 w-5 animate-spin mx-auto" /> : "No business found"}</CommandEmpty>
                            <CommandGroup>
                            {data?.map((item: any) => (
                                <CommandItem
                                className='dark:bg-white dark:text-black'
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

                <p className="text-xs mt-1 font-medium text-red-500">{valueError}</p>
            </div>

            <Button disabled={getBusinessDetailsPending || addBusinessPending || setActiveBusinessPending} 
                onClick={getDetailedBusiness} className="mt-5 bg-primary hover:bg-primary/50 dark:bg-primary dark:text-slate-50 hover:dark:bg-primary/50">
                {getBusinessDetailsPending || addBusinessPending || setActiveBusinessPending ? 
                    <LoaderCircle className="h-5 w-5 animate-spin mx-auto" /> : 
                    "Add Business"
                }
            </Button>
        </div>
        {loader}
        </>
    )
}

export default OnBoardSix