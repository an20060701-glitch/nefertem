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
  "cat-calvin-klein-ck-one-edt":
    "https://www.calvinklein.us/en/women/fragrance/fragrance/ck-one/10740-000.html",
  "cat-calvin-klein-eternity-for-women-edp":
    "https://www.calvinklein.us/en/women/fragrance/fragrance/eternity-eau-de-parfum-for-women/LX000744-000.html",
  "cat-calvin-klein-eternity-for-women-suede-essence-parfum":
    "https://www.calvinklein.us/en/women/fragrance/fragrance/eternity-suede-essence-parfum-for-women/LX002152-000.html",
  "cat-calvin-klein-euphoria-signature-elixir":
    "https://www.calvinklein.us/en/women/fragrance/fragrance/euphoria-signature-elixir/LX002159-000.html",
  "cat-calvin-klein-euphoria-magnetic-elixir":
    "https://www.calvinklein.us/en/women/fragrance/fragrance/euphoria-magnetic-elixir/LX001963-000.html",
  "cat-calvin-klein-euphoria-bold-elixir":
    "https://www.calvinklein.us/en/women/fragrance/fragrance/euphoria-bold-elixir/LX001959-000.html",
  "cat-calvin-klein-euphoria-solar-elixir":
    "https://www.calvinklein.us/en/women/fragrance/fragrance/euphoria-solar-elixir/LX001967-000.html",
  "cat-calvin-klein-eternity-for-men-edt":
    "https://www.calvinklein.us/en/men/fragrance/fragrance/eternity-eau-de-toilette-for-men/LX000145-000.html",
  "cat-calvin-klein-eternity-for-men-parfum":
    "https://www.calvinklein.us/en/men/fragrance/fragrance/eternity-parfum-for-men/LX000724-000.html",
  "cat-calvin-klein-eternity-for-men-edp":
    "https://www.calvinklein.us/en/men/fragrance/fragrance/eternity-for-men-eau-de-parfum/LX000725-000.html",
  "cat-calvin-klein-obsession-for-men-edt":
    "https://www.calvinklein.us/en/men/fragrance/fragrance/obsession-eau-de-toilette-for-men/LX000709-000.html",
  "cat-calvin-klein-defy-edt":
    "https://www.calvinklein.us/en/men/fragrance/fragrance/defy-eau-de-toilette/YS99350D-000.html",
  "cat-calvin-klein-defy-edp":
    "https://www.calvinklein.us/en/men/fragrance/fragrance/defy-eau-de-parfum/LX000102-000.html",
  "cat-calvin-klein-defy-parfum":
    "https://www.calvinklein.us/en/men/fragrance/fragrance/defy-parfum/LX000315-000.html",
  // An's brand lists (perfume_brands*.md): pages that opened as the product (2026-10-07).
  "cat2-100bon-rose-and-black-pepper-edp": "https://www.100bon.com/en/products/rose-black-pepper",
  "cat2-100bon-zeste-d-agrumes-edp": "https://www.100bon.com/en/products/eau-de-parfum-zeste-agrumes",
  "cat2-100bon-bois-oriental-ylang-edp": "https://www.100bon.com/en/products/bois-oriental-ylang",
  "cat2-100bon-ebene-et-ambre-edp": "https://www.100bon.com/en/products/ebene-ambre",
  "cat2-100bon-secret-garden-edt": "https://www.100bon.com/en/products/secret-garden-eau-de-toilette",
  "cat2-100bon-nuage-de-coton-edt": "https://www.100bon.com/en/products/nuage-de-coton-eau-de-toilette",
  "cat2-acqua-di-parma-colonia-edc": "https://www.acquadiparma.com/en/us/colonia/COLONIAEDCRP.html",
  "cat2-acqua-di-parma-buongiorno-edp": "https://www.acquadiparma.com/en/us/buongiorno/BUONGIORNOEDP.html",
  "cat2-acqua-di-parma-bergamotto-la-spugnatura-edp":
    "https://www.acquadiparma.com/en/us/bergamotto-la-spugnatura%C2%A0/BERGAMOTTOLASPUGNATURAEDP.html",
  "cat2-acqua-di-parma-quercia-edp": "https://www.acquadiparma.com/en/kr/quercia/QUERCIAEDPSPRAY.html",
  "cat2-acqua-di-parma-arancia-di-capri-edt":
    "https://www.acquadiparma.com/en/us/arancia-di-capri/ARANCIAEDTSPRAY.html?dwvar_ARANCIAEDTSPRAY_size=30ML",
  "cat2-acqua-di-parma-lily-of-the-valley-edp":
    "https://www.acquadiparma.com/en/us/lily-of-the-valley/LILYOFTHEVALLEYEDP.html",
  "cat2-acqua-di-parma-note-di-colonia-ii-edc":
    "https://www.acquadiparma.com/en/us/note-di-colonia-ii/NDCIIEDC.html",
  "cat2-acqua-di-parma-note-di-colonia-iv-edc":
    "https://www.acquadiparma.com/en/us/note-di-colonia-iv/NDCIVEDC.html",
  "cat2-juliette-has-a-gun-juliette-edp": "https://us.juliettehasagun.com/products/juliette",
  "cat2-juliette-has-a-gun-lust-for-sun-edp": "https://us.juliettehasagun.com/products/lust-for-sun",
  "cat2-juliette-has-a-gun-not-a-perfume-edp":
    "https://www.juliettehasagun.com/en/products/not-a-perfume-parfum",
  "cat2-juliette-has-a-gun-pear-inc-edp": "https://us.juliettehasagun.com/products/pear-inc",
  "cat2-juliette-has-a-gun-mmmm-edp": "https://us.juliettehasagun.com/products/mmmm",
  "cat2-juliette-has-a-gun-powder-love-edp": "https://us.juliettehasagun.com/products/powder-love",
  "cat2-juliette-has-a-gun-magnolia-bliss-edp": "https://us.juliettehasagun.com/products/magnolia-bliss",
  "cat2-juliette-has-a-gun-lili-fantasy-edp":
    "https://us.juliettehasagun.com/products/lili-fantasy-travel-spray",
  "cat2-chloe-nomade-nuit-d-egypte-edp":
    "https://www.chloe.com/en-us/p/fragrances/eau-de-parfum/CHCA50186025.html",
  "cat2-tom-ford-soleil-neige-edp": "https://www.tomfordbeauty.com/products/soleil-neige-eau-de-parfum",
  "cat2-tom-ford-noir-extreme-edp": "https://www.tomfordbeauty.com/products/noir-extreme-eau-de-parfum",
  "cat2-tom-ford-vanille-fatale-edp": "https://www.tomfordbeauty.com/products/vanille-fatale-eau-de-parfum",
  "cat2-tom-ford-fucking-fabulous-edp":
    "https://www.tomfordbeauty.com/products/fucking-fabulous-eau-de-parfum",
  "cat2-tom-ford-noir-extreme-parfum": "https://www.tomfordbeauty.com/products/noir-extreme-parfum",
  "cat2-tom-ford-fucking-fabulous-parfum": "https://www.tomfordbeauty.com/products/fucking-fabulous-parfum",
  "cat2-tom-ford-oud-wood-edp": "https://www.tomfordbeauty.com/products/oud-wood-eau-de-parfum",
  "cat2-tom-ford-grey-vetiver-parfum": "https://www.tomfordbeauty.com/products/grey-vetiver-parfum",
  "cat2-tom-ford-noir-de-noir-edp": "https://www.tomfordbeauty.com/products/noir-de-noir-eau-de-parfum",
  "cat2-tom-ford-black-orchid-reserve-parfum":
    "https://www.tomfordbeauty.com/products/black-orchid-reserve-parfum",
  "cat2-tom-ford-ebene-fume-edp": "https://www.tomfordbeauty.com/products/ebene-fume-eau-de-parfum",
  "cat2-mancera-black-gold": "https://www.manceraparfums.com/en/oriental/60-black-gold.html",
  "cat2-mancera-wind-wood-edp": "https://www.manceraparfums.com/en/fougere/32-wind-wood.html",
  "cat2-mancera-feminity-edp": "https://www.manceraparfums.com/en/fruity/111-feminity.html",
  "cat2-mancera-silver-blue-edp": "https://www.manceraparfums.com/en/gourmand/92-silver-blue.html",
  "cat2-mancera-lemon-line-edp": "https://www.manceraparfums.com/en/fruity/30-lemon-line.html",
  "cat2-mancera-cherry-cherry-edp": "https://www.manceraparfums.com/en/fruity/129-cherry-cherry.html",
  "cat2-mancera-velvet-vanilla-edp": "https://www.manceraparfums.com/en/gourmand/49-velvet-vanilla.html",
  "cat2-mancera-lovely-garden-edp": "https://www.manceraparfums.com/en/oriental/98-lovely-graden.html",
  "cat2-mancera-sicily-edp": "https://www.manceraparfums.com/esp/en/fruity/53-sicily.html",
  "cat2-mancera-of-the-wild-edp": "https://www.manceraparfums.com/en/gourmand/115-of-the-wild.html",
  "cat2-mancera-french-riviera-edp": "https://www.manceraparfums.com/esp/en/marine/106-french-riviera.html",
  "cat2-mancera-intense-red-tobacco-extrait":
    "https://www.manceraparfums.com/civ/en/oriental/118-intense-red-tobacco.html",
  "cat2-fragonard-fragonard-edt": "https://www.fragonard.com/en-int/fragonard/fragonard-p-2904-o-1491.htm",
  "cat2-fragonard-fragonard-parfum": "https://www.fragonard.com/en-us/fragonard/fragonard-p-2906-o-1494.htm",
  "cat2-fragonard-belle-de-paris-edp": "https://www.fragonard.com/en-int/-p-2272.htm",
  "cat2-prada-l-homme-prada-edt":
    "https://www.prada.com/us/en/p/lhomme-prada-edt-50-ml/2A1266_2HC0_F0Z99_P_ML050",
  "cat2-prada-paradoxe-intense-edp":
    "https://www.prada.com/sa/en/p/paradoxe-intense-edp-90ml/1A1352_2HEC_F0Z99_P_ML090",
  "cat2-loewe-loewe-7-edt":
    "https://www.loewe.com/int/en/men/fragrances/loewe-7-eau-de-toilette-100-ml/P000011X20-0000.html",
  "cat2-loewe-loewe-001-woman-edp":
    "https://www.loewe.com/int/en/women/fragrance/loewe-001-woman-eau-de-parfum-50-ml/P000487X04-0000.html",
  "cat2-loewe-loewe-001-man-edp":
    "https://www.loewe.com/int/en/men/fragrances/loewe-001-man-eau-de-parfum-50-ml/P000487X03-0000.html",
  "cat2-loewe-loewe-solo-edt":
    "https://www.loewe.com/int/en/men/fragrances/loewe-solo-eau-de-toilette-50-ml/P000011X52-0000.html",
  "cat2-loewe-loewe-solo-ella-edp":
    "https://www.loewe.com/int/en/women/fragrance/loewe-solo-ella-eau-de-parfum-50-ml/P000011X31-0000.html",
  "cat2-loewe-loewe-aire-sutileza-edt":
    "https://www.loewe.com/int/en/women/fragrance/loewe-aire-sutileza-eau-de-toilette-50-ml/P000011X50-0000.html",
  "cat2-maison-margiela-replica-jazz-club-edt":
    "https://www.maisonmargiela.com/wx/replica-jazz-club-eau-de-toilette-%7C-maison-margiela-S33YX0016S10930001.html",
  "cat2-maison-margiela-replica-autumn-vibes-edt":
    "https://www.maisonmargiela.com/wx/replica-autumn-vibes-eau-de-toilette-S33YX0128SV0049961.html",
  "cat2-maison-margiela-replica-from-the-garden-edt":
    "https://www.maisonmargiela.com/en-tw/replica-from-the-garden-eau-de-toilette-S33YX0177M10053961.html",
  "cat2-mercedes-benz-sign-edp": "https://parfums.mercedes-benz.com/en/products/sign",
  "cat2-mercedes-benz-amg-red-thrill-edp":
    "https://parfums.mercedes-benz.com/en/products/mercedes-benz-amg-red",
  "cat2-mercedes-benz-land-edp": "https://parfums.mercedes-benz.com/en/products/land",
  "cat2-mercedes-benz-sea-edp": "https://parfums.mercedes-benz.com/en/products/sea",
  "cat2-mercedes-benz-air-edp": "https://parfums.mercedes-benz.com/en/products/air",
  "cat2-mercedes-benz-woman-edp": "https://parfums.mercedes-benz.com/en/products/woman-edp",
  "cat2-mercedes-benz-for-women-floral-fantasy-edt":
    "https://parfums.mercedes-benz.com/en/products/mercedes-benz-for-women-floral-fantasy-edition",
  "cat2-mercedes-benz-man-edt": "https://parfums.mercedes-benz.com/en/products/man",
  "cat2-mercedes-benz-the-move-edt": "https://parfums.mercedes-benz.com/en/products/the-move",
  "cat2-mercedes-benz-man-private-edp": "https://parfums.mercedes-benz.com/en/products/man-private",
  "cat2-mercedes-benz-maybach-charismatic-rose-edp":
    "https://parfums.mercedes-benz.com/en/products/recharge-maybach-charismatic-rose",
  "cat2-mfk-petit-matin-edp":
    "https://www.franciskurkdjian.com/int-en/p/petit-matin-eau-de-parfum-RA122421.html",
  "cat2-mfk-leau-a-la-rose-edt":
    "https://www.franciskurkdjian.com/int-en/p/leau-a-la-rose-eau-de-toilette-RA133021.html",
  "cat2-mfk-kurky-edp": "https://www.franciskurkdjian.com/int-en/p/kurky-eau-de-parfum-RA12402.html",
  "cat2-byredo-de-los-santos-edp": "https://www.byredo.com/us_en/p/de-los-santos-eau-de-parfum",
  "cat2-byredo-eyes-closed-edp": "https://www.byredo.com/us_en/p/eyes-closed-eau-de-parfum",
  "cat2-byredo-mojave-ghost-absolu-parfum": "https://www.byredo.com/us_en/p/mojave-absolu",
  "cat2-byredo-bal-dafrique-absolu-parfum": "https://www.byredo.com/us_en/p/bal-dafrique-absolu-de-parfum",
  "cat2-byredo-blanche-absolu-parfum": "https://www.byredo.com/us_en/p/blanche-absolu-de-parfum",
  "cat2-byredo-rose-of-no-mans-land-absolu-parfum":
    "https://www.byredo.com/us_en/p/rose-of-no-mans-land-absolu-de-parfum",
  "cat2-miller-harris-la-fumee-alexandrie-edp":
    "https://www.millerharris.com/products/la-fumee-alexandrie-eau-de-parfum",
  "cat2-mfk-724-edp": "https://www.franciskurkdjian.com/int-en/p/724-eau-de-parfum-RA12352.html",
  "cat2-mfk-a-la-rose-edp": "https://www.franciskurkdjian.com/int-en/p/a-la-rose-eau-de-parfum-RA128722.html",
  "cat2-mfk-aqua-vitae-cologne-forte-edp":
    "https://www.franciskurkdjian.com/int-en/p/aqua-vitae-cologne-forte-eau-de-parfum-RA12332.html",
  "cat2-mfk-aqua-universalis-edt":
    "https://www.franciskurkdjian.com/int-en/p/aqua-universalis-eau-de-toilette-RA130321.html",
  "cat2-mfk-amyris-femme-edp":
    "https://www.franciskurkdjian.com/int-en/p/amyris-femme-eau-de-parfum-RA121322.html",
  "cat2-mfk-amyris-femme-extrait":
    "https://www.franciskurkdjian.com/int-en/p/amyris-femme-extrait-de-parfum-RA141322.html",
  "cat2-mfk-amyris-homme-edt":
    "https://www.franciskurkdjian.com/int-en/p/amyris-homme-eau-de-toilette-RA131411.html",
  "cat2-mfk-amyris-homme-extrait":
    "https://www.franciskurkdjian.com/int-en/p/amyris-homme-extrait-de-parfum-RA141421.html",
  "cat2-mfk-apom-edp": "https://www.franciskurkdjian.com/int-en/p/apom-eau-de-parfum-RA120421.html",
  "cat2-mfk-aqua-media-cologne-forte-edp":
    "https://www.franciskurkdjian.com/int-en/p/aqua-media-cologne-forte-eau-de-parfum-RA12362.html",
  "cat2-mfk-feminin-pluriel-edp":
    "https://www.franciskurkdjian.com/int-en/p/feminin-pluriel-eau-de-parfum-RA122021.html",
  "cat2-mfk-gentle-fluidity-gold-edp":
    "https://www.franciskurkdjian.com/int-en/p/gentle-fluidity-gold-edition---eau-de-parfum-RA122821.html",
  "cat2-mfk-gentle-fluidity-silver-edp":
    "https://www.franciskurkdjian.com/int-en/p/gentle-fluidity-silver-edition---eau-de-parfum-RA122921.html",
  "cat2-youssoful-creme-de-the-extrait": "https://www.youssoful.tw/products/edp-00-cremedethe-50ml",
  "cat2-youssoful-fiine-extrait": "https://www.youssoful.tw/products/edp-01-fiine-50ml",
  "cat2-youssoful-mary-s-garden-extrait": "https://www.youssoful.tw/products/edp-02-marysgarden-50ml",
  "cat2-youssoful-berry-sexy-extrait": "https://www.youssoful.tw/products/edp-03-berrysexy-50ml",
  "cat2-youssoful-je-t-aime-extrait": "https://www.youssoful.tw/products/edp-04-jetaime-50ml",
  "cat2-youssoful-floralia-extrait": "https://www.youssoful.tw/products/edp-05-floralia-50ml",
  "cat2-youssoful-stare-m-sto-extrait": "https://www.youssoful.tw/products/edp-06-staremesto-50ml",
  "cat2-youssoful-saint-moritz-extrait": "https://www.youssoful.tw/products/edp-07-saintmoritz-50ml",
  "cat2-youssoful-dimanche-a-paris-extrait": "https://www.youssoful.tw/products/edp-08-dimancheaparis-50ml",
  "cat2-youssoful-lourdes-extrait": "https://www.youssoful.tw/products/edp-09-lourdes-50ml",
  "cat2-youssoful-puglia-ostuni-extrait": "https://www.youssoful.tw/products/edp-10-pugliaostuni-50ml",
  "cat2-youssoful-borough-london-extrait": "https://www.youssoful.tw/products/edp-11-boroughlondon-50ml",
  "cat2-youssoful-beieren-extrait": "https://www.youssoful.tw/products/edp-12-beieren-50ml",
  "cat2-youssoful-coco-hawaii-extrait": "https://www.youssoful.tw/products/edp-13-cocohawaii-50ml",
  "cat2-youssoful-biove-extrait": "https://www.youssoful.tw/products/edp-14-biove-50ml",
  "cat2-youssoful-seychelles-extrait": "https://www.youssoful.tw/products/edp-15-seychelles-50ml",
  "cat2-youssoful-berry-noir-extrait": "https://www.youssoful.tw/products/edp-16-berrynoir-50ml",
  "cat2-youssoful-diving-cefalu-spiaggia-extrait":
    "https://www.youssoful.tw/products/edp-17-divingcefaluspiaggia-50ml",
  "cat2-youssoful-daiquiri-extrait": "https://www.youssoful.tw/products/edp-18-daiquiri-50ml",
  "cat2-youssoful-cote-d-azur-extrait": "https://www.youssoful.tw/products/edp-19-cotedazur-50ml",
  "cat2-youssoful-santal-sequoia-extrait": "https://www.youssoful.tw/products/edp-20-santalsequoia-50ml",
  "cat2-youssoful-hyperion-extrait": "https://www.youssoful.tw/products/edp-21-hyperion-50ml",
  "cat2-youssoful-kingsman-extrait": "https://www.youssoful.tw/products/edp-22-kingsman-50ml",
  "cat2-youssoful-milan-fever-extrait": "https://www.youssoful.tw/products/edp-23-milanfever-50ml",
  "cat2-youssoful-emporia-cotton-extrait": "https://www.youssoful.tw/products/edp-24-emporiacotton-50ml",
  "cat2-youssoful-burj-royal-extrait": "https://www.youssoful.tw/products/edp-25-burjroyal-50ml",
  "cat2-labsolue-10-artemisia-edp": "https://labsolueperfume.com/en/products/10-artemisia-eau-de-parfum",
  "cat2-labsolue-11-violetta-edp": "https://labsolueperfume.com/en/products/11-violetta-eau-de-parfum",
  "cat2-labsolue-12-fresia-edp": "https://labsolueperfume.com/en/products/12-fresia-eau-de-parfum",
  "cat2-labsolue-14-angelica-edp": "https://labsolueperfume.com/en/products/14-angelica-eau-de-parfum",
  "cat2-labsolue-15-lavanda-edp": "https://labsolueperfume.com/en/products/15-lavanda-eau-de-parfum",
  "cat2-labsolue-20-gardenia-edp": "https://labsolueperfume.com/en/products/20-gardenia-eau-de-parfum",
  "cat2-labsolue-21-gelsomino-edp": "https://labsolueperfume.com/en/products/21-gelsomino-eau-de-parfum",
  "cat2-labsolue-22-osmanto-edp": "https://labsolueperfume.com/en/products/22-osmanto-eau-de-parfum",
  "cat2-labsolue-23-neroli-edp": "https://labsolueperfume.com/en/products/23-neroli-eau-de-parfum",
  "cat2-labsolue-24-zagara-edp": "https://labsolueperfume.com/en/products/24-zagara-eau-de-parfum",
  "cat2-labsolue-25-fiore-d-arancio-edp":
    "https://labsolueperfume.com/en/products/25-fiore-darancio-eau-de-parfum",
  "cat2-labsolue-26-frangipani-edp": "https://labsolueperfume.com/en/products/26-frangipani-eau-de-parfum",
  "cat2-labsolue-30-robinia-edp": "https://labsolueperfume.com/en/products/30-robinia-eau-de-parfum",
  "cat2-labsolue-31-lilla-edp": "https://labsolueperfume.com/en/products/31-lilla-eau-de-parfum",
  "cat2-labsolue-32-mimosa-edp": "https://labsolueperfume.com/en/products/32-mimosa-eau-de-parfum",
  "cat2-labsolue-33-magnolia-edp": "https://labsolueperfume.com/en/products/33-magnolia-eau-de-parfum",
  "cat2-labsolue-34-ylang-ylang-edp": "https://labsolueperfume.com/en/products/34-ylang-ylang-eau-de-parfum",
  "cat2-labsolue-35-tiglio-edp": "https://labsolueperfume.com/en/products/35-tiglio-eau-de-parfum",
  "cat2-labsolue-36-rosa-edp": "https://labsolueperfume.com/en/products/36-rosa-eau-de-parfum",
  "cat2-labsolue-219-tuberosa-edp": "https://labsolueperfume.com/en/products/219-tuberosa-eau-de-parfum",
  "cat2-labsolue-221-iris-edp": "https://labsolueperfume.com/en/products/221-iris-eau-de-parfum",
  "cat2-labsolue-101-bergamotto-edp": "https://labsolueperfume.com/en/products/101-bergamotto-eau-de-parfum",
  "cat2-labsolue-102-mandarino-edp": "https://labsolueperfume.com/en/products/102-mandarino-eau-de-parfum",
  "cat2-labsolue-103-mirto-edp": "https://labsolueperfume.com/en/products/103-mirto-eau-de-parfum",
  "cat2-labsolue-104-gelso-edp": "https://labsolueperfume.com/en/products/104-gelso-eau-de-parfum",
  "cat2-labsolue-201-ulivo-edp": "https://labsolueperfume.com/en/products/201-ulivo-eau-de-parfum",
  "cat2-labsolue-202-fico-edp": "https://labsolueperfume.com/en/products/202-fico-eau-de-parfum",
  "cat2-labsolue-203-melograno-edp": "https://labsolueperfume.com/en/products/203-melograno-eau-de-parfum",
  "cat2-labsolue-204-nespolo-edp": "https://labsolueperfume.com/en/products/204-nespolo-eau-de-parfum",
  "cat2-labsolue-301-pesco-edp": "https://labsolueperfume.com/en/products/301-pesco-eau-de-parfum",
  "cat2-labsolue-302-mandorlo-edp": "https://labsolueperfume.com/en/products/302-mandorlo-eau-de-parfum",
  "cat2-labsolue-303-ciliegio-edp": "https://labsolueperfume.com/en/products/303-ciliegio-eau-de-parfum",
  "cat2-labsolue-304-vaniglia-edp": "https://labsolueperfume.com/en/products/304-vaniglia-eau-de-parfum",
  "cat2-labsolue-312-petitgrain-edp": "https://labsolueperfume.com/en/products/312-petitgrain-eau-de-parfum",
  "cat2-labsolue-314-cedro-edp": "https://labsolueperfume.com/en/products/314-cedro-eau-de-parfum",
  "cat2-labsolue-316-ambrette-edp": "https://labsolueperfume.com/en/products/316-ambrette-eau-de-parfum",
  "cat2-labsolue-305-mentha-aquatica-edp":
    "https://labsolueperfume.com/en/products/305-mentha-aquatica-eau-de-parfum",
  "cat2-labsolue-306-salvia-bianca-edp":
    "https://labsolueperfume.com/en/products/306-salvia-bianca-eau-de-parfum",
  "cat2-labsolue-307-rosmarino-edp": "https://labsolueperfume.com/en/products/307-rosmarino-eau-de-parfum",
  "cat2-labsolue-308-santolina-edp": "https://labsolueperfume.com/en/products/308-santolina-eau-de-parfum",
  "cat2-labsolue-309-timo-edp": "https://labsolueperfume.com/en/products/309-timo-eau-de-parfum",
  "cat2-labsolue-318-canapa-edp": "https://labsolueperfume.com/en/products/318-canapa-eau-de-parfum",
  "cat2-labsolue-7-sandalo-edp": "https://labsolueperfume.com/en/products/7-sandalo-eau-de-parfum",
  "cat2-labsolue-8-patchouli-edp": "https://labsolueperfume.com/en/products/8-patchouli-eau-de-parfum",
  "cat2-labsolue-9-vetiver-edp": "https://labsolueperfume.com/en/products/9-vetiver-eau-de-parfum",
  "cat2-labsolue-16-oud-edp": "https://labsolueperfume.com/en/products/16-oud-eau-de-parfum",
  "cat2-labsolue-18-legno-di-rosa-edp":
    "https://labsolueperfume.com/en/products/18-legno-di-rosa-eau-de-parfum",
  "cat2-labsolue-19-legno-di-guaiaco-edp":
    "https://labsolueperfume.com/en/products/19-legno-di-guaiaco-eau-de-parfum",
  "cat2-labsolue-27-abete-bianco-edp":
    "https://labsolueperfume.com/en/products/27-abete-bianco-eau-de-parfum",
  "cat2-labsolue-28-legno-di-quercia-edp":
    "https://labsolueperfume.com/en/products/28-legno-di-quercia-eau-de-parfum",
  "cat2-labsolue-29-legno-di-cedro-edp":
    "https://labsolueperfume.com/en/products/29-legno-di-cedro-eau-de-parfum",
  "cat2-labsolue-207-liquidambar-edp":
    "https://labsolueperfume.com/en/products/207-liquidambar-eau-de-parfum",
  "cat2-labsolue-208-cipriolo-edp": "https://labsolueperfume.com/en/products/208-cipriolo-eau-de-parfum",
  "cat2-labsolue-210-tonka-edp": "https://labsolueperfume.com/en/products/210-tonka-eau-de-parfum",
  "cat2-labsolue-212-amyris-edp": "https://labsolueperfume.com/en/products/212-amyris-eau-de-parfum",
  "cat2-labsolue-214-legno-di-pepe-edp":
    "https://labsolueperfume.com/en/products/214-legno-di-pepe-eau-de-parfum",
  "cat2-labsolue-315-palo-santo-edp": "https://labsolueperfume.com/en/products/315-palo-santo-eau-de-parfum",
  "cat2-labsolue-205-mirra-edp": "https://labsolueperfume.com/en/products/205-mirra-eau-de-parfum",
  "cat2-labsolue-206-opoponax-edp": "https://labsolueperfume.com/en/products/206-opoponax-eau-de-parfum",
  "cat2-labsolue-209-styrax-edp": "https://labsolueperfume.com/en/products/209-styrax-eau-de-parfum",
  "cat2-labsolue-211-olibanum-edp": "https://labsolueperfume.com/en/products/211-olibanum-eau-de-parfum",
  "cat2-labsolue-215-labdanum-edp": "https://labsolueperfume.com/en/products/215-labdanum-eau-de-parfum",
  "cat2-labsolue-320-ambra-grigia-edp":
    "https://labsolueperfume.com/en/products/320-ambra-grigia-eau-de-parfum",
  "cat2-labsolue-assoluto-1966-edp": "https://labsolueperfume.com/en/products/assoluto-1966",
  "cat2-labsolue-sable-blanc-1950-edp":
    "https://labsolueperfume.com/en/products/aqua-adornationis-sable-blanc-1950-eau-de-parfum",
  "cat2-labsolue-alpha-1977-edp":
    "https://labsolueperfume.com/en/products/aqua-adornationis-alpha-1977-eau-de-parfum",
  "cat2-labsolue-bohemian-spirit-1979-edp":
    "https://labsolueperfume.com/en/products/aqua-adornationis-bohemian-spirit-1979-eau-de-parfum",
  "cat2-labsolue-combustion-1978-edp":
    "https://labsolueperfume.com/en/products/aqua-adornationis-combustion-1978-eau-de-parfum",
  "cat2-labsolue-heroine-1980-edp":
    "https://labsolueperfume.com/en/products/aqua-adornationis-heroine-1980-eau-de-parfum",
  "cat2-labsolue-honorable-1947-edp":
    "https://labsolueperfume.com/en/products/aqua-adornationis-honorable-1947-eau-de-parfum",
  "cat2-labsolue-salty-rock-1982-edp":
    "https://labsolueperfume.com/en/products/aqua-adornationis-salty-rock-1982-eau-de-parfum",
  "cat2-labsolue-vertigo-1973-edp":
    "https://labsolueperfume.com/en/products/aqua-adornationis-vertigo-1973-eau-de-parfum",
  // Creed: its US site's product pages (2026-10-08).
  "cat2-creed-aventus-edp": "https://creedboutique.com/products/aventus",
  "cat2-creed-absolu-aventus-edp": "https://creedboutique.com/products/absolu-aventus",
  "cat2-creed-aventus-cologne-edp": "https://creedboutique.com/products/aventus-cologne",
  "cat2-creed-green-irish-tweed-edp": "https://creedboutique.com/products/green-irish-tweed",
  "cat2-creed-original-santal-edp": "https://creedboutique.com/products/original-santal",
  "cat2-creed-viking-edp": "https://creedboutique.com/products/viking",
  "cat2-creed-silver-mountain-water-edp": "https://creedboutique.com/products/silver-mountain-water",
  "cat2-creed-millesime-imperial-edp": "https://creedboutique.com/products/millesime-imperial",
  "cat2-creed-wild-vetiver-edp": "https://creedboutique.com/products/wild-vetiver",
  "cat2-creed-original-vetiver-edp": "https://creedboutique.com/products/original-vetiver",
  "cat2-creed-himalaya-edp": "https://creedboutique.com/products/himalaya",
  "cat2-creed-bois-du-portugal-edp": "https://creedboutique.com/products/bois-du-portugal",
  "cat2-creed-royal-mayfair-edp": "https://creedboutique.com/products/royal-mayfair",
  "cat2-creed-royal-water-edp": "https://creedboutique.com/products/royal-water",
  "cat2-creed-royal-oud-edp": "https://creedboutique.com/products/royal-oud",
  "cat2-creed-oud-zarian-edp": "https://creedboutique.com/products/oud-zarian",
  "cat2-creed-delphinus-edp": "https://creedboutique.com/products/delphinus",
  "cat2-creed-centaurus-edp": "https://creedboutique.com/products/centaurus",
  "cat2-creed-millesime-1849-edp": "https://creedboutique.com/products/millesime-1849-100ml",
  "cat2-creed-tabarome-millesime-edp": "https://creedboutique.com/products/tabarome-millesime",
  "cat2-creed-erolfa-edp": "https://creedboutique.com/products/erolfa",
  "cat2-creed-aventus-for-her-edp": "https://creedboutique.com/products/aventus-for-her",
  "cat2-creed-iris-debonair-edp": "https://creedboutique.com/products/iris-debonair",
  "cat2-creed-eladaria-edp": "https://creedboutique.com/products/eladaria",
  "cat2-creed-queen-of-silk-edp": "https://creedboutique.com/products/queen-of-silk",
  "cat2-creed-carmina-edp": "https://creedboutique.com/products/carmina",
  "cat2-creed-wind-flowers-edp": "https://creedboutique.com/products/wind-flowers",
  "cat2-creed-spring-flower-edp": "https://creedboutique.com/products/spring-flower",
  "cat2-creed-love-in-white-edp": "https://creedboutique.com/products/love-in-white",
  "cat2-creed-love-in-white-for-summer-edp": "https://creedboutique.com/products/love-in-white-for-summer",
  "cat2-creed-love-in-black-edp": "https://creedboutique.com/products/love-in-black",
  "cat2-creed-fleurissimo-edp": "https://creedboutique.com/products/fleurissimo",
  "cat2-creed-white-flowers-edp": "https://creedboutique.com/products/white-flowers",
  "cat2-creed-royal-princess-oud-edp": "https://creedboutique.com/products/royal-princess-oud",
  "cat2-creed-white-amber-edp": "https://creedboutique.com/products/white-amber",
  "cat2-creed-virgin-island-water-edp": "https://creedboutique.com/products/virgin-island-water",
  "cat2-creed-acqua-fiorentina-edp": "https://creedboutique.com/products/acqua-fiorentina",
  "cat2-creed-jardin-d-amalfi-edp": "https://creedboutique.com/products/jardin-d-amalfi",
  "cat2-creed-pure-white-cologne-edp": "https://creedboutique.com/products/pure-white-cologne",
  "cat2-zhixunyan-spring": "https://www.zhixunyan.com/item/PD6941253b89a1d",
  "cat2-zhixunyan-summer": "https://www.zhixunyan.com/item/PD69412483710a3",
  "cat2-zhixunyan-autumn": "https://www.zhixunyan.com/item/PD69412401811ec",
  "cat2-zhixunyan-winter": "https://www.zhixunyan.com/item/PD69412352c0971",
  "cat2-zhixunyan-orange": "https://www.zhixunyan.com/item/PD694250734fb8a",
  "cat2-zhixunyan-sandalwood": "https://www.zhixunyan.com/item/PD694252cd6d890",
};

/*
 * The picture a product page declares for sharing (its og:image), copied from the page
 * by hand (2026-10-07) for brands whose site does not answer our server (Calvin Klein).
 * Used only when reading the page itself fails; linked, never copied, credited to the page.
 */
export const OFFICIAL_PICTURES: Readonly<Record<string, string>> = {
  "cat-calvin-klein-ck-one-edt": "https://calvinklein.scene7.com/is/image/CalvinKlein/10740_000_main",
  "cat-calvin-klein-eternity-for-women-edp":
    "https://calvinklein.scene7.com/is/image/CalvinKlein/LX000744_000_main",
  "cat-calvin-klein-eternity-for-women-suede-essence-parfum":
    "https://calvinklein.scene7.com/is/image/CalvinKlein/LX002152_000_main",
  "cat-calvin-klein-euphoria-signature-elixir":
    "https://calvinklein.scene7.com/is/image/CalvinKlein/LX002160_000_main",
  "cat-calvin-klein-euphoria-magnetic-elixir":
    "https://calvinklein.scene7.com/is/image/CalvinKlein/LX001963_000_main",
  "cat-calvin-klein-euphoria-bold-elixir":
    "https://calvinklein.scene7.com/is/image/CalvinKlein/LX001959_000_main",
  "cat-calvin-klein-euphoria-solar-elixir":
    "https://calvinklein.scene7.com/is/image/CalvinKlein/LX001967_000_main",
  "cat-calvin-klein-eternity-for-men-edt":
    "https://calvinklein.scene7.com/is/image/CalvinKlein/LX000717_000_main",
  "cat-calvin-klein-eternity-for-men-parfum":
    "https://calvinklein.scene7.com/is/image/CalvinKlein/LX000724_000_main",
  "cat-calvin-klein-eternity-for-men-edp":
    "https://calvinklein.scene7.com/is/image/CalvinKlein/LX000725_000_main",
  "cat-calvin-klein-obsession-for-men-edt":
    "https://calvinklein.scene7.com/is/image/CalvinKlein/LX000709_000_main",
  "cat-calvin-klein-defy-edt": "https://calvinklein.scene7.com/is/image/CalvinKlein/YS99350D_000_main",
  "cat-calvin-klein-defy-edp": "https://calvinklein.scene7.com/is/image/CalvinKlein/LX000102_000_main",
  "cat-calvin-klein-defy-parfum": "https://calvinklein.scene7.com/is/image/CalvinKlein/LX000315_000_main",
};
