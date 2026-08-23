import Link from "next/link";

import { SectionHeading } from "@/components/ui/section-heading";
import { SectionShell } from "@/components/ui/section-shell";
import { faqs } from "@/data/faq";

export function FaqSection() {
    return (
        <SectionShell
            id="faq"
            className="bg-[radial-gradient(circle_at_90%_75%,rgba(54,241,205,0.02),transparent_28%)]"
        >
            <div className="grid gap-12 lg:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
                <div>
                    <SectionHeading
                        id="faq-title"
                        eyebrow="Decoded"
                        title="Questions, without the static."
                        description="Known details will be updated here as the event takes shape. Every pending answer is labeled plainly."
                        titleClassName="!text-2xl sm:!text-3xl lg:!text-4xl"
                    />
                    <Link
                        href="/faq"
                        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 underline decoration-cyan-300/30 underline-offset-4 transition-colors hover:text-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
                    >
                        Browse the full FAQ
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>

                <div className="divide-y divide-white/10 border-y border-white/10">
                    {faqs.map((faq, index) => (
                        <details key={faq.id} className="group">
                            <summary className="flex cursor-pointer list-none items-start gap-5 py-6 text-left focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
                                <span className="pt-1 font-mono text-[0.65rem] tracking-[0.18em] text-pink-300">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="flex-1 text-base font-semibold text-white sm:text-lg">
                                    {faq.question}
                                </span>
                                <span
                                    aria-hidden="true"
                                    className="grid size-7 shrink-0 place-items-center rounded-full border border-white/15 font-mono text-lg font-light text-cyan-200 transition-transform group-open:rotate-45"
                                >
                                    +
                                </span>
                            </summary>
                            <div className="pr-10 pb-7 pl-[2.6rem] sm:pl-[2.75rem]">
                                <p className="text-sm leading-7 text-zinc-400 sm:text-base">
                                    {faq.answer}
                                </p>
                                {faq.status === "to-be-announced" ? (
                                    <p className="mt-3 font-mono text-[0.6rem] tracking-[0.16em] text-amber-200/70 uppercase">
                                        Answer pending confirmation
                                    </p>
                                ) : null}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </SectionShell>
    );
}
