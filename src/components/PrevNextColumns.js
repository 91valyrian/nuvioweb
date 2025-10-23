import Link from "next/link";
import Image from "next/image";

function ChevronUp() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-5 md:h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-5 md:h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** props: prev {href,title,thumb} | next {href,title,thumb} */
export default function PrevNextColumns({ prev, next }) {
  if (!prev && !next) return null;

  const Row = ({ item, dir }) => {
    if (!item) return null;
    const Icon = dir === "up" ? ChevronUp : ChevronDown;
    const label = dir === "up" ? "이전 글" : "다음 글";

    return (
      <li className="flex items-center justify-between gap-4 py-4 border-b border-white/10 last:border-0 first:border-b first:border-[#ddd] group">
        <Link
          href={item.href}
          className="w-full flex items-center gap-3 min-w-0 group-hover:text-main"
          aria-label={`${label}: ${item.title}`}
        >
          <span className="shrink-0 text-neutral-400 transition-colors">
            <Icon />
          </span>
          <span className="truncate text-[30px] md:text-[20px] leading-tight transition-colors">
            {item.title}
          </span>
        </Link>

        {/* {item.thumb && (
          <Link
            href={item.href}
            className="shrink-0 block w-[180px] h-[100px] relative overflow-hidden rounded-md border border-white/10 group"
            aria-hidden
            tabIndex={-1}
          >
            <Image
              src={item.thumb}
              alt={item.title}
              fill
              sizes="500px"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          </Link>
        )} */}
      </li>
    );
  };

  return (
    <nav className="mt-[30px]">
      <ul className="rounded-xl border border-white/10 ">
        {prev && <Row item={prev} dir="up" />}
        {next && <Row item={next} dir="down" />}
      </ul>
    </nav>
  );
}
