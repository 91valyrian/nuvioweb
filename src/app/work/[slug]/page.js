import { getAllWorks, getWorkBySlug } from "@/lib/works";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const works = getAllWorks();
  return works.map((w) => ({ slug: w.slug }));
}

export default function WorkDetail({ params }) {
  const work = getWorkBySlug(params.slug);
  if (!work) return notFound();

  return (
    <article style={{padding:24}}>
      <h1>{work.title}</h1>
      <p>{work.client} · {work.year}</p>
      {work.cover && <img src={work.cover} alt={work.title} />}
      <p>{work.summary}</p>
      <div>{work.content}</div>
    </article>
  );
}