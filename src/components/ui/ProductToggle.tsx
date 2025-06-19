import { useState } from "react"
import { Switch } from "./switch"
import { useMutation } from "@tanstack/react-query";
import { updateProductToggle } from "@/lib/apis";

interface Props {
    state: boolean,
    value: "publish" | "isin_todays_deal" | "best_selling" | "offer_ending_soon",
    productId: number
}


function ProductToggle({ state, value, productId }: Props) {

    const [ toggle, setToggle ] = useState<boolean>(state);

    const { mutate } = useMutation({
        mutationKey: [ "updateProductToggle" ],
        mutationFn: updateProductToggle
    })

    const onToggle = () => {
        
        const data: any = {
            productId: productId
        }
        
        data[value] = !toggle;
        
        mutate(data)
        setToggle(prev => !prev);
    }

  return (
    <div>
        <Switch checked={toggle} onCheckedChange={onToggle}/>
    </div>
  )
}

export default ProductToggle