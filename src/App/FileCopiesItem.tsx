import * as React from "react";
import styled from "styled-components";
import FileCopiesVersionItem from "./FileCopiesVersionItem";

interface Props {
  fileCopies: FileCopies;
  onExpand: () => void;
  expanded: boolean;
}

const VersionsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  width: 100%;
`;

const VersionsContainerItem = styled.div`
  flex: 1 1 50%;
  flex-shrink: 0;

  &:not(:last-child) {
    border-right: 1px solid #2a2e37;
  }
`;

function FileCopiesItem(props: Props) {
  return (
    <article>
      <code onClick={() => props.onExpand()}>{props.fileCopies.basename}</code>
      {props.expanded && (
        <VersionsContainer>
          {Object.keys(props.fileCopies.versions)
            .reduce((copies: Array<FileCopiesVersion[]>, folder) => {
              const version = props.fileCopies.versions[folder];
              const index = copies.findIndex(versions =>
                versions.some(
                  otherVersion => otherVersion.content === version.content
                )
              );

              if (index >= 0) {
                return copies.map((versions, versionsIndex) =>
                  versionsIndex === index ? [...versions, version] : versions
                );
              }

              return copies.concat([[version]]);
            }, [])
            .map((versions, index) => (
              <VersionsContainerItem>
                <FileCopiesVersionItem key={index} versions={versions} />
              </VersionsContainerItem>
            ))}
        </VersionsContainer>
      )}
    </article>
  );
}

export default FileCopiesItem;
