import Image from "next/image";

export default function WorkExtraSection({ groups }) {
  if (!groups.style.length && !groups.icons.length && !groups.admin.length)
    return null;

  return (
    <section className="mb-16">
      <h2 className="mb-6 text-2xl md:text-3xl font-semibold">부가 콘텐츠</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groups.style.map((src, i) => (
          <Image
            key={`style-${i}`}
            src={src}
            alt="스타일 가이드"
            width={1200}
            height={800}
            className="rounded-xl overflow-hidden bg-neutral-50 w-full h-auto"
          />
        ))}
        {groups.icons.map((src, i) => (
          <Image
            key={`icons-${i}`}
            src={src}
            alt="아이콘 세트"
            width={1200}
            height={800}
            className="rounded-xl overflow-hidden bg-neutral-50 w-full h-auto"
          />
        ))}
        {groups.admin.map((src, i) => (
          <Image
            key={`admin-${i}`}
            src={src}
            alt="관리자 페이지"
            width={1200}
            height={800}
            className="rounded-xl overflow-hidden bg-neutral-50 w-full h-auto"
          />
        ))}
      </div>
    </section>
  );
}
