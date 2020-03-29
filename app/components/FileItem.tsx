import * as React from "react";
import styled, { css } from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { diffChars } from "diff";
import { File } from "../types";
import { IconPass, IconWarning } from "../icons";

const SaveFileVersion = gql`
  mutation SaveFileVersion($basename: String!, $content: String!) {
    saveFileVersion(basename: $basename, content: $content) {
      basename
      versions {
        path
        content
      }
    }
  }
`;
interface SaveFileVersionVariables {
  basename: string;
  content: string;
}

interface Props {
  file: File;
  expanded: boolean;
  onExpand: () => void;
}

const Container = styled.div<{ expanded: boolean }>`
  ${props =>
    props.expanded &&
    css`
      padding-bottom: 1rem;
    `}
`;
const BasenameContainer = styled.h2.attrs({ role: "button", tabIndex: 0 })<{
  active: boolean;
}>`
  font-size: 1.2rem;
  font-weight: normal;
  margin: 0;
  padding: 0 2rem;
  cursor: pointer;
  outline: none;

  &:focus,
  &:hover {
    color: #ea3db6;
  }

  ${props =>
    props.active &&
    css`
      cursor: auto;
      color: #ea3db6;
      font-weight: bold;
    `}
`;
const VersionsContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  background-color: #081727;
`;
const VersionsItemContainer = styled.div`
  flex: 1 1 50%;
  flex-shrink: 0;
  border-right: 1px solid #0d1f31;
  white-space: pre-wrap;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const VersionsItemPath = styled.div`
  color: #667c94;
  padding: 0.4rem 2rem;
  background-color: #071425;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const VersionsItemCode = styled.pre`
  flex: 1;
  margin: 0;
  font-size: 0.8em;
  padding: 1rem 2rem;
`;
const Diff = styled.span<{ variant: "added" | "removed" | null }>`
  ${props => {
    switch (props.variant) {
      case "added":
        return css`
          color: #fff;
          background-color: #1c5424;
        `;
      case "removed":
        return css`
          color: #fff;
          background-color: #903535;
        `;
      default:
        return null;
    }
  }}
`;
const VersionsItemControls = styled.div`
  padding: 1rem 2rem 2rem 2rem;

  & > button {
    margin-right: 0.8rem;
  }
`;
const Button = styled.button.attrs({ type: "button" })`
  font: inherit;
  color: inherit;
  background: transparent;
  padding: 0;
  border: 0;

  outline: none;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid #4694e6;

  &:focus,
  &:hover {
    background-color: #162f4e;
  }
`;

function FileItem(props: Props) {
  const [saveFileVersion] = useMutation<SaveFileVersionVariables>(
    SaveFileVersion
  );
  const [base, setBase] = React.useState<string>(props.file.versions[0].path);
  const baseVersion = props.file.versions.find(
    version => version.path === base
  );
  const noDifferences = props.file.versions.every(
    (version, index, versions) => version.content === versions[0].content
  );

  return (
    <Container expanded={props.expanded}>
      <BasenameContainer
        active={props.expanded}
        onClick={() => props.onExpand()}
      >
        {noDifferences ? (
          <IconPass
            style={{ position: "relative", top: "4px", marginRight: "0.2rem" }}
          />
        ) : (
          <IconWarning
            style={{ position: "relative", top: "4px", marginRight: "0.2rem" }}
          />
        )}{" "}
        {props.file.basename}
      </BasenameContainer>
      {props.expanded && (
        <VersionsContainer>
          {props.file.versions.map(version => (
            <VersionsItemContainer key={version.path}>
              <VersionsItemPath>{version.path}</VersionsItemPath>
              <VersionsItemCode>
                {version.path === baseVersion.path
                  ? version.content
                  : diffChars(
                      baseVersion.content || "",
                      version.content || ""
                    ).map(({ added, removed, value }, index) => (
                      <Diff
                        key={index}
                        variant={added ? "added" : removed ? "removed" : null}
                      >
                        {value}
                      </Diff>
                    ))}
              </VersionsItemCode>
              {!noDifferences && (
                <VersionsItemControls>
                  <Button
                    onClick={() =>
                      saveFileVersion({
                        variables: {
                          basename: props.file.basename,
                          content: version.content || ""
                        }
                      })
                    }
                  >
                    Keep this version
                  </Button>
                  <label htmlFor={`radio-${version.path}`}>
                    <input
                      type="radio"
                      id={`radio-${version.path}`}
                      name={`radio-${props.file.basename}`}
                      checked={version.path === base}
                      onChange={() => setBase(version.path)}
                    />{" "}
                    Base
                  </label>
                </VersionsItemControls>
              )}
            </VersionsItemContainer>
          ))}
        </VersionsContainer>
      )}
    </Container>
  );
}

export default FileItem;
