export default function SubVisual({ value, image }) {
  return (
    <section
      className={`visual h-[758px] pt-[450px] bg-cover bg-center`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="container">
        <p
          className="text-[52px] leading-[62px] md:text-[49px] md:leading-[59px] font-light"
          data-reveal="fade-up"
          data-reveal-delay="0.2"
        >
          Let’s Talk Ideas,
          <span
            className="block pl-[150px]"
            data-reveal="fade-up"
            data-reveal-delay="0.4"
          >
            Build Together
          </span>
        </p>
        <h2
          className="subTitle text-[120px] md:text-[160px] leading-[130px] md:leading-[170px] font-bold"
          data-reveal="fade-up"
          data-reveal-delay="0.6"
        >
          {value}
        </h2>
      </div>
    </section>
  );
}
