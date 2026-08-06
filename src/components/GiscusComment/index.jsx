import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';

export default function GiscusComment() {
  const { colorMode } = useColorMode();

  return (
    <Giscus
        repo="VanxoakTeam/vanxoakteam.github.io"
        repoId="R_kgDOPa6K2A"
        category="Q&A"
        categoryId="DIC_kwDOPa6K2M4CuHAB"
        mapping="title"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={colorMode}
        data-lang="zh-CN"
        loading="lazy"
        crossorigin="anonymous"
        async
    />
  );
}
