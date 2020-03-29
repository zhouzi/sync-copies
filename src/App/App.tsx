import * as React from "react";
import { GlobalStyle, Container, Header, Paragraph } from "../DesignSystem";
import FileCopiesItem from "./FileCopiesItem";

interface State {
  loading: boolean;
  filesCopies: FilesCopies;
  currentFileCopiesBasename: string | null;
}

function App() {
  const [state, setState] = React.useState<State>({
    loading: true,
    filesCopies: {},
    currentFileCopiesBasename: null
  });

  React.useEffect(() => {
    const controller = new AbortController();

    fetch("/api/files", { signal: controller.signal })
      .then(res => (res.ok ? res.json() : null))
      .then(json => {
        if (json) {
          setState({
            loading: false,
            filesCopies: json,
            currentFileCopiesBasename: Object.keys(json)[0]
          });
        }
      });

    return controller.abort;
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>sync-copies</Header>
        <Paragraph>
          Sometimes you have no choices but to duplicate the same identical copy
          of a file in several places. sync-copies helps you by listing those
          copies and their differences and let you decide which copy is correct.
        </Paragraph>
      </Container>

      {Object.keys(state.filesCopies)
        .sort()
        .map(basename => (
          <FileCopiesItem
            key={basename}
            fileCopies={state.filesCopies[basename]}
            onExpand={() =>
              setState(currentState => ({
                ...currentState,
                currentFileCopiesBasename: basename
              }))
            }
            expanded={basename === state.currentFileCopiesBasename}
          />
        ))}
    </>
  );
}

export default App;
