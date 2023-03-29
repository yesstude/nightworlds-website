import Head from "next/head";

export default function DefaultHead(props: {
    ftitle?: string | null,
    title?: string | null,
    description?: string | null
}) {
    let title: string = props.title || "NightWorlds";
    if (props.ftitle) title = `${props.ftitle} — NightWorlds`;

    return (
        <Head>
            <title>{title}</title>
            {
                props.description ?
                    <meta name="description" content={props.description} />
                    : ""
            }
            <link rel="icon" href="/favicon.svg" />
        </Head>
    );
}