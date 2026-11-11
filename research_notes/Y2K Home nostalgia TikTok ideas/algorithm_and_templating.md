# TikTok Algorithm Mechanics (2025–2026) and Templated Short-Video Production with Remotion

> Research context: notes compiled Nov 2026. **Method caveat:** this session's network blocked direct page fetches for newsroom.tiktok.com, buffer.com, socialmediatoday.com, remotion.dev and cdn.jsdelivr.net. Findings below come from search-engine result summaries of those pages and a few local Remotion skill docs bundled with Claude Code (v4.0.528). Each finding is cited to its URL, but the full original pages were **not read** in most cases. Wherever possible, verify exact numbers on the primary page before quoting them publicly.

## 1. What TikTok officially says about ranking signals, and what 2025–2026 studies show (length, hook, frequency, carousels)

### Takeaway
TikTok's official position (newsroom "How TikTok recommends videos #ForYou") is that **user interactions, including time spent watching, carry more weight** than video information (captions, sounds, hashtags) or device/account settings. TikTok has never published a ranked list of signals or their weights. Third-party consensus for 2025–2026 puts watch time, completion and rewatches first, with shares and saves weighted above likes. Studies split on length: Buffer finds longer videos get more views, while TikTok's own ad guidance says 21–34s. Metricool finds **average views per video fell about 31% YoY in early 2026** while post volume rose about 72%. Studies disagree on carousels. Video still wins on reach in the large 2026 datasets, while a 2025 study found carousels win on engagement *rate*.

### Cited Findings
**Official TikTok statements**
- TikTok says that for the For You feed, user interactions (which may include time spent watching a video) are generally weighted more heavily than other factors. Video information (captions, sounds, hashtags) and device/account settings (language, country, device type) are lighter signals. — [TikTok Newsroom: How TikTok recommends videos #ForYou](https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you) (could not be fetched directly; wording taken from secondary summaries such as [Buffer algorithm guide 2026](https://buffer.com/library/tiktok-algorithm/) and [Sprout Social](https://sproutsocial.com/insights/tiktok-algorithm/))
- TikTok has never published an official ranked list of algorithm signals or their weights, so percentage weightings found online are estimates. — [Go-Viral: TikTok algorithm 2026](https://www.go-viral.app/blog/tiktok-algorithm-2026/); [Darkroom: TikTok algorithm guide 2026](https://www.darkroomagency.com/observatory/tiktok-algorithm-guide-2026)
- TikTok's own analytics break watch behaviour into **Total Play Time, Average Watch Time, and "Watched full video"** (completion %). These are the native metrics to track. — [Darkroom: TikTok algorithm guide 2026](https://www.darkroomagency.com/observatory/tiktok-algorithm-guide-2026-everything-we-know-about-how-videos-are-ranked)
- TikTok's ads-side creative tips PDF recommends **21–34 seconds** for In-Feed ads, and allows 5–60s. Many blogs extend this figure to organic content. It traces back to a 2021 TikTok statement reported by Wired (**older info; ad-specific**). — [TikTok Ads: 7 Top Creative Tips (PDF)](https://ads.tiktok.com/business/library/7TopCreativeTips.pdf); [Sociality.io length guide 2026](https://sociality.io/blog/tiktok-video-length/)
- The often-quoted "post 1–4 times a day" guidance attributed to TikTok's Creator Academy **could not be verified** on a TikTok page. Blogs repeat it without a primary link. — [Lilach Bullock](https://www.lilachbullock.com/how-many-times-a-day-should-you-post-on-tiktok/)

**Third-party consensus on signals (practitioner, not official)**
- Completion rate / watch time is ranked first, and **shares and saves rank above likes**. One 2026 dev write-up says shares and saves have overtaken likes since 2025. Follower count is not a core ranking factor. Rewatches (loops) appear as a strong signal on most lists. — [dev.to: Why shares and saves matter more than likes (2026)](https://dev.to/stklen/tiktok-algorithm-2026-why-shares-and-saves-matter-more-than-likes-2gb4); [OpusClip: TikTok's new algorithm 2026](https://www.opus.pro/blog/tiktoks-new-algorithm-2026); [eClincher 2026](https://www.eclincher.com/articles/how-the-tiktok-algorithm-works-in-2026)
- Specific thresholds that circulate online, such as a "~35% completion cutoff", "1.5% engagement cutoff", "completion = 40–50% weight" and "5,000–10,000 view expansion pool", are **unsourced** and should be treated as folklore. — [Go-Viral 2026](https://www.go-viral.app/blog/tiktok-algorithm-2026/) (notes the lack of official data)

**Length**
- Buffer analysed ~**1.1M TikTok videos (Mar 2025)** and found that longer videos tended to get more views (videos over 1 min drew more reach and watch time), contrary to Buffer's own expectation. Buffer concludes that length is not make-or-break and that hook and content quality matter more. — [Buffer: Longer TikToks get more views](https://buffer.com/resources/longer-tiktoks-get-more-views-data/)
- Buffer's older May 2024 guide suggested testing 2min+ videos (**older**). — [Buffer: Best TikTok video length](https://buffer.com/resources/best-tiktok-video-length/)

**Posting frequency**
- Buffer studied ~11.4M posts from 150k+ accounts. The **median** video got ~500 views whether the account posted 1x/week or 10+x/week. Posting more often raised the odds of a breakout video, which improved per-post reach overall. (These figures come from secondary coverage; Buffer's primary page was not located.) — [Social Media Today on Buffer frequency study](https://www.socialmediatoday.com/news/tiktok-post-frequency-improves-per-post-reach-report-buffer/802443/); [RouteNote summary](https://routenote.com/blog/how-often-should-you-post-on-tiktok/)
- **Metricool 2026 TikTok Study:** 2,314,756 posts from 92k+ accounts, comparing Jan–Feb 2025 with Jan–Feb 2026. Average views per video fell from 47,884 to 32,895 (**−31.3%**), reach fell about 29% and interactions about 31%, while video production rose **72.1%**. Metricool says posting daily "does not guarantee better distribution". **73% of views come from the For You tab.** **96% of views and 98% of interactions happen in the first 10 days.** — [Metricool press release (May 2026)](https://metricool.com/press-release-tiktok-study-2026/); [Metricool TikTok Study 2026](https://metricool.com/tiktok-study/)
- Metricool's cross-platform 2026 study (39.8M posts) found average views per post fell 17% (2024 to 2025) while weekly posting frequency rose 22% (2.74 to 3.34 posts per week). — [NetInfluencer summary](https://www.netinfluencer.com/social-media-saturation-reaches-tipping-point-as-content-volume-outpaces-engagement-study-finds/)

**Carousels / photo mode vs video (conflicting)**
- **Fanpage Karma (2025):** ~698k TikTok posts, Jan–May 2025. Carousels earned **81% higher engagement rate** and 82% more likes than comparable videos, but reach was only **3% higher**. — [Fanpage Karma: Carousels comeback](https://www.fanpagekarma.com/insights/carousel-vs-video-performance-tiktok-instagram/)
- **Buffer (2026, 45M+ posts across platforms):** on TikTok, video had a median engagement rate of 3.39%, **77% higher than carousels/photo posts**. — [Buffer: Best content format 2026](https://buffer.com/resources/data-best-content-format-social-media/)
- **Metricool 2026:** carousel/image posts grew ~140% in volume, but their per-post views fell 23%. Videos generated ~**5x more reach and 6x more interactions** than carousels. — [Metricool press release](https://metricool.com/press-release-tiktok-study-2026/)
- Claims that photo posts get "1.9x more likes" trace back to TikTok's own format marketing rather than independent research. — [Stack Influence: Photo post comeback](https://stackinfluence.com/blog/tiktoks-photo-post-comeback) (vendor; unverified)

### Inferences
- For a small app account, **retention and shareability** are the levers. Likes and followers matter less. Each video should be built so viewers watch to the end, rewatch it, and send or save it ("send this to someone who had this room").
- Video length should be set by the content. Short loops (7–15s) maximise completion and rewatch rate. Longer (30–60s+) videos can win on total watch time if retention holds. Testing both is reasonable.
- Feed saturation in 2026 (volume +72%, views −31%) means more posts do not automatically mean more reach. Volume helps mainly by giving more chances at a breakout (Buffer), so cheap, templated production makes sense.
- The carousel conflict probably comes from different metrics. Carousels engage the people who see them (swipes and likes), but video still reaches more people. A sensible approach is to use both, with video as the main reach format and carousels for list or "rate my room"-style content.

### Gaps
- The exact current wording of TikTok's official newsroom page could not be read (host blocked). Use the newsroom URL to confirm.
- No primary TikTok source was found for "post 1–4x/day".
- No official TikTok weighting exists for shares vs saves vs comments. The ordering is practitioner consensus only.

---

## 2. Hook timing, loops, completion and format metrics (2-second view rate, hold rate, average watch time, shares per view)

### Takeaway
No official TikTok benchmark exists for hook rate or 2-second view rate. Vendors loosely agree on a working target of **~60–70% of viewers still watching at 3 seconds**, plus strong completion. Measure against your own baseline using TikTok's retention curve, average watch time and "watched full video" figures.

### Cited Findings
- "Hook rate" is a third-party metric, usually defined as the share of viewers still watching at 3s. TikTok's own analytics show retention curves rather than a named hook rate. — [Billo: Hook rate to hold rate](https://billo.app/blog/hook-rate-to-hold-rate); [PostEverywhere: hook rate](https://posteverywhere.ai/glossary/hook-rate)
- Vendor thresholds at 3s **conflict**: "65–70% is the minimum viable, 80–90% is a strong hook" ([TTSVibes](https://insights.ttsvibes.com/?p=533)); "target 65%+" ([Nestscale 2026](https://nestscale.com/blog/increase-tiktok-hook-rate.html)); "50%+ is functional, 60%+ is strong" ([ShortsFast 2026](https://shortsfast.com/blog/faceless-shorts-hooks-retention-2026/)); "70–85% is good" ([Socialync 2026](https://www.socialync.io/blog/tiktok-viral-retention-rate-2026)). None publish a methodology.
- A claim that "~70% of retention is decided in the first 2 seconds" (attributed to a Feb 2026 Go-Viral report) could not be traced to its source. — [dev.to: Hook engineering 2026](https://dev.to/bulkdl/hook-engineering-the-science-of-the-first-3-seconds-in-short-form-video-2026-2jp9) (unverified)
- "2-second view rate" is a standard *TikTok Ads Manager* video metric. "Hold rate" (e.g. viewers at 15s or at completion divided by 3s viewers) is a performance-marketing convention. — [Billo](https://billo.app/blog/hook-rate-to-hold-rate)
- Native organic metrics to track are Average Watch Time, Watched full video % and Total Play Time. — [Darkroom](https://www.darkroomagency.com/observatory/tiktok-algorithm-guide-2026-everything-we-know-about-how-videos-are-ranked)
- Metricool: 96% of a video's views arrive within 10 days, so a format can be judged about 7–10 days after posting. — [Metricool](https://metricool.com/press-release-tiktok-study-2026/)

### Inferences
- Suggested per-format scorecard: (a) 3s retention from the retention curve, (b) average watch time ÷ length (average % watched), (c) "watched full video" %, (d) **shares per 1,000 views** and **saves per 1,000 views**, (e) profile visits or link taps per 1,000 views, as the proxy for app conversion. Compare formats on medians across at least 5–10 posts each, not on single videos, because the outcome distribution is heavy-tailed (Buffer's ~500 median).
- Loops: if the last frame cuts seamlessly back to the first, average % watched can exceed 100% and rewatches increase. This is a cheap thing to build into a template.
- Hook structure: put the visual and on-screen-text payoff promise in frame 0. Do not open on a logo or title card.

### Gaps
- No published, methodologically sound benchmark exists for 2s or 3s retention on organic TikTok. The thresholds above are vendor folklore.
- No data was found on how much rewatches count relative to completion.

---

## 3. App-marketer practice: faceless slideshows vs creator-led/UGC, posting 1–3x/day, multiple accounts, hook variant testing, hook + reveal + CTA

### Takeaway
Indie app founders widely report that faceless slideshow and templated accounts, run at high volume (often across several accounts) with many hook variants, can drive downloads cheaply. The evidence is anecdotal and often comes from vendors selling slideshow tools. Running multiple accounts and reposting identical videos carries reach and enforcement risk.

### Cited Findings
- An Indie Hackers founder built SlideStorm (a TikTok slideshow generator) because app developers want TikTok traffic but dislike making videos. The post (Aug 2025) frames slideshows as a major app-marketing channel. — [Indie Hackers: SlideStorm](https://www.indiehackers.com/product/slidestorm); [IH: TikTok slideshows can get apps to 1000s in MRR](https://www.indiehackers.com/post/i-had-no-idea-tiktok-slideshows-could-get-apps-to-1000s-in-mrr-05ed74d49e)
- A developer write-up describes fully automating TikTok slideshow marketing with AI agents plus a scheduler (Postiz). It claims slideshows are "one of the most effective ways to drive app downloads without spending a dollar on ads" (vendor-adjacent). — [Postiz blog](https://postiz.com/blog/automate-tiktok-slideshow-marketing-ai-agents-postiz)
- Case study: Rayz AI reportedly went from 0 to $80K MRR in 75 days using multiple faceless/viral TikTok accounts. The same piece cites Cal AI reaching ~$400K MRR with a similar approach (secondary; vendor blog). — [Shortimize: Rayz AI](https://www.shortimize.com/blog/from-zero-to-80k-mrr-in-75-days-how-rayz-ai-mastered-tiktok-marketing)
- The multi-account "fleet" tactic means running several accounts to see which hooks work in real time, then shifting all accounts to the winning hook. — [Stormy.ai: TikTok app marketing UGC/faceless hooks](https://stormy.ai/blog/tiktok-app-marketing-ugc-faceless-viral-hooks); [Stormy.ai: scaling faceless UGC](https://stormy.ai/blog/scaling-social-growth-faceless-ugc-ai-influencers)
- Couple Joy faceless slideshow growth case (newsletter). — [Playkit](https://playkit.beehiiv.com/p/couple-joy-faceless-slideshow-growth)
- Caution: one Indie Hackers post notes that a 221.5M-view case study is attention evidence, **not** proof of app acquisition. Views do not equal downloads. — [Indie Hackers faceless AI tools playbook](https://www.indiehackers.com/post/i-run-a-faceless-ai-tools-tiktok-just-shipped-the-playbook-with-the-actual-2026-monetization-stack-3-sourced-case-studies-6fe30c2f50)
- Multiple accounts: third-party guides cite a practical limit of ~3 accounts per device. They warn that more accounts per device and automation-like behaviour can trigger flags, that cloned accounts reposting identical videos are treated as spam, and that duplicate clips across your own accounts get reduced reach. No official TikTok document was found for these thresholds. — [Shortimize: managing multiple accounts](https://www.shortimize.com/blog/how-to-manage-multiple-tiktok-accounts); [GrowthFolks](https://growthfolks.io/social-media/managing-multiple-tiktok-accounts-without-killing-organic-reach/); [Ayrshare: account restricted](https://www.ayrshare.com/help-center/technical-support/tiktok_account_restricted)

### Inferences
- For a nostalgia-themed iOS app, a **faceless, template-driven series** is the most realistic route for a tiny team. Examples include "rooms from 2003", "your bedroom in Y2K vs now" and "rate this setup" (video plus carousel variants). Creator-led or UGC content can be added later as a higher-trust layer once winning hooks are known.
- Make each variant unique (different hook text, footage order, audio and timing) rather than reposting identical files across accounts.
- A simple test loop: about 10 hook variants per concept, each run on the same body with a "hook → reveal → CTA" structure (hook 0–2s, reveal or payoff, soft CTA such as "made in [app]" or "link in bio"). Keep the winners and drop the rest after about 7–10 days, matching Metricool's 10-day window.

### Gaps
- No independent data was found comparing faceless vs creator-led vs UGC organic performance or download conversion for apps.
- No primary TikTok policy text was found on multiple accounts per device. The ~3 figure is folklore.

---

## 4. Audio: trending vs original, and Commercial Music Library limits for business accounts

### Takeaway
**Business accounts are limited to the Commercial Music Library (CML)**, which excludes most trending songs. Brands using uncleared commercial music face muting, removal and legal risk. A personal or creator account can use trending sounds for non-commercial posts, but promoting your own app is commercial use. Original audio, such as a voiceover or a licensed or self-made track, avoids the problem.

### Cited Findings
- Business accounts see only the CML when adding audio, and the restriction applies to content promoting a product, service or business, even without paid promotion. — [Soundstripe: TikTok music licensing rules](https://www.soundstripe.com/blogs/tiktok-music-licensing-rules); [Soundstripe: TikTok music library 2026](https://www.soundstripe.com/blogs/tiktok-music-library-explained)
- CML size is reported inconsistently: "over 1,000,000 sounds" (attributed to TikTok's help centre) vs "over 600,000" (TikTok business blog). — [Foxi Music: Commercial music licensing TikTok 2026](https://www.foximusic.com/blog/commercial-music-licensing-tiktok-guide/)
- Trending songs are largely unavailable to business accounts. — [Join Status: TikTok CML](https://www.joinstatus.com/blog-for-brands/tiktok-commerical-music-library)
- Independently licensed tracks can be used if the licence covers commercial use on TikTok and the account completes TikTok's Music Usage Confirmation at upload. A track you distribute through a standard aggregator lands in the general library, not the CML. — [Dynamoi](https://dynamoi.com/learn/faqs/can-i-use-my-own-music-on-tiktok-business-account)
- Reported July 2025 Music Terms update with stricter muting/removal (**not confirmed from a primary TikTok source**). — [Lumina Clippers](https://luminaclippers.com/blog/tiktok-commercial-music-library)
- A 2025 lawsuit, Sony v. DSW, is cited over brand social posts using Sony recordings outside the CML. — [Foxi Music](https://www.foximusic.com/blog/commercial-music-licensing-tiktok-guide/)

### Inferences
- If Remotion is used, **bake licensed or original audio into the render** (CML-safe or royalty-free with a social licence) or post silent and add a CML sound in-app. Do not bake trending commercial songs into rendered files.
- A recognisable original sound (for example, a Y2K-style startup chime or dial-up audio made in-house) could become the series' audio signature and is fully owned.

### Gaps
- There is no 2025–2026 data comparing reach for trending vs original audio.

---

## 5. TikTok Search / SEO

### Takeaway
Practitioners agree that TikTok search indexes **captions, on-screen text (OCR) and spoken words (auto-transcription)**. Put the target keyword in all three early in the video. TikTok has not documented search ranking officially.

### Cited Findings
- TikTok uses OCR on on-screen text and transcription of spoken audio, in addition to captions and hashtags. Guides recommend the keyword in the spoken intro, the on-screen text, the caption and the hashtags. — [Metricool TikTok SEO guide 2026](https://metricool.com/tiktok-seo/); [Darkroom: TikTok SEO](https://www.darkroomagency.com/observatory/tiktok-seo); [PostEverywhere TikTok SEO 2026](https://posteverywhere.ai/blog/tiktok-seo-2026)
- Some guides advise saying or showing the keyword within the first 1–3s (advice, not measured). — [BlitzCut TikTok SEO 2026](https://blitzcutai.com/blog/tiktok-seo-guide-2026)
- "65% of Gen Z have used TikTok as a search engine" (attributed to a 2026 Adobe study) could not be verified. — [Metricool TikTok SEO](https://metricool.com/tiktok-seo/) (secondary)
- The claim that 150–300-character captions outrank short ones is unsupported. — [CapCut](https://www.capcut.com/create/tiktok-caption-keywords-discoverability)

### Inferences
- Templates should include a keyword field that drives both the on-screen title text (OCR-readable, high-contrast, inside the safe zone) and the caption, e.g. "y2k bedroom", "2000s room", "nostalgic aesthetic app".

### Gaps
- No official TikTok documentation or independent study of search ranking factors was found.

---

## 6. Series features

### Takeaway
TikTok's paid "**Series**" feature (launched March 2023) puts premium content behind a paywall, so it is not a growth tool. The free organising tool is **Playlists**. Episodic "Part 1/Part 2" content is a content pattern, not a platform feature.

### Cited Findings
- TikTok Series (Mar 2023) lets creators put up to 80 videos of up to 20 min each behind a paywall priced $0.99–$189.99 (**older info**). — [Search Engine Land](https://searchengineland.com/tiktok-introduces-a-series-feature-enabling-creators-to-sell-premium-episodes-393982)
- Playlists (since 2021) organise existing videos into episodes. One guide says creating them requires about 10k followers (eligibility may have changed). — [Socialk.it playlists guide](https://socialk.it/en/blog/tiktok-playlists-guide); [Hootsuite: playlists](https://blog.hootsuite.com/how-to-make-a-playlist-on-tiktok/)
- TikTok has been incentivising brands to create promotional episodic content. Meta (Reels "Series") and YouTube (Shorts seasons/episodes) launched similar features in 2026. — [MediaPost](https://www.mediapost.com/publications/article/416217/tiktok-incentivizes-brands-to-create-promotional-e.html); [Dailyovation June 2026](https://dailyovation.com/2026/06/04/instagram-series-feature-tv-network-meta/)

### Inferences
- Use a numbered episodic format ("Y2K Room #14") with a consistent visual template. Add a Playlist once eligible. Consistent series branding works with templated rendering.

### Gaps
- Current (late 2026) Playlist eligibility was not verified.

---

## 7. Text safe zones for 1080×1920

### Takeaway
TikTok publishes no single pixel spec; third-party estimates conflict. A conservative rule: keep key text and faces out of the **top ~150–200px, bottom ~400–480px and right ~150px**. Centre text roughly in the area x 60–900 and y 200–1440.

### Cited Findings
- No fixed official pixel margins are published. The UI overlay varies with caption length. — [Adaptlypost safe zones 2026](https://adaptlypost.com/blog/social-media-safe-zones-2026-complete-guide); [Wild and Free Tools 2026](https://wildandfreetools.com/blog/vertical-video-safe-zones-guide-2026/)
- Bottom margin estimates range from 250–300px ([Quso](https://quso.ai/blog/tiktok-dimensions)) through 320px ([House of Marketers](https://www.houseofmarketers.com/guide-to-safe-zones-tiktok-facebook-instagram-stories)) to 480px ([trymypost 2026](https://www.trymypost.com/blog/social-media-safe-zones-templates-2026)). The right-hand icon column is estimated at ~120–164px, and the top at ~108–200px. Resulting safe areas cited: ~900×1492, 960×1386 and 840×1280. — same sources; [AiCarousels checker](https://www.aicarousels.com/free-tools/tiktok-safe-zone-checker)

### Inferences
- Encode the conservative safe rectangle as a constant in the Remotion template (e.g. `SAFE = {top: 200, bottom: 480, left: 60, right: 160}`) and add a debug overlay toggled by a prop, so every variant renders within the safe zone.

### Gaps
- The official TikTok overlay file could not be accessed.

---

## 8. Remotion: templating with props, batch rendering, Lambda, cost, licensing, limitations

### Takeaway
Remotion fits this workflow well. Each format becomes a React composition with a Zod-typed props schema, and many variants are rendered from a JSON dataset with `renderMedia()` (locally), or with `renderMediaOnLambda()` / the CLI with `--props`. **Licence: free for individuals and for-profit companies with up to 3 employees, including automation.** Companies with 4+ employees need a Company License (Automators: $0.01/render, $100/month minimum, per the official pricing page as summarised). Lambda compute cost is roughly $0.001–$0.02 per short render.

### Cited Findings
**Templating**
- Compositions accept **input props**. Default props are the fallback. Input props passed at render time override them, and `calculateMetadata()` can transform props and set duration or dimensions from data. Overrides such as `--width` take priority. — [Remotion: How props get resolved](https://remotion.dev/docs/props-resolution); [Remotion: Parametrized rendering](https://remotion.dev/docs/parametrized-rendering); [Remotion: Dynamic metadata](https://remotion.dev/docs/dynamic-metadata)
- `calculateMetadata()` runs inside a `delayRender()` that times out after 30s by default, so slow data fetches can fail the render. — [Remotion: calculate-metadata](https://v4.remotion.dev/docs/calculate-metadata); [Remotion: data fetching](https://convert.remotion.dev/docs/data-fetching)
- Zod schemas enable visual prop editing in Studio. The top level must be `z.object()` and Remotion pins a specific Zod version. — [Remotion: Visual editing](https://v4.remotion.dev/docs/visual-editing); [skillselion summary](https://skillselion.com/skills/oakoss/agent-skills/remotion)

**Batch rendering**
- Official "Render videos programmatically from a dataset" guide: import a JSON dataset, call `selectComposition`/`getCompositions` with the entry's props (needed if duration or dimensions depend on data), then `renderMedia()` for each entry. Convert CSV to JSON first. The docs advise **rendering one video at a time locally**, because each render already uses all available machine resources. — [Remotion: Dataset render](https://www.remotion.dev/docs/dataset-render)
- CLI: `npx remotion render [id] out.mp4 --props=...`. `npx remotion still` renders single frames (useful for carousel/photo-mode slides), and `--frames` renders several frames as images in one call. — local Remotion skill docs (remotion-render v4.0.528); [Remotion CLI render](https://www.remotion.dev/docs/cli/render)
- Server-side options: plain Node (`@remotion/renderer`), Lambda, Vercel Sandbox, GitHub Actions, Cloud Run, Azure Container Apps, Cloudflare Containers. Reference render server: github.com/remotion-dev/template-render-server. — [Remotion: compare SSR](https://www.remotion.dev/docs/compare-ssr); [Remotion SSR](https://www.remotion.dev/docs/ssr)

**Lambda**
- `renderMediaOnLambda({region, functionName, serveUrl, composition, codec, inputProps, framesPerLambda, ...})`. A lower `framesPerLambda` spawns more Lambdas in parallel, up to ~200 functions per render. — [Remotion: renderMediaOnLambda](https://www.remotion.dev/docs/lambda/rendermediaonlambda); [Remotion Lambda FAQ](https://remotion.dev/docs/lambda/faq)
- Setup: `npx remotion add @remotion/lambda`, then create the IAM role and user, deploy the function (redeploy after every Remotion upgrade) and the site (redeploy after source changes), and check quotas with `npx remotion lambda quotas`, since new AWS accounts may need a concurrency increase. — [Remotion Lambda setup](https://www.remotion.dev/docs/lambda/setup); local skill doc remotion-saas/rendering.md
- Cost: Hello World costs ~**$0.001 per warm render** (2048MB, 7.56s) for Lambda compute only. S3, bandwidth and CloudWatch are extra. The Lambda landing page estimates ~**$0.01 per minute of video** (ARM64, 2048MB, us-east-1). Exact cost depends on region, memory, content and parallelisation, so measure your own composition. — [Remotion Lambda cost example](https://convert.remotion.dev/docs/lambda/cost-example); [Remotion Lambda](https://remotion.dev/docs/lambda)
- A third-party Oct 2026 model uses ~$0.017 per warm 1-min 1080p render. — [Wireflow: Remotion pricing](https://www.wireflow.ai/blog/remotion-pricing) (non-official)

**Licence (verify on remotion.dev/license before relying on it)**
- **Free License**: individuals, non-profits, and for-profit organisations with **up to 3 employees**. A company of 3 or fewer can also use it for automation; the Automators plan applies only under the Company License. — [Remotion License](https://remotion.dev/license); [Remotion License FAQ](https://www.remotion.dev/docs/license/faq)
- **Company License** (4+ employees): "Automators" is **$0.01 per render with a $100/month minimum**. "Creators" is seat-based; one non-official source puts it at ~$25/seat/month. Another source says the $100 minimum is combined across both plans. — [Remotion pricing](https://remotion.dev/pricing); [Wireflow](https://www.wireflow.ai/blog/remotion-pricing); [AutoAE: Is Remotion free (2026)](https://autoae.online/blog/is-remotion-free)
- A Japanese site lists employee-tier annual fees and a 10k-renders/month allowance. These details are **not** on the official pages and are unverified. — [aipicks.jp](https://aipicks.jp/mag/remotion-pricing-2026)

**Examples of data-driven variants**
- Personalised-video pattern, "one template, thousands of outputs" (e.g. GitHub Unwrapped, Wrapped-style recaps, onboarding videos). The description comes from a skill listing; GitHub Unwrapped is a known Remotion showcase, but its repo was not verified in this session. — [skillselion: remotion-video-toolkit](https://skillselion.com/skills/shreefentsar/remotion-video-toolkit)
- JSON-spec renderers: Vercel Labs json-render has a Remotion renderer, and there is a community remotion-cli. — [Medium: json-render + Remotion](https://medium.com/@kenzic/building-ai-generated-video-with-json-render-and-remotion-b9f1000ff7af); [GitHub gxbvc/remotion-cli](https://github.com/gxbvc/remotion-cli)
- "Video as code" agentic generation with Remotion (Aug 2026 article). — [Digital Applied](https://www.digitalapplied.com/blog/video-as-code-remotion-agentic-generation-2026)

### Inferences
- For a team of 3 or fewer, Remotion is free. Rendering about 100 short variants per week locally (sequentially) on a laptop is feasible; Lambda is optional, costs cents per batch and mainly saves wall-clock time.
- Suggested architecture: `src/remotion/` (outside Expo's `src/app/`) with one composition per series format (e.g. `RoomReveal`, `ThenVsNow`, `RateMySetup`) and a Zod schema of `{hookText, keyword, clips[], audioSrc, ctaText, loop: boolean, theme}`. A `variants.json` (hooks × clips × audio) feeds a Node script that calls `selectComposition` and `renderMedia` for each entry and writes `out/{series}-{ep}-{hookId}.mp4`. `remotion still` renders carousel slides. Logging hookId in the filename lets you join it with TikTok analytics later.
- Fonts: load fonts via `@remotion/google-fonts` or `@remotion/fonts` so renders wait for them. Audio: bake only licensed or original audio (see section 4).

### Gaps
- The exact Creators seat price and current minimums were not confirmed on a primary page (remotion.dev blocked here).
- No authoritative source was found in this session for font/audio pitfalls on Lambda, such as font-loading timeouts or audio codec defaults. Check the Remotion docs on fonts and audio.
- Published TikTok-specific case studies of companies batch-rendering Remotion variants for organic marketing were not found. The evidence base is mostly the personalised "Wrapped"-style video pattern.
