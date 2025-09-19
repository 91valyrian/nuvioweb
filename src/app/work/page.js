import CardList from "@/components/CardList";
import { getAllWorks } from "@/lib/works";

export const revalidate = 60; // ISR도 가능(파일 변경 후 재빌드 권장)

export default function WorkList() {
  const works = getAllWorks();
  return (
    <main className="container">
      <h1>Work</h1>
      <CardList items={works} cols="cols-2" gap="gap-lg" className="mt-[30px] md:mt-[50px]" />
    </main>
  );
}