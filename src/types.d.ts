interface FilesCopies {
  [basename: string]: FileCopies;
}

interface FileCopies {
  basename: string;
  versions: FilesCopiesVersions;
}

interface FileCopiesVersions {
  [folder: string]: FileCopiesVersions;
}

interface FileCopiesVersion {
  path: string;
  content: string | null;
}
