import React, { FC } from "react";
import { Header } from "zmp-ui";
import { useRecoilValueLoadable } from "recoil";
import { userState } from "state";

export const Welcome: FC = () => {
  const user = useRecoilValueLoadable(userState);
  const name = user.state === "hasValue" ? user.contents.name : "";

  return (
    <Header
      className="app-header no-border pl-4 flex-none pb-[6px]"
      showBackIcon={false}
      title={`Xin chào${name ? `, ${name}` : ""}`}
    />
  );
};