"use client";
import { LuCalendar } from "react-icons/lu";
import { useColorModeValue } from "./color-mode";

export function CalendarIcon({ size }: { size: number }) {
  const theme = useColorModeValue("light", "dark");

  return (
    <LuCalendar
      size={size}
      color={`${theme === "light" ? "gray.700" : "gray.200"}`}
    />
  );
}
