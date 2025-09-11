import Link from "next/link";
import { getAllWorks } from "@/lib/works";

export const revalidate = 60; // ISR도 가능(파일 변경 후 재빌드 권장)

export default function WorkList() {
  const works = getAllWorks();
  return (
    <main className="container">
      <h1>Work</h1>
      <ul>
        {works.map((w) => (
          <li key={w.slug}>
            <Link href={`/work/${w.slug}`}>
              {w.title} ({w.year}) - {w.client}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}