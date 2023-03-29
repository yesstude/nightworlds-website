import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { SkinViewer, IdleAnimation } from "skinview3d";

import steve from "../assets/skins/steve.png";
import SkinPreview from "../components/skins/SkinPreview";
import { api } from "../utils/api";

const SkinGeneratorPage: NextPage = () => {
    const [skinUrl, setSkinUrl] = useState(steve.src);

    const [skin, setSkin] = useState("");
    const [clothes, setClothes] = useState("");

    api.skin.generate.useQuery({
        skin,
        clothes: clothes.split("\n")
    }, {
        onSuccess: setSkinUrl
    });

    return (
        <>
            <SkinPreview url={skinUrl} fov={10} />
            <input
                onInput={e => setSkin((e.target as any).value)}
                style={{
                    width: "500px",
                    display: "block"
                }}
            />
            <textarea
                onInput={e => setClothes((e.target as any).value)}
                style={{
                    width: "500px",
                    height: "140px",
                    display: "block"
                }}
            />
        </>
    );
}

export default SkinGeneratorPage;