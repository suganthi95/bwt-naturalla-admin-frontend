import { useState } from "react"

function useToggle(param?: boolean): [boolean, () => void] {

  const [ toggle, setToggle ] = useState<boolean>(() => {
    if(typeof param === "boolean"){
        return param;
    }
    return false;
  });

  const toggleVisibility = ():void => setToggle(!toggle);

  return [ toggle, toggleVisibility ];
}

export default useToggle