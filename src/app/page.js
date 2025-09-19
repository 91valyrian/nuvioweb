import HeroSwiper from "@/components/HeroSwiper";
import CardList from "@/components/CardList";
import { getAllWorks } from "@/lib/works";

export default async function Home() {
  const works = getAllWorks();
  return (
    <main>
      <HeroSwiper />

      <section id="work" className="section-work py-[80px]">
        <div className="container">
          <h2 className="section-title font-miller italic text-[80px] xl:text-[100px]"  data-reveal="fade-up" data-reveal-delay="0.2">Our Works</h2>
          <h3 className="section-subtitle" data-reveal="fade-up" data-reveal-delay="0.4">우리가 만들어온 변화와 성장을 확인하세요.</h3>
          <CardList items={works} cols="cols-2" gap="gap-lg" className="mt-[30px] md:mt-[50px]" />
        </div>
      </section>
    </main>
  );
}
