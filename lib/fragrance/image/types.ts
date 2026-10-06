/** A product picture taken from the brand's own website, with the page it came from. */
export interface OfficialImage {
  imageUrl: string;
  /** The brand's product page that declares this picture; shown as the image credit. */
  pageUrl: string;
  brand: string;
}
