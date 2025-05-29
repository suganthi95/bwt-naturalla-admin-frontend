import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import i18n from "@/lib/i18next/i18n";
import { useMutation } from "@tanstack/react-query";
import { languageSwitch } from "@/lib/apis";
import { useAppContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Trans } from "react-i18next";

function AppLanguage() {
  const { auth } = useAppContext();
  const [language, setLanguage] = useState("en");
  const { mutate, isPending } = useMutation({
    mutationKey: ["switchlanguage"],
    mutationFn: (args: { token: string; lang: string }) =>
      languageSwitch(args.token, args.lang),
  });
  useEffect(() => {
    const storedLang = localStorage.getItem("lang") ?? "en";
    setLanguage(storedLang);
    i18n.changeLanguage(storedLang);
  }, []);

  const handleChange = (val: string) => {
    setLanguage(val);

    mutate(
      { token: auth?.token ?? "", lang: val },
      {
        onSuccess(data) {
          toast.success(data?.data?.message);

          window.location.reload();
          localStorage.setItem("lang", data?.data?.language);

        },
        onError(error) {
          if (axios.isAxiosError(error)) {
            toast.error(error?.response?.data);
          }
        },
      }
    );

     if (language === "ar") {
      i18n.changeLanguage("ar");
      document.body.setAttribute("dir", "rtl");
    } else {
      i18n.changeLanguage("en");
      document.body.removeAttribute("dir");
    }
  };

  // const navigate = useNavigate();
  // const { i18n } = useTranslation();
  // const [selectedKeys, setSelectedKeys] = useState(new Set([ i18n.language ]));

  // const selectedValue = useMemo(
  //     () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
  //     [selectedKeys]
  // );

  // useEffect(() => {

  //     if(i18n.language === "en"){
  //         setSelectedKeys(new Set([ "English" ]));
  //     }

  //     if(i18n.language === "ar"){
  //         setSelectedKeys(new Set([ "عربي" ]));
  //     }

  // }, [i18n.language])

  // useEffect(() => {

  //     const [ _index, _language, ...restRoutes ] = location.pathname.split('/');

  //     if (selectedValue === "English") {
  //         i18n.changeLanguage("en");
  //         navigate(`/en/${restRoutes}`)
  //         document.body.removeAttribute('dir');
  //     }

  //     if(selectedValue === "عربي"){
  //         Language("ar");
  //         navigate(`/ar/${restRoutes}`)
  //         document.body.setAttribute('dir', 'rtl');
  //     }

  // }, [selectedValue, i18n, navigate])

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4 mt-3">
      <div className="space-y-0.5">
        <p className="font-medium"><Trans i18nKey={'app_language'}/></p>
        <p className="text-sm text-slate-400"><Trans i18nKey={'preferred_language_settings'}/></p>
      </div>
      <div>
        <Select
          value={language}
          defaultValue={language}
          onValueChange={handleChange}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Language" />
            {isPending && (
              <Loader2 className=" text-primary animate-spin " />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel><Trans i18nKey={'app_language'}/></SelectLabel>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default AppLanguage;
