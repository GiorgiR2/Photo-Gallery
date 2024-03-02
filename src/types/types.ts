
interface searchedPhotoI{
    status: boolean;
    src: string | null;
    id: string | null;
    likes: number | 0;
    downloads: number | 0;
    views: number | 0;
}

interface urlsI{
    small: string;
    regular: string;
}

interface photoI{
    id: string;
    urls: urlsI;
}

type photosT = photoI[];

export type { searchedPhotoI, photosT, photoI };