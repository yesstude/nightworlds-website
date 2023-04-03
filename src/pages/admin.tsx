import { useRef, useState } from "react";
import SkinPreview from "../components/skins/SkinPreview";
import { api } from "../utils/api";
import { uploadSkin } from "../utils/uploadFile";

export default function AdminPage() {
  const name = useRef<HTMLInputElement>();
  const email = useRef<HTMLInputElement>();
  const [url, setUrl] = useState("");

  const req = api.characters.create.useQuery(
    {
      email: email.current?.value || "",
      name: name.current?.value || "",
      url,
    },
    { enabled: false }
  );

  return (
    <>
      <input type="text" ref={name as any} placeholder="name" />
      <input type="email" ref={email as any} placeholder="email" />
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={async (e) => {
          const key = await uploadSkin(e.target.files?.[0]!);
          setUrl(key!);
          req.refetch();
        }}
      />
      <p>{"" + req.data}</p>
    </>
  );
}
