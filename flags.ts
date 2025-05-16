import { Banner, DyeColor, Pattern } from "mcbanners";

(async () => {
  const b = new Banner(DyeColor.WHITE)
    .add(Pattern.STRIPE_BOTTOM, DyeColor.YELLOW)
    .add(Pattern.STRIPE_TOP, DyeColor.LIGHT_BLUE);

  console.log(b.toString());
})();
