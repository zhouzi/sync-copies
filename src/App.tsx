import * as React from "react";
import { diffChars } from "diff";
import styled, { createGlobalStyle, css } from "styled-components";

interface FileVersion {
  path: string;
  content: string;
  isBase: boolean;
}

interface File {
  basename: string;
  versions: FileVersion[];
}

enum Status {
  Initializing = "Initializing",
  Idle = "Idle",
  Saving = "Saving"
}

interface State {
  status: Status;
  files: File[];
}

enum Layout {
  Horizontal = "Horizontal",
  Vertical = "Vertical"
}

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 16px;
  }

  body {
    font-family: 'Open Sans', sans-serif;
    font-size: 1rem;
    line-height: 1.5;
    font-weight: 400;
    color: #fff;
    background-color: #272936;
  }

  pre {
    font-family: 'Fira Mono', monospace;
    font-weight: 300;
  }
`;

const FileContainer = styled.article``;
const FileBasenameContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #20212c;
  padding: 1rem 1rem 2rem 1rem;
`;
const FileBasenameText = styled.div`
  font-size: 2rem;
  flex: 1;
`;
const FileBasenameControls = styled.div`
  color: #5d6c9d;
`;

const Button = styled.button<{
  marginBefore?: boolean;
  marginAfter?: boolean;
  active?: boolean;
}>`
  font: inherit;
  cursor: pointer;
  color: white;
  background: transparent;
  border: none;
  padding: 0.4rem 1rem;
  border-bottom: 2px solid #5d6c9d;
  margin-left: ${props => (props.marginBefore ? "0.4rem" : "0")};
  margin-right: ${props => (props.marginAfter ? "0.4rem" : "0")};

  &:focus,
  &:hover {
    background: #ff76c7;
    border-bottom-color: #fff;
  }

  ${props =>
    props.active &&
    css`
      &,
      &:focus,
      &:hover {
        background: transparent;
        border-bottom-color: #ff76c7;
      }
    `}
`;

const VersionsContainer = styled.div<{ layout: Layout }>`
  ${props =>
    props.layout === Layout.Horizontal &&
    css`
      display: flex;
      width: 100%;
      overflow-x: auto;
    `}
`;
const VersionContainer = styled.div<{ layout: Layout }>`
  ${props => {
    switch (props.layout) {
      case Layout.Horizontal:
        return css`
          flex: 1 1 50%;
          flex-shrink: 0;
          border-right: 1px solid #1a1b23;
        `;
      default:
        return css`
          display: flex;
        `;
    }
  }}
`;
const VersionControls = styled.div``;
const VersionCode = styled.pre`
  flex: 1;
  color: #fff;
  font-size: 0.9rem;
  padding: 1rem;
  white-space: pre-wrap;
  margin: 0;
`;

const Diff = styled.span<{ variant: "added" | "removed" | null }>`
  ${props => {
    switch (props.variant) {
      case "added":
        return css`
          background-color: #35684a;
        `;
      case "removed":
        return css`
          background-color: #9a3f43;
        `;
      default:
        return null;
    }
  }}
`;

function App() {
  const [state, setState] = React.useState<State>({
    status: Status.Initializing,
    files: []
  });
  const [layout, setLayout] = React.useState(Layout.Horizontal);

  const onUpdateBase = (basename: string, path: string) => {
    setState(currentState => ({
      ...currentState,
      files: currentState.files.map(file =>
        file.basename === basename
          ? {
              ...file,
              versions: file.versions.map(version => ({
                ...version,
                isBase: version.path === path
              }))
            }
          : file
      )
    }));
  };

  const onSaveVersion = async (file: File, version: FileVersion) => {
    if (state.status !== Status.Idle) {
      return;
    }

    setState(currentState => ({
      ...currentState,
      status: Status.Saving
    }));

    await fetch("/api/files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        file.versions.map(({ path }) => ({
          path,
          content: version.content
        }))
      )
    });

    setState(currentState => ({
      ...currentState,
      status: Status.Idle,
      files: currentState.files.filter(
        ({ basename }) => basename !== file.basename
      )
    }));
  };

  const onIgnore = (file: File) => {
    setState(currentState => ({
      ...currentState,
      files: currentState.files.filter(
        ({ basename }) => basename !== file.basename
      )
    }));
  };

  React.useEffect(() => {
    (async () => {
      const res = await fetch("/api/files");
      const files = await res.json();

      setState({
        status: Status.Idle,
        files: Object.keys(files)
          .sort()
          .map(basename => ({
            basename,
            versions: Object.keys(files[basename])
              .sort()
              .map((path, index) => ({
                path,
                content: files[basename][path],
                isBase: index === 0
              }))
          }))
      });
    })();
  }, []);

  if (state.status === Status.Initializing) {
    return null;
  }

  if (state.files.length === 0) {
    return <h1>Congrats, you're done!</h1>;
  }

  const currentFile = state.files[0];
  const baseVersion = currentFile.versions.find(
    version => version.isBase
  ) as FileVersion;

  return (
    <>
      <GlobalStyle />
      <FileContainer>
        <FileBasenameContainer>
          <FileBasenameText>{currentFile.basename}</FileBasenameText>
          <FileBasenameControls>
            {state.files.length} conflict{state.files.length === 1 ? "" : "s"}{" "}
            left
            <Button
              type="button"
              onClick={() => onIgnore(currentFile)}
              marginBefore
            >
              Ignore
            </Button>
            <Button
              type="button"
              disabled={layout === Layout.Horizontal}
              active={layout === Layout.Horizontal}
              onClick={() => setLayout(Layout.Horizontal)}
              marginBefore
            >
              Horizontal
            </Button>
            <Button
              type="button"
              disabled={layout === Layout.Vertical}
              active={layout === Layout.Vertical}
              onClick={() => setLayout(Layout.Vertical)}
              marginBefore
            >
              Vertical
            </Button>
          </FileBasenameControls>
        </FileBasenameContainer>
        <VersionsContainer layout={layout}>
          {currentFile.versions.map(version => (
            <VersionContainer key={version.path} layout={layout}>
              <VersionControls>
                <Button
                  type="button"
                  onClick={() =>
                    onUpdateBase(currentFile.basename, version.path)
                  }
                  disabled={version.isBase}
                  active={version.isBase}
                  marginAfter
                >
                  Base
                </Button>
                <Button
                  type="button"
                  onClick={() => onSaveVersion(currentFile, version)}
                  disabled={state.status === Status.Saving}
                  marginAfter
                >
                  {state.status === Status.Saving ? "Saving..." : "Save"}
                </Button>
              </VersionControls>
              <VersionCode>
                {version.isBase
                  ? version.content
                  : diffChars(baseVersion.content, version.content).map(
                      (change, changeIndex) => (
                        <Diff
                          key={changeIndex}
                          variant={
                            change.added
                              ? "added"
                              : change.removed
                              ? "removed"
                              : null
                          }
                        >
                          {change.value.trim().length === 0
                            ? Array.from(
                                change.value.matchAll(/\s/g)
                              ).map(([match], index) => (
                                <span key={index}>
                                  {/\n/.test(match) ? "\n" : <>&nbsp;</>}
                                </span>
                              ))
                            : change.value}
                        </Diff>
                      )
                    )}
              </VersionCode>
            </VersionContainer>
          ))}
        </VersionsContainer>
      </FileContainer>
    </>
  );
}

export default App;
