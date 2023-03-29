export default interface Cloth {
    getBuffer (): Promise<Buffer> | Buffer;
}