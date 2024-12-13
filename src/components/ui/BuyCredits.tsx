import { Button } from "./button"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { LoaderCircle, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Badge } from "./badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ValidateUserType } from "@/types";
import { buyCredits, getCreditsList, PAYMENT_KEY, verifyCreditCheckout } from "@/lib/apis";
import { useAppContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./alert-dialog";


function BuyCredits() {

    const { auth } = useAppContext();
    const [ Razorpay ] = useRazorpay();
    const [ openCreditPopover, setOpenCreditPopover ] = useState(false);
    const [ openRefillDialog, setOpenRefillDialog ] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ geoLocation, setGeoLocation ] = useState<{ latitude: null | number, longitude: null | number }>({ latitude: null, longitude: null });

    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData<AxiosResponse<{ data: ValidateUserType, message: string }>>([ "validateUser" ]);
    const { remaining_credits } = queryData?.data?.data as ValidateUserType;

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setGeoLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
            },
            (error) => {
                console.error('Error enabling geolocation:', error);
            }
        );
    }, [])

    const handleModal = () => {
        if ('permissions' in navigator) {
            navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
                if (result.state === 'denied' || result.state === 'prompt') {
                    setIsModalOpen(true);
                }else{
                    setOpenRefillDialog(true)
                }
            });
        } else {
            // Default to showing modal if permissions API isn't available
            setIsModalOpen(true);
        }
    }

    // get credits plan
    const { data } = useQuery({
        queryKey: [ "getCreditsList" ],
        queryFn: () => getCreditsList({ 
            token: auth?.token as string,
            latitude: geoLocation.latitude,
            longitude: geoLocation.longitude
        }),
        retry: 1,
        refetchOnWindowFocus: false,
        select: (data) => data?.data,
        enabled: openRefillDialog
    })

    const [ purchaseCreditCountId, setPurchaseCreditCountId ] = useState<number | null>(null);

    useEffect(() => {
        if(data){
            setPurchaseCreditCountId(data[0].item_id)
        }
    }, [ data ])

    // buy credits mutation

    const { mutate: verifyCreditCheckoutMutate } = useMutation({
        mutationKey: [ "verifyCreditCheckout" ],
        mutationFn: verifyCreditCheckout,
        onSuccess: (data) => {
            console.log(data)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const { mutate, isPending } = useMutation({
        mutationKey: [ "buyCredits" ],
        mutationFn: buyCredits,
        onSuccess: (data) => {
            setOpenRefillDialog(false);
            const { order_id, order_amount, currency } = data?.data;

            const options = {
                key: PAYMENT_KEY,
                order_id: order_id,
                amount: order_amount,
                currency: currency,
                name: 'IntelliResponse',
                description: 'Credits Plan',
                image: 'https://ik.imagekit.io/zshycew5c/intelliresponse/intelli-response-logo.svg?updatedAt=1719985223239', // Your logo
                handler: function (response: any) {

                    verifyCreditCheckoutMutate({
                        token: auth?.token as string,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature, 
                        razorpay_order_id: order_id
                    })
                },
                theme: {
                    color: 'orange',
                },
            };

            const rzp = new Razorpay(options as RazorpayOptions);
            rzp.open();
        },
        onError: (error: AxiosError<any>) => {
            console.log(error)
            toast.error("Request Failed", { description: error?.response?.data?.message })
        }
    });

    const initiatePayment = () => {

        const country = data[0].country;

        mutate({
            itemId: purchaseCreditCountId as number,
            token: auth?.token as string,
            country
        })
    }
    
  return (
    <>
    <Popover open={openCreditPopover} onOpenChange={setOpenCreditPopover}>
        <PopoverTrigger asChild>
            <button className="flex w-40 md:w-auto text-xs p-2  md:text-base items-center gap-2 bg-gradient-to-r from-primary/50 to-primary text-white py-1 md:px-2 rounded-lg">
                <Zap className="h-5 w-5 fill-white stroke-none" />
                <span className="text-xs"> Buy Instant Credits</span>
            </button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px]">
            <div className="flex flex-row items-center gap-5">
                <div className="text-primary border-[2px] border-primary rounded-full p-2">
                    {remaining_credits}
                </div>

                <div>
                    <h1 className="text-md font-bold">Remaining Instant Credits</h1>
                    <p className="text-sm text-slate-400">Used to find best response for your customer's reviews</p>
                </div>

                <div>
                    <Button onClick={handleModal} variant="secondary">Refill Now</Button>
                </div>
            </div>
        </PopoverContent>
    </Popover>
    <Dialog open={openRefillDialog} onOpenChange={setOpenRefillDialog}>
        <DialogContent className="sm:max-w-[525px] p-0">
        <DialogHeader className="p-3">
            <DialogTitle>
                <div className="flex flex-row items-center gap-2">
                    <div className="bg-primary/15 p-1 rounded-lg">
                        <Zap className="h-5 w-5 fill-primary stroke-none" />
                    </div>

                    <div>
                        <h1>Refill Your Credits</h1>
                    </div>
                </div>
            </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
            <div className="border-[10px] mt-3 border-primary text-center rounded-full flex flex-col items-center justify-center h-56 w-56 mx-auto">
                <h1 className="text-7xl font-bold">{remaining_credits}</h1>
                <h1 className="text-slate-500">REMAINING CREDITS</h1>
            </div>

            <div className="bg-[#FBFBFB] p-4 space-y-2 border">
                <h1 className="font-bold">Refill Your Credits Balance</h1>
                <p className="text-sm text-slate-500">If you don't use all them, your extra credits will roll over to the next month to let you enrich more credits.</p>
                {/* <div className="flex flex-row items-center justify-between mt-2">
                    <Badge onClick={() => setPurchaseCreditCount([99])} className="bg-white cursor-pointer" variant="outline">99</Badge>
                    <Badge onClick={() => setPurchaseCreditCount([199])} className="bg-white cursor-pointer" variant="outline">199</Badge>
                    <Badge onClick={() => setPurchaseCreditCount([299])} className="bg-white cursor-pointer" variant="outline">299</Badge>
                </div> */}

                <div>
                    {data?.map((item: any) => (
                        <div className="flex flex-row items-center justify-between space-y-3" key={item?.item_id}>
                            <Badge onClick={() => setPurchaseCreditCountId(item?.item_id)} className={`bg-white cursor-pointer px-4 py-1 ${item?.item_id === purchaseCreditCountId && "bg-primary text-white"}`} variant="outline">{item.total_credits}</Badge>
                            <p className="text-sm text-slate-600 font-medium">{item.currency_symbol} {item.credits_amount.toFixed(0)}</p>
                        </div>
                    ))}
                </div>
                {/* <div>
                    <Slider className="mt-5 cursor-pointer" value={purchaseCreditCount} onValueChange={(val) => setPurchaseCreditCount(val)} min={1} max={299} step={1} />
                </div> */}

                {/* <div className="flex flex-row items-center justify-between text-md text-slate-500 text-sm">
                    <p>1</p>
                    <p>299</p>
                </div> */}
            </div>

        </div>
        <DialogFooter className="p-3">
            <Button onClick={initiatePayment} className="bg-primary hover:bg-primary/50 w-[200px]" type="submit">
                {isPending ? <LoaderCircle className="h-5 w-5 animate-spin"/> : `Buy ${data?.filter((item: any) => item.item_id === purchaseCreditCountId)[0]?.total_credits } Credits Now`}
            </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
    <AlertDialog open={isModalOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Enable Geolocation</AlertDialogTitle>
            <AlertDialogDescription>
                Your location is required for a better experience. Please enable it in your browser settings.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsModalOpen(false)}>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

export default BuyCredits