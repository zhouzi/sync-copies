export interface FileVersion {
  path: string;
  content: string | null;
}

export interface File {
  basename: string;
  versions: FileVersion[];
}
