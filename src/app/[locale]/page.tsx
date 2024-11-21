import Image from "next/image";
import { TopBar } from "./appbar";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

import build from "~/assets/homepage/build.webp";
import communicate from "~/assets/homepage/communicate.webp";
import simplicity from "~/assets/homepage/simplicity.webp";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export default async function HomePage() {
  return (
    <>
      <TopBar />
      <main className="my-8 flex flex-col place-items-center">
        <div className="mb-24 flex max-w-[600px] flex-col place-items-center gap-2 rounded-[48px] bg-foreground/5 px-8 py-16 md:mt-16">
          <Icon icon="timer" className="mb-8" size={48} />
          <div className="text-center text-[18px] font-medium leading-relaxed tracking-wide text-foreground/80 subpixel-antialiased [&_h2]:mb-4 [&_h2]:text-[32px] [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-normal [&_h2]:text-foreground">
            <h2>Придется подождать...</h2>
            <p>
              NightWorlds в данный момент находится в стадии обновления. К
              сожалению, поиграть пока не получится. Мы обязательно объявим о
              запуске в своих соц. сетях.
            </p>
          </div>
          <div className="mt-6 flex gap-2">
            <Link href="https://discord.gg/jtSnBy3Wsf" target="_blank">
              <Button type="button" variant="filled">
                Discord
                <Icon icon="arrow_outward" size={16} className="-mr-2" />
              </Button>
            </Link>
            <Link href="https://t.me/nilicom" target="_blank">
              <Button type="button" variant="text">
                Telegram
                <Icon icon="arrow_outward" size={16} className="-mr-2" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex max-w-[1400px] flex-col gap-16 px-8 py-8 md:px-20">
          <FeatureBox img={build} alt="Two players building a tower" reverse>
            <h2>Стройте удивительные вещи</h2>
            <p>
              Правила сервера созданы таким образом, чтобы позволить игрокам
              строить всё, что они хотят. Вы можете построить статую,
              футуристичный город или кафе – мы не против. Главное – не
              заниматься грифом.
            </p>
          </FeatureBox>
          <FeatureBox img={communicate} alt="Two players trading">
            <h2>Общайтесь с игроками</h2>
            <p>
              Один из главных приоритетов NightWorlds – это люди. Это правило
              работает во всех наших мирах. Вместе мы можем сделать всё!
            </p>
            <div className="mt-6 flex gap-2">
              <Link href="https://discord.gg/jtSnBy3Wsf" target="_blank">
                <Button type="button" variant="filled">
                  Discord
                  <Icon icon="arrow_outward" size={16} className="-mr-2" />
                </Button>
              </Link>
              <Link href="https://t.me/nilicom" target="_blank">
                <Button type="button" variant="text">
                  Telegram
                  <Icon icon="arrow_outward" size={16} className="-mr-2" />
                </Button>
              </Link>
            </div>
          </FeatureBox>
          <FeatureBox img={simplicity} alt="Minimalistic building" reverse>
            <h2>Сила в простоте</h2>
            <p>
              Мы любим минимализм. В простоте настоящая сила! Здесь вы не
              увидите страницы с дизайном из 2007 года. Также, мы не показываем
              целые абзацы текста за один раз в самой игре.
            </p>
          </FeatureBox>
        </div>
      </main>
    </>
  );
}

function FeatureBox(props: {
  img: StaticImport;
  alt: string;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="w-full grid-cols-7 lg:grid">
      <Image
        className={`col-span-3 mb-8 lg:mb-0 ${props.reverse ? "order-2" : ""}`}
        src={props.img}
        alt={props.alt}
      />
      <div className={props.reverse ? "order-1" : ""} />
      <div className="col-span-3 flex flex-col justify-center text-[18px] font-medium leading-relaxed tracking-wide text-foreground/80 subpixel-antialiased [&_h2]:mb-4 [&_h2]:text-[32px] [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-normal [&_h2]:text-foreground">
        {props.children}
      </div>
    </div>
  );
}
