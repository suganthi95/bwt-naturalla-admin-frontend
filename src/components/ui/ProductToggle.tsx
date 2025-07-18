import { useState } from "react";
import { Switch } from "./switch";
import { useMutation } from "@tanstack/react-query";
import { updateProductToggle } from "@/lib/apis";
import { useAppContext } from "@/contexts/AuthContext";

interface Props {
  state: boolean;
  value: "publish" | "isin_todays_deal" | "best_selling" | "offer_ending_soon";
  productId: number;
}

function ProductToggle({ state, value, productId }: Props) {
  const { auth } = useAppContext();
  const [toggle, setToggle] = useState<boolean>(state);
  // const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["updateProductToggle"],
    mutationFn: ({ token, data }: { token: string; data: any }) =>
      updateProductToggle(token, data),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["getAllProducts"] });
    },
  });

  const onToggle = () => {
    const data: any = {
      productId: productId,
    };

    data[value] = !toggle;

    mutate({
      token: auth?.token ?? "",
      data,
    });
    setToggle((prev) => !prev);
  };

  return (
    <div>
      <Switch checked={toggle} onCheckedChange={onToggle} />
    </div>
  );
}

export default ProductToggle;
