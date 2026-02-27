export default function TickerBanner({
  text = "short content coming out march 2nd stay tuned",
}: {
  text?: string;
}) {
  const repeated = `${text}   •   `.repeat(8);
  return (
    <div className="overflow-hidden border-b border-slate-700 bg-slate-800 py-2.5 text-sm font-bold tracking-wide text-white">
      <div className="flex animate-ticker whitespace-nowrap">
        <span className="px-8">{repeated}</span>
        <span className="px-8" aria-hidden>
          {repeated}
        </span>
      </div>
    </div>
  );
}
