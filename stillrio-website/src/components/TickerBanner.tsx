export default function TickerBanner({
  text = "Stay tuned — updates coming soon",
}: {
  text?: string;
}) {
  const repeated = `${text}   •   `.repeat(8);
  return (
    <div className="overflow-hidden border-b border-slate-300/60 bg-[#5A5D5A] py-2.5 text-sm font-bold tracking-wide text-white">
      <div className="flex animate-ticker whitespace-nowrap">
        <span className="px-8">{repeated}</span>
        <span className="px-8" aria-hidden>
          {repeated}
        </span>
      </div>
    </div>
  );
}
