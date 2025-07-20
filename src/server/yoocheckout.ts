import { YooCheckout } from "@a2seven/yoo-checkout";
import { env } from "~/env/server.mjs";

const yookassa = new YooCheckout({
  shopId: env.YOOKASSA_SHOP_ID,
  secretKey: env.YOOKASSA_SECRET_KEY,
});

export default yookassa;
