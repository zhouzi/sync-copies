import { File } from "./types";

function hasDifferences(file: File) {
  return file.versions.some(
    (version, index, versions) => version.content !== versions[0].content
  );
}

export default hasDifferences;
