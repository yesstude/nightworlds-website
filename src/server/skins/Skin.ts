import sharp from "sharp";
import Cloth from "./Cloth";

export default class Skin {
  private image: sharp.Sharp | undefined;
  private clothes: Cloth[] = [];

  constructor(url: string | Buffer) {
    this.image = sharp(url);
  }

  public wear(cloth: Cloth): Skin {
    this.clothes.push(cloth);
    return this;
  }

  private async slmask(
    url: string | Buffer,
    width: number,
    height: number,
    left: number,
    top: number,
    postLeft: number,
    postTop: number
  ): Promise<Buffer> {
    return await sharp(url)
      .pipe(sharp())
      .extract({
        left: left,
        top: top,
        width,
        height,
      })
      .extend({
        left: postLeft,
        top: postTop,
        right: 64 - postLeft - width,
        bottom: 64 - postTop - height,
        background: "#00000000",
      })
      .threshold(255)
      .toBuffer({ resolveWithObject: false });
  }
  private async applyCloth(url: string | Buffer): Promise<Skin> {
    let skin = this.image as sharp.Sharp;

    const hm = await this.slmask(url, 32, 16, 0, 0, 32, 0);
    const bm = await this.slmask(url, 24, 16, 16, 16, 16, 32);
    const lhm = await this.slmask(url, 16, 16, 40, 16, 40, 32);
    const rhm = await this.slmask(url, 16, 16, 32, 48, 48, 48);
    const llm = await this.slmask(url, 16, 16, 0, 16, 0, 32);
    const rlm = await this.slmask(url, 16, 16, 16, 48, 0, 48);

    skin = skin.composite([
      { input: hm, blend: "dest-out" },
      { input: bm, blend: "dest-out" },
      { input: lhm, blend: "dest-out" },
      { input: rhm, blend: "dest-out" },
      { input: llm, blend: "dest-out" },
      { input: rlm, blend: "dest-out" },
      { input: url },
    ]);

    this.image = skin.pipe(sharp());
    return this;
  }
  private async bake(): Promise<Skin> {
    for (let i = 0; i < this.clothes.length; i++) {
      const cloth = this.clothes[i] as Cloth;
      await this.applyCloth(await cloth.getBuffer());
    }
    return this;
  }

  public async getDataUrl(): Promise<string> {
    await this.bake();
    // this.image = this.image?.composite([
    //   {
    //     blend: "overlay",
    //     input: "/home/ecstud/Pictures/NWm4 Beta Characters/reliefmap2.png",
    //   },
    // ]);
    const buffer = await this.image?.toBuffer({ resolveWithObject: false });
    return `data:image/png;base64,${buffer?.toString("base64")}`;
  }
}
