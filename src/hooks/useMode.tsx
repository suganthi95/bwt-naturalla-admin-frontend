import { useState } from "react"

function useMode(): [ string ] {

  const [ mode ] = useState<string>(() => localStorage.getItem('irDarkMode') === "dark" ? "dark" : "light");

  return [ mode ];
}

export default useMode