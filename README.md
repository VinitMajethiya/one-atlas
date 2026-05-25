# OneAtlas — AI-Native Operational App Workspace

OneAtlas is an AI-native platform for generating and deploying secure, enterprise-grade internal tools, dashboards, and databases from abstract schemas.

---

## Local Setup (≤ 5 Commands)

To run the application locally, execute the following commands in order:

```bash
# 1. Install all dependencies
npm install

# 2. Start the local Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Environment Variables

Configure these variables inside your `.env.local` file:

```bash
# The absolute URL endpoint of the hosted application (for preview mappings)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Architectural Decision: Zustand for Builder State Management

For the builder console state (managing active schemas, selections, panels, and prompting logs), we selected **Zustand** instead of standard React Context.

### Rationale:
1. **Granular Rerendering Control:** The builder contains deeply nested visual components (ComponentTree, CanvasPanel, PropsPanel) that update frequently. React Context triggers a render of the entire DOM tree whenever any state slice changes. Zustand allows components to subscribe only to specific selectors, preventing unnecessary re-renders.
2. **Built-in LocalStorage Persistence:** The preview snapshot mechanism relies on tokens mapping to frozen schemas. Zustand's built-in `persist` middleware allows us to save snapshot datasets inside the browser's `localStorage` with zero boilerplate, ensuring preview links resolve successfully across browser refreshes.
3. **Decoupled Business Logic:** Toggling panels, updating component props, and inserting prompts are handled inside actions defined in `useBuilderStore.ts` directly, keeping component code dry, readable, and highly testable.
