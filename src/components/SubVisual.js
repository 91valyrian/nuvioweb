export default function SubVisual({ value, image }) {
  return (
    <section
      className={`visual h-[758px] pt-[450px] bg-cover bg-center`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="container">
        <p className="text-[52px] leading-[62px] md:text-[49px] md:leading-[59px] font-light rotate-x-up">
          Let’s Talk Ideas,
          <span className="block pl-[150px] rotate-x-up">Build Together</span>
        </p>
        <h2 className="subTitle text-[120px] md:text-[160px] leading-[130px] md:leading-[170px] font-bold rotate-x-up">
          {value}
        </h2>
      </div>
    </section>
  );
}
