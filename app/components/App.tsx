import * as React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { File } from "../types";
import hasDifferences from "../hasDifferences";
import FileItem from "./FileItem";

const GetFilesList = gql`
  query GetFilesList {
    folders
    match
    files {
      basename
      versions {
        path
        content
      }
    }
  }
`;

interface GetFilesListData {
  folders: string[];
  match: string;
  files: File[];
}

const Container = styled.main`
  padding: 4rem 0;
`;
const Summary = styled.h1`
  font-size: 1.8rem;
  line-height: 1.2;
  font-weight: normal;
  margin: 0;
  padding: 0 2rem 2rem 2rem;
`;
const Strong = styled.strong`
  color: #ea3db6;
  display: inline;
  background-image: linear-gradient(0deg, #4694e6, #4694e6 100%);
  background-size: 100% 0.2em;
  background-repeat: no-repeat;
  background-position: 0 88%;
`;

function App() {
  const { data } = useQuery<GetFilesListData>(GetFilesList);
  const [basename, setBasename] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data == null || data.files.length <= 0) {
      setBasename(null);
      return;
    }

    const fileWithDifferences = data.files.find(hasDifferences);
    const file = fileWithDifferences || data.files[0];

    setBasename(file.basename);
  }, [data?.files]);

  return (
    <Container>
      {data ? (
        <>
          <Summary>
            Found <Strong>{data.files.length}</Strong> files matching "
            <Strong>{data.match}</Strong>" in{" "}
            <Strong>{data.folders.length}</Strong> different directories for a
            total of <Strong>{data.files.length * data.folders.length}</Strong>{" "}
            copies.
          </Summary>
          {data.files.map(file => (
            <FileItem
              key={file.basename}
              file={file}
              expanded={basename === file.basename}
              onExpand={() => setBasename(file.basename)}
            />
          ))}
        </>
      ) : (
        <Summary>Reading files...</Summary>
      )}
    </Container>
  );
}

export default App;
