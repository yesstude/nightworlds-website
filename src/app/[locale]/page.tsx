import { NextPage } from "next";
import { getMessages } from "next-intl/server";
import Home from "./home";
import { isAuthorized } from "../../server/api/auth";
import { redirect } from "next/navigation";

const HomeWrapper: NextPage = async () => {
  if (await isAuthorized()) return redirect("/dashboard");

  const messages = (await getMessages()).landing;
  type Message = { [key: string]: string | Message };
  function getChildren(obj: Message, prefix?: string) {
    let result: any = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key]!;
      if (typeof val == "string") result[(prefix || "") + key] = val;
      else
        Object.entries(getChildren(val, (prefix || "") + `${key}.`)).forEach(
          ([k, v]) => (result[k] = v)
        );
    }
    return result;
  }
  const t = getChildren(messages as any);
  return <Home translations={t as any} />;
};

export default HomeWrapper;
