import sharp from "sharp";
import Cloth from "./Cloth";

export default class Hair implements Cloth {
    private image: sharp.Sharp = sharp();

    constructor () {
        this.image = sharp({
            create: {
                width: 320,
                height: 160,
                channels: 4,
                background: "#00000000"
            }
        })
        

        
    }
    
    async getBuffer(): Promise<Buffer> {
        return await this.image.toBuffer({
            resolveWithObject: false
        });
    }
    async getDataUrl(): Promise<String> {
        return `data:image/png;base64,${(await this.getBuffer()).toString("base64")}`;
    }
}