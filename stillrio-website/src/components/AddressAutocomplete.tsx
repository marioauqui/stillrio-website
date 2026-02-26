"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

async function searchLocations(query: string): Promise<Suggestion[]> {
  if (!query.trim() || query.length < 2) return [];
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default function AddressAutocomplete({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const justSelectedRef = useRef(false);

  const fetchSuggestions = useCallback(async (q: string, skipOpen = false) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const results = await searchLocations(q);
      setSuggestions(results);
      setHighlightIndex(-1);
      if (!skipOpen && results.length > 0) setIsOpen(true);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      justSelectedRef.current = false;
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value, justSelectedRef.current);
      justSelectedRef.current = false;
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(s: Suggestion) {
    justSelectedRef.current = true;
    onChange(s.display_name);
    setIsOpen(false);
    setSuggestions([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && highlightIndex >= 0 && suggestions[highlightIndex]) {
      e.preventDefault();
      handleSelect(suggestions[highlightIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="mt-1 w-full rounded-xl border border-slate-300/80 bg-white/95 px-4 py-2 pr-10 text-slate-900 transition-all duration-200 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-1"
        />
        {isLoading && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2"
            aria-hidden
          >
            <svg className="h-5 w-5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </span>
        )}
      </div>
      {isOpen && suggestions.length > 0 && (
        <ul
          className="absolute left-0 right-0 z-[100] mt-1 max-h-36 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
          role="listbox"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.lat}-${s.lon}-${i}`}
              role="option"
              aria-selected={i === highlightIndex}
              className={`cursor-pointer px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 ${i === highlightIndex ? "bg-slate-100" : ""}`}
              onMouseEnter={() => setHighlightIndex(i)}
              onClick={() => handleSelect(s)}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
