type ComicProps = {
  id: string;
  thumbnails: Array<string>;
  title: string;
  pages: Array<string>;
};

export class Comic {
  id: string;
  thumbnails: Array<string>;
  title: string;
  pages: Array<string>;

  constructor({ id, thumbnails, title, pages }: ComicProps) {
    this.id = id;
    this.thumbnails = thumbnails;
    this.title = title;
    this.pages = pages;
  }

  get thumbnail(): string {
    console.log(this);

    if (this.thumbnails.length === 0) return "";
    return this.thumbnails[0];
  }

  greet(): string {
    return `Hello`;
  }

  asJson(): ComicProps {
    return {
      id: this.id,
      thumbnails: this.thumbnails,
      title: this.title,
      pages: this.pages,
    };
  }
}
