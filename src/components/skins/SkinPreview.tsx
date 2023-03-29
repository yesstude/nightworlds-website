import { MutableRefObject, StyleHTMLAttributes, useEffect, useRef, useState } from "react";
import { SkinViewer } from "skinview3d";

export default function SkinPreview(props: {
    url: string,
    fov?: number,
    style?: StyleHTMLAttributes<HTMLCanvasElement>
}) {
    const ref = useRef<any>();
    const sv: MutableRefObject<SkinViewer> = useRef<any>();

    useEffect(() => {
        sv.current = new SkinViewer({
            canvas: ref.current,
            skin: props.url,
            width: 300,
            height: 400,
            fov: props.fov
        });
    }, []);

    useEffect(() => {
        sv.current.loadSkin(props.url);
    }, [props.url]);

    return <canvas ref={ref} style={props.style} />;
}