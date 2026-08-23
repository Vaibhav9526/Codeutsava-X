type SectionHeadingProps = {
    id: string;
    eyebrow: string;
    title: string;
    description?: string;
    align?: "start" | "center";
    titleClassName?: string;
};

export function SectionHeading({
    id,
    eyebrow,
    title,
    description,
    align = "start",
    titleClassName = "",
}: SectionHeadingProps) {
    const alignment =
        align === "center"
            ? "mx-auto items-center text-center"
            : "items-start text-left";

    return (
        <header className={`flex max-w-3xl flex-col ${alignment}`}>
            <p className="flex items-center gap-3 font-mono text-xs font-semibold tracking-[0.24em] text-cyan-200 uppercase">
                <span aria-hidden="true" className="h-px w-8 bg-cyan-300" />
                {eyebrow}
                <span aria-hidden="true" className="size-1 bg-pink-300" />
            </p>
            <h2
                id={id}
                className={`mt-5 text-3xl leading-none font-black tracking-[-0.04em] text-balance text-white uppercase sm:text-5xl lg:text-6xl ${titleClassName}`}
            >
                {title}
            </h2>
            {description ? (
                <p className="mt-6 max-w-2xl text-base leading-7 text-pretty text-zinc-300 sm:text-lg sm:leading-8">
                    {description}
                </p>
            ) : null}
        </header>
    );
}
