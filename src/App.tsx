import * as React from "react";
import { diffChars } from "diff";

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
    <article>
      <button type="button" onClick={() => onIgnore(currentFile)}>
        Ignore
      </button>{" "}
      {state.files.length} conflicts left.
      <h1>{currentFile.basename}</h1>
      <button
        type="button"
        disabled={layout === Layout.Horizontal}
        onClick={() => setLayout(Layout.Horizontal)}
      >
        Horizontal
      </button>
      <button
        type="button"
        disabled={layout === Layout.Vertical}
        onClick={() => setLayout(Layout.Vertical)}
      >
        Vertical
      </button>
      <div
        style={
          layout === Layout.Horizontal
            ? { display: "flex", width: "100%", overflowX: "auto" }
            : {}
        }
      >
        {currentFile.versions.map(version => (
          <div
            key={version.path}
            style={
              layout === Layout.Horizontal
                ? { flex: "1 1 50%", flexShrink: 0 }
                : {}
            }
          >
            <button
              type="button"
              onClick={() => onUpdateBase(currentFile.basename, version.path)}
              disabled={version.isBase}
            >
              Base
            </button>
            <button
              type="button"
              onClick={() => onSaveVersion(currentFile, version)}
              disabled={state.status === Status.Saving}
            >
              {state.status === Status.Saving ? "Saving..." : "Save"}
            </button>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {version.isBase
                ? version.content
                : diffChars(baseVersion.content, version.content).map(
                    (change, changeIndex) => (
                      <span
                        key={changeIndex}
                        style={
                          change.added
                            ? {
                                color: "white",
                                backgroundColor: "green"
                              }
                            : change.removed
                            ? {
                                color: "white",
                                backgroundColor: "red"
                              }
                            : {}
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
                      </span>
                    )
                  )}
            </pre>
          </div>
        ))}
      </div>
    </article>
  );
}

export default App;
