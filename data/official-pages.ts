/*
 * Each perfume's own page on its brand's official site, by catalogue id, for the
 * shop's OFFICIAL link. Chanel and Le Labo use their Taiwan sites; Dior, Byredo and
 * Diptyque their US / international sites (they have no Taiwan product pages);
 * Jo Malone London only where its Taiwan site's page could be confirmed; Calvin Klein
 * its US site. Taken
 * from the brands' sitemaps (2026-10-07); perfumes not listed here link to the
 * brand's fragrance page instead.
 */
export const OFFICIAL_PAGES: Readonly<Record<string, string>> = {
  "cat-byredo-alto-astral-edp": "https://www.byredo.com/us_en/p/alto-astral-eau-de-parfum?sku=0065224761",
  "cat-byredo-animalique-edp": "https://www.byredo.com/us_en/p/animalique-eau-de-parfum?sku=0065205654",
  "cat-byredo-bal-d-afrique-edp": "https://www.byredo.com/us_en/p/bal-d-afrique-eau-de-parfum?sku=0065212491",
  "cat-byredo-bibliotheque-edp": "https://www.byredo.com/us_en/p/bibliotheque-eau-de-parfum",
  "cat-byredo-black-saffron-edp": "https://www.byredo.com/us_en/p/black-saffron-eau-de-parfum?sku=0065205642",
  "cat-byredo-blanche-edp": "https://www.byredo.com/us_en/p/blanche-eau-de-parfum?sku=0065212494",
  "cat-byredo-bois-obscur-extrait":
    "https://www.byredo.com/us_en/p/bois-obscur-night-veils-perfume-extract-70ml",
  "cat-byredo-casablanca-lily-extrait":
    "https://www.byredo.com/us_en/p/casablanca-lily-night-veils-perfume-extract-70ml",
  "cat-byredo-cuir-sellier-extrait":
    "https://www.byredo.com/us_en/p/cuir-sellier-night-veils-perfume-extract-70ml",
  "cat-byredo-future-memories-edp":
    "https://www.byredo.com/us_en/p/future-memories-eau-de-parfum?sku=0065240347",
  "cat-byredo-gypsy-water-edp": "https://www.byredo.com/us_en/p/gypsy-water-eau-de-parfum?sku=0065212495",
  "cat-byredo-inflorescence-edp": "https://www.byredo.com/us_en/p/inflorescence-eau-de-parfum",
  "cat-byredo-la-tulipe-edp": "https://www.byredo.com/us_en/p/la-tulipe-eau-de-parfum",
  "cat-byredo-m-mink-edp": "https://www.byredo.com/us_en/p/m-mink-eau-de-parfum",
  "cat-byredo-mojave-ghost-edp": "https://www.byredo.com/us_en/p/mojave-ghost-eau-de-parfum?sku=0065212492",
  "cat-byredo-oud-immortel-edp": "https://www.byredo.com/us_en/p/oud-immortel-eau-de-parfum",
  "cat-byredo-pulp-edp": "https://www.byredo.com/us_en/p/pulp-eau-de-parfum",
  "cat-byredo-rose-noir-edp": "https://www.byredo.com/us_en/p/rose-noir-eau-de-parfum",
  "cat-byredo-rose-of-no-man-s-land-edp":
    "https://www.byredo.com/us_en/p/rose-of-no-mans-land-eau-de-parfum?sku=0065212493",
  "cat-byredo-rose-of-no-man-s-land-parfum":
    "https://www.byredo.com/us_en/p/rose-of-no-mans-land-absolu-de-parfum?sku=0065221689",
  "cat-byredo-rouge-chaotique-extrait":
    "https://www.byredo.com/us_en/p/rouge-chaotique-night-veils-perfume-extract-70ml",
  "cat-byredo-sunday-cologne-edp": "https://www.byredo.com/us_en/p/sunday-cologne-eau-de-parfum",
  "cat-byredo-super-cedar-edp": "https://www.byredo.com/us_en/p/super-cedar-eau-de-parfum?sku=0065212496",
  "cat-byredo-vanille-antique-extrait":
    "https://www.byredo.com/us_en/p/vanille-antique-night-veils-perfume-extract-70ml",
  "cat-chanel-allure-edp": "https://www.chanel.com/tw/fragrance/p/112530/allure-eau-de-parfum-spray/",
  "cat-chanel-allure-homme-edition-blanche-edp":
    "https://www.chanel.com/tw/fragrance/p/127450/allure-homme-edition-blanche-eau-de-parfum-spray/",
  "cat-chanel-allure-homme-sport-eau-extreme-edp":
    "https://www.chanel.com/tw/fragrance/p/123560/allure-homme-sport-eau-extreme-eau-de-parfum-spray/",
  "cat-chanel-allure-homme-sport-superleggera-edp":
    "https://www.chanel.com/tw/fragrance/p/123410/allure-homme-sport-superleggera-eau-de-parfum-spray/",
  "cat-chanel-beige-edp":
    "https://www.chanel.com/tw/fragrance/p/122310/beige-eau-de-parfum-floral-intense-honeyed/",
  "cat-chanel-bleu-de-chanel-edp":
    "https://www.chanel.com/tw/fragrance/p/107350/bleu-de-chanel-eau-de-parfum-spray/",
  "cat-chanel-bleu-de-chanel-l-exclusif-parfum":
    "https://www.chanel.com/tw/fragrance/p/107210/bleu-de-chanel-lexclusif-parfum-spray/",
  "cat-chanel-bleu-de-chanel-parfum":
    "https://www.chanel.com/tw/fragrance/p/107190/bleu-de-chanel-parfum-spray/",
  "cat-chanel-chance-eau-fraiche-edp":
    "https://www.chanel.com/tw/fragrance/p/136140/chance-eau-fraiche-eau-de-parfum-spray/",
  "cat-chanel-chance-eau-splendide-edp":
    "https://www.chanel.com/tw/fragrance/p/136200/chance-eau-splendide-eau-de-parfum-spray/",
  "cat-chanel-chance-eau-tendre-edp":
    "https://www.chanel.com/tw/fragrance/p/126260/chance-eau-tendre-eau-de-parfum-spray/",
  "cat-chanel-chance-eau-tendre-edt":
    "https://www.chanel.com/tw/fragrance/p/126310/chance-eau-tendre-eau-de-toilette-spray/",
  "cat-chanel-chance-edp": "https://www.chanel.com/tw/fragrance/p/126420/chance-eau-de-parfum-spray/",
  "cat-chanel-chance-edt": "https://www.chanel.com/tw/fragrance/p/126450/chance-eau-de-toilette-spray/",
  "cat-chanel-coco-mademoiselle-crush-absolu":
    "https://www.chanel.com/tw/fragrance/p/116170/coco-mademoiselle-crush-absolu-ambery-intense/",
  "cat-chanel-coco-mademoiselle-edp":
    "https://www.chanel.com/tw/fragrance/p/116420/coco-mademoiselle-eau-de-parfum-spray/",
  "cat-chanel-coco-mademoiselle-intense-edp":
    "https://www.chanel.com/tw/fragrance/p/116650/coco-mademoiselle-eau-de-parfum-intense-spray/",
  "cat-chanel-coco-noir-edp": "https://www.chanel.com/tw/fragrance/p/113660/coco-noir-eau-de-parfum-spray/",
  "cat-chanel-gabrielle-chanel-edp":
    "https://www.chanel.com/tw/fragrance/p/120425/gabrielle-chanel-eau-de-parfum-spray/",
  "cat-chanel-gabrielle-chanel-essence-edp":
    "https://www.chanel.com/tw/fragrance/p/120620/gabrielle-chanel-essence-eau-de-parfum-spray/",
  "cat-chanel-gabrielle-chanel-parfum":
    "https://www.chanel.com/tw/fragrance/p/120040/gabrielle-chanel-parfum-spray/",
  "cat-chanel-gardenia-edp":
    "https://www.chanel.com/tw/fragrance/p/122210/gardenia-eau-de-parfum-floral-bouquet-intense/",
  "cat-chanel-n-19-edp": "https://www.chanel.com/tw/fragrance/p/119530/n19-eau-de-parfum-spray/",
  "cat-chanel-n-22-edp":
    "https://www.chanel.com/tw/fragrance/p/122220/n22-eau-de-parfum-floral-powdery-aldehydic/",
  "cat-chanel-n-5-eau-premiere-edp":
    "https://www.chanel.com/tw/fragrance/p/105340/n5-eau-premiere-eau-de-parfum-spray/",
  "cat-chanel-n-5-edp": "https://www.chanel.com/tw/fragrance/p/125530/n5-eau-de-parfum-spray/",
  "cat-chanel-n-5-l-eau-edt": "https://www.chanel.com/tw/fragrance/p/105520/n5-leau-eau-de-toilette-spray/",
  "cat-chanel-paris-paris-les-eaux-de-chanel-edt":
    "https://www.chanel.com/tw/fragrance/p/102650/paris-paris-les-eaux-de-chanel-eau-de-toilette-spray/",
  "cat-chanel-paris-riviera-les-eaux-de-chanel-edt":
    "https://www.chanel.com/tw/fragrance/p/102430/paris-riviera-les-eaux-de-chanel-eau-de-toilette-spray/",
  "cat-dior-bois-talisman-edp": "https://www.dior.com/en_us/beauty/products/bois-talisman-Y0998027.html",
  "cat-dior-cuir-saddle-edp": "https://www.dior.com/en_us/beauty/products/cuir-saddle-Y0000167.html",
  "cat-dior-dior-addict-edp": "https://www.dior.com/en_us/beauty/products/dior-addict-Y0291000.html",
  "cat-dior-dior-homme-edp": "https://www.dior.com/en_us/beauty/products/dior-homme-Y0996159.html",
  "cat-dior-dior-paradise-edp": "https://www.dior.com/en_us/beauty/products/dior-paradise-Y0000235.html",
  "cat-dior-eau-sauvage-edt":
    "https://www.dior.com/en_us/beauty/products/eau-sauvage-eau-de-toilette-Y0097001.html",
  "cat-dior-fahrenheit-edt":
    "https://www.dior.com/en_us/beauty/products/fahrenheit-eau-de-toilette-Y0066001.html",
  "cat-dior-gris-dior-edp": "https://www.dior.com/en_us/beauty/products/gris-dior-Y0840550.html",
  "cat-dior-j-adore-edp":
    "https://www.dior.com/en_us/beauty/products/j%E2%80%99adore-eau-de-parfum-Y0998031.html",
  "cat-dior-j-adore-l-or-parfum": "https://www.dior.com/en_us/beauty/products/lor-de-jadore-Y0997096.html",
  "cat-dior-miss-dior-edp":
    "https://www.dior.com/en_us/beauty/products/miss-dior-eau-de-parfum-Y0000393.html",
  "cat-dior-miss-dior-essence-parfum":
    "https://www.dior.com/en_us/beauty/products/miss-dior-essence-Y0000088.html",
  "cat-dior-miss-dior-parfum": "https://www.dior.com/en_us/beauty/products/miss-dior-parfum-Y0997166.html",
  "cat-dior-poison-edp": "https://www.dior.com/en_us/beauty/products/poison-Y0863150.html",
  "cat-dior-rose-star-edp": "https://www.dior.com/en_us/beauty/products/rose-star-Y0000087.html",
  "cat-dior-sauvage-edp": "https://www.dior.com/en_us/beauty/products/sauvage-eau-de-parfum-Y0785220.html",
  "cat-dior-sauvage-edt": "https://www.dior.com/en_us/beauty/products/sauvage-eau-de-toilette-Y0685240.html",
  "cat-dior-sauvage-extrait-extrait":
    "https://www.dior.com/en_us/beauty/products/sauvage-extrait-Y0000281.html",
  "cat-dior-sauvage-parfum": "https://www.dior.com/en_us/beauty/products/sauvage-parfum-Y0998004.html",
  "cat-diptyque-34-boulevard-saint-germain-edp":
    "https://diptyqueparis.com/products/eau-de-parfum-34-boulevard-saint-germain-34bedp75v1",
  "cat-diptyque-benjoin-boheme-intense-edp":
    "https://diptyqueparis.com/products/eau-de-parfum-benjoin-boheme-bohemep75c",
  "cat-diptyque-do-son-edp": "https://diptyqueparis.com/products/eau-de-parfum-do-son-dosonp75cv1",
  "cat-diptyque-eau-capitale-edp":
    "https://diptyqueparis.com/products/eau-de-parfum-eau-capitale-capitap75cv1",
  "cat-diptyque-eau-de-lierre-edt":
    "https://diptyqueparis.com/products/eau-de-toilette-eau-de-lierre-lierre100v3",
  "cat-diptyque-eau-de-minthe-edp":
    "https://diptyqueparis.com/products/eau-de-parfum-eau-de-minthe-mintp75cv2",
  "cat-diptyque-eau-de-neroli-edt":
    "https://diptyqueparis.com/products/eau-de-toilette-eau-de-neroli-nero100v2",
  "cat-diptyque-eau-des-sens-edt":
    "https://diptyqueparis.com/products/eau-de-toilette-eau-des-sens-sens100v2",
  "cat-diptyque-eau-duelle-edp": "https://diptyqueparis.com/products/eau-de-parfum-eau-duelle-duellep75cv1",
  "cat-diptyque-eau-nabati-intense-edp":
    "https://diptyqueparis.com/products/eau-de-parfum-eau-nabati-nabatip75c",
  "cat-diptyque-eau-rihla-intense-edp":
    "https://diptyqueparis.com/products/eau-de-parfum-eau-rihla-meastp75c",
  "cat-diptyque-eau-rose-edp": "https://diptyqueparis.com/products/eau-de-parfum-eau-rose-rosep75c",
  "cat-diptyque-fleur-de-peau-edp":
    "https://diptyqueparis.com/products/eau-de-parfum-fleur-de-peau-fleurp75cv1",
  "cat-diptyque-l-eau-papier-edt": "https://diptyqueparis.com/products/eau-de-toilette-eau-papier-papier50",
  "cat-diptyque-l-ombre-dans-l-eau-edt":
    "https://diptyqueparis.com/products/eau-de-toilette-ombre-dans-eau-ombre50v3",
  "cat-diptyque-lilyphea-edp": "https://diptyqueparis.com/products/eau-de-parfum-lilyphea-lilyphea100",
  "cat-diptyque-orpheon-edp": "https://diptyqueparis.com/products/eau-de-parfum-orpheon-orphp75c",
  "cat-diptyque-philosykos-edp": "https://diptyqueparis.com/products/eau-de-parfum-philosykos-philop75cv1",
  "cat-diptyque-tam-dao-edp": "https://diptyqueparis.com/products/eau-de-parfum-tam-dao-tamdaop75cv1",
  "cat-diptyque-tempo-edp": "https://diptyqueparis.com/products/eau-de-parfum-tempo-tempop75cv1",
  "cat-diptyque-vetyverio-edp": "https://diptyqueparis.com/products/eau-de-parfum-vetyverio-vetyp75cv1",
  "cat-diptyque-volutes-edp": "https://diptyqueparis.com/products/eau-de-parfum-volutes-volutep75cv1",
  "cat-jo-malone-english-pear-freesia-edc":
    "https://www.jomalone.com.tw/product/25946/118127/colognes/english-pear-freesia-cologne",
  "cat-jo-malone-oud-bergamot-edc":
    "https://www.jomalone.com.tw/product/25946/12557/colognes/oud-bergamot-cologne-intense",
  "cat-jo-malone-wild-bluebell-edc":
    "https://www.jomalone.com.tw/product/25946/137121/colognes/wild-bluebell-cologne",
  "cat-jo-malone-wood-sage-sea-salt-edc":
    "https://www.jomalone.com.tw/product/25946/137092/colognes/wood-sage-sea-salt-cologne",
  "cat-le-labo-another-13-edp": "https://www.lelabofragrances.com.tw/another-13.html",
  "cat-le-labo-baie-19-edp": "https://www.lelabofragrances.com.tw/baie-19.html",
  "cat-le-labo-bergamote-22-edp": "https://www.lelabofragrances.com.tw/bergamote-22.html",
  "cat-le-labo-fleur-d-oranger-27-edp": "https://www.lelabofragrances.com.tw/fleur-doranger-27.html",
  "cat-le-labo-gaiac-10-edp": "https://www.lelabofragrances.com.tw/gaiac-10.html",
  "cat-le-labo-jasmin-17-edp": "https://www.lelabofragrances.com.tw/jasmin-17.html",
  "cat-le-labo-labdanum-18-edp": "https://www.lelabofragrances.com.tw/labdanum-18.html",
  "cat-le-labo-lys-41-edp": "https://www.lelabofragrances.com.tw/lys-41.html",
  "cat-le-labo-musc-25-edp": "https://www.lelabofragrances.com.tw/musc-25.html",
  "cat-le-labo-neroli-36-edp": "https://www.lelabofragrances.com.tw/neroli-36.html",
  "cat-le-labo-patchouli-24-edp": "https://www.lelabofragrances.com.tw/patchouli-24.html",
  "cat-le-labo-poivre-23-edp": "https://www.lelabofragrances.com.tw/poivre-23.html",
  "cat-le-labo-rose-31-edp": "https://www.lelabofragrances.com.tw/rose-31.html",
  "cat-le-labo-santal-33-edp": "https://www.lelabofragrances.com.tw/santal-33.html",
  "cat-le-labo-the-matcha-26-edp": "https://www.lelabofragrances.com.tw/th-matcha-26.html",
  "cat-le-labo-the-noir-29-edp": "https://www.lelabofragrances.com.tw/th-noir-29.html",
  "cat-le-labo-tubereuse-40-edp": "https://www.lelabofragrances.com.tw/tubereuse-40.html",
  "cat-le-labo-vanille-44-edp": "https://www.lelabofragrances.com.tw/vanille-44.html",
  "cat-le-labo-ylang-49-edp": "https://www.lelabofragrances.com.tw/ylang-49.html",
  "cat-tamburins-bather-in-the-lake": "https://www.tamburins.com/en/item/1695801553/",
  "cat-tamburins-berga-sandal": "https://www.tamburins.com/en/item/1662463458/",
  "cat-tamburins-blue-hinoki": "https://www.tamburins.com/en/item/12001657/",
  "cat-tamburins-bottari": "https://www.tamburins.com/en/item/12001506/",
  "cat-tamburins-brown": "https://www.tamburins.com/en/item/1695801560/",
  "cat-tamburins-chamo": "https://www.tamburins.com/en/item/1662462471/",
  "cat-tamburins-evening-glow": "https://www.tamburins.com/en/item/12001384/",
  "cat-tamburins-lale": "https://www.tamburins.com/en/item/1662463206/",
  "cat-tamburins-late-autumn": "https://www.tamburins.com/en/item/1695801557/",
  "cat-tamburins-pumkini": "https://www.tamburins.com/en/item/1695801508/",
  "cat-tamburins-puppy": "https://www.tamburins.com/en/item/12001684/",
  "cat-tamburins-summer-tails": "https://www.tamburins.com/en/item/12002398/",
  "cat-tamburins-sunshine": "https://www.tamburins.com/en/item/12001681/",
  "cat-tamburins-unknown-oud": "https://www.tamburins.com/en/item/1662463782/",
  "cat-tamburins-white-darjeeling": "https://www.tamburins.com/en/item/1662464240/",
  // Calvin Klein's US site (its Taiwan site sells no fragrance), from its fragrance pages (2026-10-07).
  "cat-calvin-klein-ck-one-edt": "https://www.calvinklein.us/en/women/fragrance/fragrance/ck-one/10740-000.html",
  "cat-calvin-klein-eternity-for-women-edp": "https://www.calvinklein.us/en/women/fragrance/fragrance/eternity-eau-de-parfum-for-women/LX000744-000.html",
  "cat-calvin-klein-eternity-for-women-suede-essence-parfum": "https://www.calvinklein.us/en/women/fragrance/fragrance/eternity-suede-essence-parfum-for-women/LX002152-000.html",
  "cat-calvin-klein-euphoria-signature-elixir": "https://www.calvinklein.us/en/women/fragrance/fragrance/euphoria-signature-elixir/LX002159-000.html",
  "cat-calvin-klein-euphoria-magnetic-elixir": "https://www.calvinklein.us/en/women/fragrance/fragrance/euphoria-magnetic-elixir/LX001963-000.html",
  "cat-calvin-klein-euphoria-bold-elixir": "https://www.calvinklein.us/en/women/fragrance/fragrance/euphoria-bold-elixir/LX001959-000.html",
  "cat-calvin-klein-euphoria-solar-elixir": "https://www.calvinklein.us/en/women/fragrance/fragrance/euphoria-solar-elixir/LX001967-000.html",
  "cat-calvin-klein-eternity-for-men-edt": "https://www.calvinklein.us/en/men/fragrance/fragrance/eternity-eau-de-toilette-for-men/LX000145-000.html",
  "cat-calvin-klein-eternity-for-men-parfum": "https://www.calvinklein.us/en/men/fragrance/fragrance/eternity-parfum-for-men/LX000724-000.html",
  "cat-calvin-klein-eternity-for-men-edp": "https://www.calvinklein.us/en/men/fragrance/fragrance/eternity-for-men-eau-de-parfum/LX000725-000.html",
  "cat-calvin-klein-obsession-for-men-edt": "https://www.calvinklein.us/en/men/fragrance/fragrance/obsession-eau-de-toilette-for-men/LX000709-000.html",
  "cat-calvin-klein-defy-edt": "https://www.calvinklein.us/en/men/fragrance/fragrance/defy-eau-de-toilette/YS99350D-000.html",
  "cat-calvin-klein-defy-edp": "https://www.calvinklein.us/en/men/fragrance/fragrance/defy-eau-de-parfum/LX000102-000.html",
  "cat-calvin-klein-defy-parfum": "https://www.calvinklein.us/en/men/fragrance/fragrance/defy-parfum/LX000315-000.html",
};
