import CardList from "@/components/CardList";
import SubVisual from "@/components/SubVisual";
import { getAllWorks } from "@/lib/works";

export const revalidate = 60; // ISR도 가능(파일 변경 후 재빌드 권장)

export default function WorkList() {
  const works = getAllWorks().sort(
    (a, b) => new Date(b.inputDate) - new Date(a.inputDate)
  );

  return (
    <main>
      <SubVisual value="Work" image="/images/work/visual.png" />
      <section>
        <div className="container">
          <CardList
            items={[...works].sort(
              (a, b) => new Date(b.inputDate) - new Date(a.inputDate)
            )}
            initialCount={6}
            loadMode="button"
            moreLabel="LOAD MORE"
            moreHoverLabel="+"
            step={3}
            cols="cols-3"
            gap="gap-lg"
            className="mt-[30px] md:mt-[50px]"
          />
        </div>
      </section>
    </main>
  );
}
