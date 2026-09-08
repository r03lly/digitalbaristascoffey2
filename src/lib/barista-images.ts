import robotLogo from "@/assets/robot-logo.png";
import heroDrink from "@/assets/hero-drink.jpg";
import beansTexture from "@/assets/beans-texture.jpg";
import baseEspresso from "@/assets/base-espresso.jpg";
import baseAmericano from "@/assets/base-americano.jpg";
import baseLatte from "@/assets/base-latte.jpg";
import baseColdbrew from "@/assets/base-coldbrew.jpg";
import baseMatcha from "@/assets/base-matcha.jpg";
import baseChocolate from "@/assets/base-chocolate.jpg";
import avatarUser from "@/assets/avatar-user.jpg";
import promoSummer from "@/assets/promo-summer.jpg";
import drinkCinnamonCaramel from "@/assets/drink-cinnamon-caramel.jpg";
import drinkCaramelNutty from "@/assets/drink-caramel-nutty.jpg";
import qrisCode from "@/assets/qris-code.jpg";
import menuButterscotch from "@/assets/menu-butterscotch.jpg";
import menuCaramel from "@/assets/menu-caramel.jpg";
import menuHazelnut from "@/assets/menu-hazelnut.jpg";
import menuPandan from "@/assets/menu-pandan.jpg";
import menuAren from "@/assets/menu-aren.jpg";
import menuVanilla from "@/assets/menu-vanilla.jpg";
import menuSignature from "@/assets/menu-signature.jpg";
import menuClassicSweet from "@/assets/menu-classic-sweet.jpg";
import menuChocoButterscotch from "@/assets/menu-choco-butterscotch.jpg";
import menuChocoCaramel from "@/assets/menu-choco-caramel.jpg";
import menuChocoVanilla from "@/assets/menu-choco-vanilla.jpg";
import menuChocoPandan from "@/assets/menu-choco-pandan.jpg";
import menuBrownMatcha from "@/assets/menu-brown-matcha.jpg";
import menuMatcha from "@/assets/menu-matcha.jpg";
import menuRedVelvet from "@/assets/menu-red-velvet.jpg";
import menuStrawberry from "@/assets/menu-strawberry.jpg";
import foodLempeng from "@/assets/food-lempeng.jpg";
import foodTapaiGoreng from "@/assets/food-tapai-goreng.jpg";
import foodTahuBakso from "@/assets/food-tahu-bakso.jpg";
import foodTempeMendoan from "@/assets/food-tempe-mendoan.jpg";
import foodPisangAroma from "@/assets/food-pisang-aroma.jpg";
import foodTahuKrispy from "@/assets/food-tahu-krispy.jpg";
import foodPisangRoll from "@/assets/food-pisang-roll.jpg";
import foodFrenchFries from "@/assets/food-french-fries.jpg";
import foodSingkongGoreng from "@/assets/food-singkong-goreng.jpg";
import foodCheesecakeOriginal from "@/assets/food-cheesecake-original.jpg";
import foodCheesecakeBlueberry from "@/assets/food-cheesecake-blueberry.jpg";
import foodCheesecakeChocolate from "@/assets/food-cheesecake-chocolate.jpg";
import foodCheesecakeLotus from "@/assets/food-cheesecake-lotus.jpg";

export {
  robotLogo,
  heroDrink,
  beansTexture,
  avatarUser,
  promoSummer,
  drinkCinnamonCaramel,
  drinkCaramelNutty,
  qrisCode,
};

export const BASE_IMAGES = {
  espresso: baseEspresso,
  americano: baseAmericano,
  latte: baseLatte,
  coldbrew: baseColdbrew,
  matcha: baseMatcha,
  chocolate: baseChocolate,
} satisfies Record<string, string>;

export const MENU_IMAGES: Record<string, string> = {
  butterscotch: menuButterscotch,
  caramel: menuCaramel,
  hazelnut: menuHazelnut,
  pandan: menuPandan,
  aren: menuAren,
  vanilla: menuVanilla,
  "scoffey-signature": menuSignature,
  "classic-sweet": menuClassicSweet,
  "choco-butterscotch": menuChocoButterscotch,
  "choco-caramel": menuChocoCaramel,
  "choco-vanilla": menuChocoVanilla,
  "choco-pandan": menuChocoPandan,
  "brown-matcha": menuBrownMatcha,
  matcha: menuMatcha,
  "red-velvet": menuRedVelvet,
  strawberry: menuStrawberry,
  "food-lempeng": foodLempeng,
  "food-tapai-goreng": foodTapaiGoreng,
  "food-tahu-bakso": foodTahuBakso,
  "food-tempe-mendoan": foodTempeMendoan,
  "food-pisang-aroma": foodPisangAroma,
  "food-tahu-krispy": foodTahuKrispy,
  "food-pisang-roll": foodPisangRoll,
  "food-french-fries": foodFrenchFries,
  "food-singkong-goreng": foodSingkongGoreng,
  "food-cheesecake-original": foodCheesecakeOriginal,
  "food-cheesecake-blueberry": foodCheesecakeBlueberry,
  "food-cheesecake-chocolate": foodCheesecakeChocolate,
  "food-cheesecake-lotus": foodCheesecakeLotus,
};

export const drinkImage = (id?: string | null) =>
  (id && (MENU_IMAGES[id] ?? (BASE_IMAGES as Record<string, string>)[id])) || drinkCaramelNutty;
