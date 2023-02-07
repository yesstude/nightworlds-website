import { SxProps, Theme, Typography, TypographyVariant } from "@mui/material";
import { useEffect, useId, useState } from "react";

export default function AppearingText(props: {
    tokens: { [x: string]: number },
    variant: TypographyVariant,
    sx?: SxProps<Theme>,
    speed?: number,
    noAutoSpace?: boolean,
    stopAnimation?: boolean,
    whenFinished?: () => void,
}) {
    const prefix = useId();
    const [timeAlive, setTimeAlive] = useState(0);
    const lastToken = Object.values(props.tokens).sort((a, b) => a - b).reverse()[0] as number;

    useEffect(() => {
        let whenFinishedCalled = false;
        setInterval(() => {
            if (props.stopAnimation) return;
            setTimeAlive(last => {
                if (props.whenFinished && !whenFinishedCalled && last > lastToken) {
                    whenFinishedCalled = true;
                    props.whenFinished();
                }
                return last + (props.speed || 1);
            });
        }, 50);
    }, []);

    return (
        <Typography sx={props.sx} variant={props.variant}>
            {Object.entries(props.tokens).map(([token, time], i, array) => {
                const id = prefix + "_" + i;
                return (
                    <>
                        <span
                            id={id}
                            key={id}
                            style={{
                                "display": "inline-block",
                                "opacity": timeAlive >= time ? "100%" : "0%",
                                "translate": timeAlive >= time ? "0 0px" : "0 64px",
                                "transition": "all 700ms"
                            }}
                        >
                            {token}
                        </span>
                        {props.noAutoSpace ? "" : <span> </span>}
                    </>
                );
            })}
        </Typography>
    );
}