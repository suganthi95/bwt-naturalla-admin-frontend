import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import "dayjs/locale/en";
import "dayjs/locale/ar";
import "dayjs/locale/fr";

dayjs.extend(relativeTime);

export const setDayjsLocale = (lang: string) => {
  dayjs.locale(lang || "en");
};

export default dayjs;
