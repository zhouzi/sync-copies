import * as React from "react";
import styled from "styled-components";
import { Button } from "../DesignSystem";

interface Props {
  versions: FileCopiesVersion[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Controls = styled.div`
  color: #c4c5ca;
  background-color: #2a2e37;
  padding: 1rem;
`;

const CodeBlock = styled.pre`
  flex: 1;
  color: #c4c5ca;
  background-color: #1c2029;
  white-space: pre-wrap;
  padding: 1rem;
  margin: 0;
`;

function FileCopiesVersionItem(props: Props) {
  return (
    <Container>
      <Controls>
        <Button variant="secondary">Base</Button>
        {props.versions.length} copies
        <Button variant="primary">Save</Button>
      </Controls>
      <CodeBlock>{props.versions[0].content}</CodeBlock>
    </Container>
  );
}

export default FileCopiesVersionItem;
