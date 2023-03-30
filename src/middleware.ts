import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/
const locales = ["en", "ru", "uk"];

export function middleware(req: NextRequest) {
    if (
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.includes('/api/')
        || PUBLIC_FILE.test(req.nextUrl.pathname)
    ) {
        return
    }

    if (req.nextUrl.locale === req.nextUrl.defaultLocale) {
        if (req.cookies.has('NEXT_LOCALE')
        && locales.includes(req.cookies.get('NEXT_LOCALE')!.value)) {
            const locale = req.cookies.get('NEXT_LOCALE')?.value;
            return NextResponse.rewrite(
                new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
            );
        }
    } else {
        const locale = req.nextUrl.locale;
        const response = NextResponse.next()
        response.cookies.set('NEXT_LOCALE', locale);
        return response;
    }
    // if (locales.includes(req.nextUrl.locale)) {
    //     console.log("middleware read");
    //     const locale = req.nextUrl.locale;
    //     const response = NextResponse.next()
    //     response.cookies.set('NEXT_LOCALE', locale);
    //     return response;
    // } else {
    //     const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en'
    //     console.log(locale);
    //     console.log("middleware set locale");
    //     return NextResponse.redirect(
    //         new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    //     )
    // }
}