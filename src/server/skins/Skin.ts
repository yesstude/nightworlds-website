import axios from "axios";
import sharp from "sharp";
import Cloth from "./Cloth";

export default class Skin {
  private image: sharp.Sharp | undefined;
  private clothes: Cloth[] = [];

  constructor(data: string | Buffer) {
    this.image = sharp(data);
  }

  public static async fromUrl(url: string) {
    return new Skin(
      (
        await axios({
          url,
          responseType: "arraybuffer",
        })
      ).data as Buffer
    );
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

  public async getHeadPicture(sizes: number = 8) {
    await this.bake();
    let skin = this.image as sharp.Sharp;

    let image = sharp({
      create: {
        background: "#00000000",
        channels: 4,
        width: 16,
        height: 16,
      },
    }).png();

    const tss = [
      [8, 8, 8, 8, 0, 0],
      [8, 8, 40, 8, 0, 0],
    ];
    let trs = [];
    for (let i = 0; i < tss.length; i++) {
      const ts = tss[i]!;
      const tr = await sharp(await skin.toBuffer())
        .pipe(sharp())
        .extract({
          width: ts[0]!,
          height: ts[1]!,
          left: ts[2]!,
          top: ts[3]!,
        })
        .extend({
          left: ts[4]!,
          top: ts[5]!,
          right: 16 - ts[4]! - ts[0]!,
          bottom: 16 - ts[5]! - ts[1]!,
          background: "#00000000",
        })
        .toBuffer();
      trs.push(tr);
    }

    image = image
      .composite(trs.map((val: any) => ({ input: val })))
      .pipe(sharp())
      .extract({
        left: 0,
        top: 0,
        width: 8,
        height: 8,
      });

    image = image.resize(sizes, sizes, {
      fit: "fill",
      kernel: "nearest",
    });
    const buffer = await image.png().toBuffer({ resolveWithObject: false });

    // return `data:image/png;base64,${buffer?.toString("base64")}`;
    return buffer;
  }

  public async getProfilePicture(sizes: number = 16) {
    await this.bake();
    let skin = this.image as sharp.Sharp;

    let image = sharp({
      create: {
        background: "#00000000",
        channels: 4,
        width: 16,
        height: 16,
      },
    }).png();

    const ARMS_WIDTH = 3;
    const tss = [
      [8, 8, 8, 8, 4, 0],
      [8, 8, 40, 8, 4, 0],
      [8, 8, 20, 20, 4, 8],
      [8, 8, 20, 36, 4, 8],
      [ARMS_WIDTH, 8, 44, 20, 4 - ARMS_WIDTH, 8],
      [ARMS_WIDTH, 8, 44, 36, 4 - ARMS_WIDTH, 8],
      [ARMS_WIDTH, 8, 36, 52, 12, 8],
      [ARMS_WIDTH, 8, 52, 52, 12, 8],
    ];
    let trs = [];
    for (let i = 0; i < tss.length; i++) {
      const ts = tss[i]!;
      const tr = await sharp(await skin.toBuffer())
        .pipe(sharp())
        .extract({
          width: ts[0]!,
          height: ts[1]!,
          left: ts[2]!,
          top: ts[3]!,
        })
        .extend({
          left: ts[4]!,
          top: ts[5]!,
          right: 16 - ts[4]! - ts[0]!,
          bottom: 16 - ts[5]! - ts[1]!,
          background: "#00000000",
        })
        .toBuffer();
      trs.push(tr);
    }

    image = image
      .composite(trs.map((val: any) => ({ input: val })))
      .pipe(sharp());

    image = image.resize(sizes, sizes, {
      fit: "fill",
      kernel: "nearest",
    });
    const buffer = await image.png().toBuffer({ resolveWithObject: false });

    // return `data:image/png;base64,${buffer?.toString("base64")}`;
    return buffer;
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
