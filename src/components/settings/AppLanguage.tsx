import { useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner';

function AppLanguage() {

    const [ language, setLanguage ] = useState("en");

    const handleChange = (val: string) => {
        setLanguage(val);

        if(val === "ar"){
            toast.warning("Coming Soon", { description: "The Arabic language is coming soon" })
        }
    }

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
            <p className="font-medium">
                App Language
            </p>
            <p className="text-sm text-slate-400">
                Preferred language settings
            </p>
        </div>
        <div>
            <Select value={language} onValueChange={handleChange}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>App Language</SelectLabel>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    </div>
  )
}

export default AppLanguage