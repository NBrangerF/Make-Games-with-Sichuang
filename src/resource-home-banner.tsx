export function ResourceHomeBanner() {
  return (
    <section className="resource-purpose-banner" aria-labelledby="resource-purpose-title">
      <div className="resource-purpose-banner__copy">
        <span className="resource-purpose-banner__rule" aria-hidden="true" />
        <h2 id="resource-purpose-title">
          <span>从问题出发，</span>
          <span>找到现在这一步。</span>
        </h2>
        <p>按设计阶段、分析方法和眼下问题整理中文资料；读完后，把配套工作单带回你的设计桌。</p>
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
