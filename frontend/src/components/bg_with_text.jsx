import {ThreeDMarquee} from './bg.jsx'

export function ThreeDMarqueeDemoSecond() {
  const images = [
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749448753/wallpaperflare.com_wallpaper_e0aj8b.jpg",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749567618/EYANZZPN6NMNBAMQYIXYFYCVDM_490x373_xcyoyx.jpg",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749559488/here_uli2ue.jpg",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749562216/borussia-dortmund-fans-240824g1200_500x281_ffayvu.webp",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749541124/bd2vb9ex4bib1_fl10pb.jpg",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749558387/fc-bayern-2025-2026-home-kits-v0-rq906ynzu16f1_beyxti.webp",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749558677/32b7febb95d86fd4e360d336b05d6f41_imlkv6.webp",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749567618/EYANZZPN6NMNBAMQYIXYFYCVDM_490x373_xcyoyx.jpg",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749567824/Cristiano_Ronaldo_1738747627091_490x373_lwtg2j.webp",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749568129/01jcrbfswsdvwapnt8qr_1_493x278_lrubee.webp",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749567824/Cristiano_Ronaldo_1738747627091_490x373_lwtg2j.webp",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749556001/2024-qualifying-round-group-j-825771495_o7zt0d.jpg",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749558542/Inter_Miami_Lionel_Messi_031424.jpg_iqjnev.webp",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749558991/0_Kevin-De-Bruyne_rf5fqn.webp",//ready
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749557467/19-Lamine-M_ruwlwm.webp",//ready
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749557855/Kylian_Mbappe_Joins_Real_Madrid_1_a9kjzr.jpg",//ready
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749568129/01jcrbfswsdvwapnt8qr_1_493x278_lrubee.webp",//ready
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749568129/01jcrbfswsdvwapnt8qr_1_493x278_lrubee.webp",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749568129/01jcrbfswsdvwapnt8qr_1_493x278_lrubee.webp",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749556925/Brazil_Jersey___Neymar_Jersey_1_ez3pgy.jpg",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749559488/here_uli2ue.jpg",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749557258/Brazil_Jersey___Neymar_Jersey_2_kwty1i.jpg",//ready
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749558106/21ucl_w4twts.png",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749567405/64G56NY7Q5J7THJP4I4TJ5ATLE_490x373_ln1aio.jpg",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749568129/01jcrbfswsdvwapnt8qr_1_493x278_lrubee.webp",
    "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749566500/GettyImages-2166876546-2-scaled_490x327_no3ygo.jpg",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749566500/GettyImages-2166876546-2-scaled_490x327_no3ygo.jpg",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749557467/19-Lamine-M_ruwlwm.webp",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749566909/6WRFSIJPNZNK5JIVFKYPRLBAQA_490x319_qh8dlh.jpg",
    "https://res.cloudinary.com/dwlbowgx5/image/upload/v1749560642/GettyImages-2156089286-e1717879431950-1024x733_cropped_ptz36q.webp",
  ];
  return (
    <div className="relative mx-auto flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
      <h2 className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
        This is your life and it&apos;s ending one{" "}
        <span className="relative z-20 inline-block rounded-xl bg-blue-500/40 px-4 py-1 text-white underline decoration-sky-500 decoration-[6px] underline-offset-[16px] backdrop-blur-sm">
          moment
        </span>{" "}
        at a time.
      </h2>
      <p className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">
        You are not your job, you&apos;re not how much money you have in the
        bank. You are not the car you drive. You&apos;re not the contents of
        your wallet.
      </p>
 
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
        <button className="rounded-md bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
          Join the club
        </button>
        <button className="rounded-md border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
          Read more
        </button>
      </div>
 
      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images}
      />
    </div>
  );
}