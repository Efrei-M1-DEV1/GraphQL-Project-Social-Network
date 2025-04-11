import { createContext } from "@repo/utils/create-context";
import { useState } from "react";

type FontSizeOption = "normal" | "larger" | "largest";
type ReadingTheme = "light" | "dark" | "sepia";

interface ReadingPreferencesContextType {
  fontSize: FontSizeOption;
  readingTheme: ReadingTheme;
  expandedParagraphs: Record<number, boolean>;
  showTableOfContents: boolean;
  fontSizeClasses: Record<FontSizeOption, string>;
  readingThemeClasses: Record<ReadingTheme, string>;
  cycleFontSize: () => void;
  cycleReadingTheme: () => void;
  toggleTableOfContents: () => void;
  toggleParagraph: (idx: number) => void;
}

export const [ReadingPreferencesProvider, useReadingPreferences] = createContext<ReadingPreferencesContextType>({
  strict: true,
  name: "ReadingPreferencesContext",
  errorMessage:
    "useReadingPreferences: `context` is undefined. Seems you forgot to wrap component within `<ReadingPreferencesProvider />`",
  hookName: "useReadingPreferences",
  providerName: "ReadingPreferencesProvider",
});

export const ReadingPreferencesProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [fontSize, setFontSize] = useState<FontSizeOption>("normal");
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>("light");
  const [expandedParagraphs, setExpandedParagraphs] = useState<Record<number, boolean>>({});
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  const fontSizeClasses = {
    normal: "text-base",
    larger: "text-lg",
    largest: "text-xl leading-relaxed",
  };

  const readingThemeClasses = {
    light: "bg-white text-gray-900",
    dark: "bg-gray-900 text-gray-100",
    sepia: "bg-amber-50 text-amber-900",
  };

  const cycleFontSize = () => {
    const sizes = ["normal", "larger", "largest"] as const;
    const currentIndex = sizes.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setFontSize(sizes[nextIndex]);
  };

  const cycleReadingTheme = () => {
    const themes = ["light", "dark", "sepia"] as const;
    const currentIndex = themes.indexOf(readingTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setReadingTheme(themes[nextIndex]);
  };

  const toggleTableOfContents = () => {
    setShowTableOfContents((prev) => !prev);
  };

  const toggleParagraph = (idx: number) => {
    setExpandedParagraphs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <ReadingPreferencesProvider
      value={{
        fontSize,
        readingTheme,
        expandedParagraphs,
        showTableOfContents,
        fontSizeClasses,
        readingThemeClasses,
        cycleFontSize,
        cycleReadingTheme,
        toggleTableOfContents,
        toggleParagraph,
      }}
    >
      {children}
    </ReadingPreferencesProvider>
  );
};
