# Debug react hydration error in permissions page
_Exported on 12/11/2025 at 21:14:40 GMT+3:30 from Cursor (2.2.14)_

---

**User**

Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:
- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

See more info here: https://nextjs.org/docs/messages/react-hydration-error


  ...
    <RenderFromTemplateContext>
      <ScrollAndFocusHandler segmentPath={[...]}>
        <InnerScrollAndFocusHandler segmentPath={[...]} focusAndScrollRef={{apply:false, ...}}>
          <ErrorBoundary errorComponent={undefined} errorStyles={undefined} errorScripts={undefined}>
            <LoadingBoundary name="permissions/" loading={null}>
              <HTTPAccessFallbackBoundary notFound={undefined} forbidden={undefined} unauthorized={undefined}>
                <RedirectBoundary>
                  <RedirectErrorBoundary router={{...}}>
                    <InnerLayoutRouter url="/permissions" tree={[...]} params={{}} cacheNode={{lazyData:null, ...}} ...>
                      <SegmentViewNode type="page" pagePath="/apps/web/...">
                        <SegmentTrieNode>
                        <PermissionsPage>
                          <PermissionsPageContent allPermissions={[...]} userPermissions={[...]} username="user">
                            <Box sx={{...}}>
                              <Styled(div) as="div" ref={null} className="MuiBox-root" theme={{...}} sx={{...}}>
                                <Insertion>
+                               <div className="MuiBox-root css-1j8tqr">
-                               <style data-emotion="css-global 18fyyj6" data-s="">
                      ...
                    ...
          ...
component/permission/PermissionsPageContent.tsx (17:5) @ PermissionsPageContent


  15 |
  16 |   return (
> 17 |     <Box
     |     ^
  18 |       sx={{
  19 |         minHeight: "100vh",
  20 |         background:

---

**Cursor**

Let me investigate the hydration error in your `PermissionsPageContent.tsx` file.

I found the issue! You're using **MUI with Emotion** in **Next.js App Router**, but you're missing the **Emotion cache registry** for proper SSR support. This is causing the hydration mismatch because Emotion generates styles differently on server vs client without proper configuration.

## The Problem

The error shows:
- **Server**: `<style data-emotion="css-global 18fyyj6">`  
- **Client**: `<div className="MuiBox-root css-1j8tqr">`

Emotion is inserting styles at different positions during SSR vs client hydration.

## The Solution

You need to create an **Emotion cache registry** component. Here's how to fix it:

### 1. Create a new file `apps/web/component/EmotionRegistry.tsx`:

```typescript:apps/web/component/EmotionRegistry.tsx
"use client";

import { useState } from "react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";

interface EmotionRegistryProps {
  children: React.ReactNode;
}

export default function EmotionRegistry({ children }: EmotionRegistryProps) {
  const [cache] = useState(() => {
    const cache = createCache({ key: "mui" });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) return null;

    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
```

### 2. Update `apps/web/component/Providers.tsx`:

```typescript:apps/web/component/Providers.tsx
"use client";

import { memo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../lib/theme";
import EmotionRegistry from "./EmotionRegistry";

interface IProvidersProps {
  children: React.ReactNode;
}

const Providers = (props: IProvidersProps) => {
  const { children } = props;
  return (
    <EmotionRegistry>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionRegistry>
  );
};

export default memo(Providers);
```

### 3. Install the required package (if not already installed):

```bash
npm install @emotion/cache
```

Or with pnpm:
```bash
pnpm add @emotion/cache --filter web
```

---

## Why This Works

The `EmotionRegistry` component:
1. Creates a stable Emotion cache with the key `"mui"`
2. Uses `useServerInsertedHTML` to inject the generated styles during SSR
3. Ensures both server and client use the same cache, preventing hydration mismatches

This is the official recommended approach for using MUI with Next.js App Router.

---

You're currently in **ask mode** - if you'd like me to apply these changes directly, please switch to **agent mode**.

```typescript
"use client";

import { useState } from "react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";

interface EmotionRegistryProps {
  children: React.ReactNode;
}

export default function EmotionRegistry({ children }: EmotionRegistryProps) {
  const [cache] = useState(() => {
    const cache = createCache({ key: "mui" });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) return null;

    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
```

```typescript
"use client";

import { memo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../lib/theme";
import EmotionRegistry from "./EmotionRegistry";

interface IProvidersProps {
  children: React.ReactNode;
}

const Providers = (props: IProvidersProps) => {
  const { children } = props;
  return (
    <EmotionRegistry>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionRegistry>
  );
};

export default memo(Providers);
```

```shellscript
npm install @emotion/cache
```

```shellscript
pnpm add @emotion/cache --filter web
```

---

**User**

implement in my code

---

**Cursor**

```typescriptreact
"use client";

import { useState } from "react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";

interface EmotionRegistryProps {
  children: React.ReactNode;
}

export default function EmotionRegistry({ children }: EmotionRegistryProps) {
  const [cache] = useState(() => {
    const cache = createCache({ key: "mui" });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) return null;

    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

```

```typescriptreact
"use client";

import { memo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../lib/theme";
import EmotionRegistry from "./EmotionRegistry";

interface IProvidersProps {
  children: React.ReactNode;
}

const Providers = (props: IProvidersProps) => {
  const { children } = props;
  return (
    <EmotionRegistry>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionRegistry>
  );
};

export default memo(Providers);

```

Done! I've implemented the Emotion SSR fix:

1. **Created** `apps/web/component/EmotionRegistry.tsx` - handles proper Emotion cache for SSR
2. **Updated** `apps/web/component/Providers.tsx` - wrapped with `EmotionRegistry`
3. **Installed** `@emotion/cache` package

Your dev server is already running, so the changes should be picked up automatically. Refresh your browser and the hydration error should be resolved.

The `EmotionRegistry` component ensures that:
- Emotion styles are generated consistently on both server and client
- Styles are properly injected during SSR using `useServerInsertedHTML`
- The same cache is used throughout, preventing the mismatch you were seeing

