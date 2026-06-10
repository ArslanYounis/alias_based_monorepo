import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDarkMode } from "@/hooks/useDarkMode";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get _store() { return store; },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock, writable: true });

// Mock matchMedia
const matchMediaMock = vi.fn((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));
Object.defineProperty(window, "matchMedia", { value: matchMediaMock, writable: true });

describe("useDarkMode", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    // Reset document classes
    document.documentElement.classList.remove("dark");
    // Reset matchMedia to return false (light preference) by default
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  it("returns [isDarkMode, toggleDarkMode] tuple", () => {
    const { result } = renderHook(() => useDarkMode());
    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(2);
    expect(typeof result.current[0]).toBe("boolean");
    expect(typeof result.current[1]).toBe("function");
  });

  it("initializes to false when no saved theme and system prefers light", () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(false);
  });

  it("initializes to true when system prefers dark and no saved theme", () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    localStorageMock.getItem.mockReturnValue(null as unknown as string);
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(true);
  });

  it("initializes to true when localStorage has 'dark' theme", () => {
    localStorageMock.getItem.mockReturnValue("dark");
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(true);
  });

  it("initializes to false when localStorage has 'light' theme", () => {
    localStorageMock.getItem.mockReturnValue("light");
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(false);
  });

  // ── DOM side effects ───────────────────────────────────────────────────────

  it("adds 'dark' class to documentElement when isDarkMode=true", () => {
    localStorageMock.getItem.mockReturnValue("dark");
    renderHook(() => useDarkMode());
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes 'dark' class from documentElement when isDarkMode=false", () => {
    document.documentElement.classList.add("dark");
    localStorageMock.getItem.mockReturnValue("light");
    renderHook(() => useDarkMode());
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists 'dark' to localStorage when dark mode is active", () => {
    localStorageMock.getItem.mockReturnValue("dark");
    renderHook(() => useDarkMode());
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("persists 'light' to localStorage when light mode is active", () => {
    localStorageMock.getItem.mockReturnValue("light");
    renderHook(() => useDarkMode());
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light");
  });

  // ── Toggle ─────────────────────────────────────────────────────────────────

  it("toggleDarkMode switches from false to true", () => {
    localStorageMock.getItem.mockReturnValue("light");
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(false);

    act(() => { result.current[1](); });

    expect(result.current[0]).toBe(true);
  });

  it("toggleDarkMode switches from true to false", () => {
    localStorageMock.getItem.mockReturnValue("dark");
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(true);

    act(() => { result.current[1](); });

    expect(result.current[0]).toBe(false);
  });

  it("adds 'dark' class after toggling from light to dark", () => {
    localStorageMock.getItem.mockReturnValue("light");
    const { result } = renderHook(() => useDarkMode());

    act(() => { result.current[1](); });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes 'dark' class after toggling from dark to light", () => {
    localStorageMock.getItem.mockReturnValue("dark");
    const { result } = renderHook(() => useDarkMode());

    act(() => { result.current[1](); });

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("updates localStorage after toggle", () => {
    localStorageMock.getItem.mockReturnValue("light");
    const { result } = renderHook(() => useDarkMode());

    act(() => { result.current[1](); });

    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("double toggle returns to original state", () => {
    localStorageMock.getItem.mockReturnValue("light");
    const { result } = renderHook(() => useDarkMode());

    act(() => { result.current[1](); });
    act(() => { result.current[1](); });

    expect(result.current[0]).toBe(false);
  });
});
