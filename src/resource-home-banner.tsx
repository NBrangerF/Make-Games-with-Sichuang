export function ResourceHomeBanner() {
  return (
    <section className="resource-purpose-banner" aria-labelledby="resource-purpose-title">
      <div className="resource-purpose-banner__copy">
        <span className="resource-purpose-banner__rule" aria-hidden="true" />
        <h2 id="resource-purpose-title">
          <span>从问题出发，</span>
          <span>找到现在这一步。</span>
        </h2>
        <p>先读懂一局游戏，再沿着选择、规则和试玩的问题找到资料。原创文章有中文和英文，也有可以继续查阅的来源。</p>
      </div>
      <picture className="resource-purpose-banner__media">
        <source
          media="(max-width: 680px)"
          srcSet="/assets/brand/luozhuo-home-banner-image2-640.webp"
        />
        <source
          media="(max-width: 1200px)"
          srcSet="/assets/brand/luozhuo-home-banner-image2-960.webp"
        />
        <img
          src="/assets/brand/luozhuo-home-banner-image2-1600.webp"
          srcSet="/assets/brand/luozhuo-home-banner-image2-640.webp 640w, /assets/brand/luozhuo-home-banner-image2-960.webp 960w, /assets/brand/luozhuo-home-banner-image2-1600.webp 1600w"
          sizes="(max-width: 960px) calc(100vw - 40px), (max-width: 1280px) 44vw, min(46vw, 680px)"
          alt="桌面上排列着规则草图、木制棋子、卡牌和路径标记，呈现从问题到原型的设计过程"
          width={1600}
          height={600}
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>
    </section>
  )
}
