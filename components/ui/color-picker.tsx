"use client";

import { Slider } from "@base-ui/react/slider";
import { Pipette } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ComponentProps, PointerEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useControllableState } from "@/hooks/use-controllable-state";
import { Icon } from "@/lib/icon-context";
import { useShape } from "@/lib/shape-context";
import { SizeProvider, useSizeVariant } from "@/lib/size-context";
import type { SizeVariant } from "@/lib/size-context";
import { cn } from "@/lib/utils";

const subscribe = () => () => {
  // Feature availability is constant for the lifetime of the page.
};
type EyeDropperWindow = Window & {
  EyeDropper?: new () => {
    open: (options: { signal: AbortSignal }) => Promise<{ sRGBHex: string }>;
  };
};

interface HSV {
  h: number;
  s: number;
  v: number;
}
const normalizeHex = (text: string) => {
  const digits = text.trim().replace(/^#/u, "");
  if (!/^(?:[\da-f]{3}|[\da-f]{6})$/iu.test(digits)) {
    return null;
  }
  return `#${digits.length === 3 ? [...digits].map((digit) => digit + digit).join("") : digits}`.toUpperCase();
};
const toHSV = (hex: string): HSV => {
  const channels = [1, 3, 5].map(
    (start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255
  );
  const [r, g, b] = channels;
  const max = Math.max(...channels);
  const delta = max - Math.min(...channels);
  let sector = 0;
  if (delta > 0) {
    if (max === r) {
      sector = (g - b) / delta;
    } else if (max === g) {
      sector = (b - r) / delta + 2;
    } else {
      sector = (r - g) / delta + 4;
    }
  }
  return {
    h: (sector * 60 + 360) % 360,
    s: max === 0 ? 0 : delta / max,
    v: max,
  };
};
const toHex = ({ h, s, v }: HSV) => {
  const channel = (offset: number) => {
    const k = (offset + h / 60) % 6;
    return Math.round(255 * v * (1 - s * Math.max(0, Math.min(k, 4 - k, 1))))
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(5)}${channel(3)}${channel(1)}`.toUpperCase();
};
const swatchInk = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((start) => {
    const channel = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.179 ? "#0A0A0A" : "#FFFFFF";
};
export interface ColorSwatch {
  name: string;
  value: string;
}
// Palette and picker layout adapted from https://blode.co/ui/docs/components/color-picker
export const defaultColorSwatches: ColorSwatch[] = [
  { name: "Black", value: "#0A0A0A" },
  { name: "Graphite", value: "#333333" },
  { name: "Slate", value: "#636363" },
  { name: "Silver", value: "#989898" },
  { name: "Mist", value: "#D7D7D7" },
  { name: "White", value: "#FFFFFF" },
  { name: "Red", value: "#D9544B" },
  { name: "Orange", value: "#CF6400" },
  { name: "Amber", value: "#B27C00" },
  { name: "Lime", value: "#809100" },
  { name: "Green", value: "#24A042" },
  { name: "Teal", value: "#00A584" },
  { name: "Cyan", value: "#009FB9" },
  { name: "Azure", value: "#0091DE" },
  { name: "Blue", value: "#587EEB" },
  { name: "Violet", value: "#936BDE" },
  { name: "Magenta", value: "#BA5BBB" },
  { name: "Rose", value: "#D25188" },
];

export interface ColorPickerProps extends Omit<
  ComponentProps<"div">,
  "defaultValue" | "onChange"
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onValueCommit?: (value: string) => void;
  swatches?: ColorSwatch[];
  size?: SizeVariant;
  disabled?: boolean;
}
export const ColorPicker = ({
  value,
  defaultValue = "#6B97FF",
  onValueChange,
  onValueCommit,
  swatches = defaultColorSwatches,
  "aria-label": ariaLabel = "Color",
  size,
  disabled,
  className,
  id: triggerId,
  ...props
}: ColorPickerProps) => {
  const [color, setColor] = useControllableState({
    defaultValue,
    onChange: onValueChange,
    value,
  });
  const normalized = normalizeHex(color);
  const [draft, setDraft] = useState(color);
  const [lastHue, setLastHue] = useState(0);
  const [lastSaturation, setLastSaturation] = useState(0);
  const hsv = toHSV(normalized ?? "#6B97FF");
  if (hsv.s === 0 || hsv.v === 0) {
    hsv.h = lastHue;
  }
  if (hsv.v === 0) {
    hsv.s = lastSaturation;
  }
  const id = useId();
  const [activeSwatch, setActiveSwatch] = useState(0);
  const validSwatches = swatches.filter((swatch) => normalizeHex(swatch.value));
  const swatchRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const eyedropperAbort = useRef<AbortController | null>(null);
  const hasEyeDropper = useSyncExternalStore(
    subscribe,
    () => typeof (window as EyeDropperWindow).EyeDropper === "function",
    () => false
  );
  useEffect(() => () => eyedropperAbort.current?.abort(), []);
  useEffect(() => {
    if (disabled) {
      eyedropperAbort.current?.abort();
    }
  }, [disabled]);
  const saturationRef = useRef<HTMLInputElement>(null);
  const latestColor = useRef(normalized ?? "#6B97FF");
  const shape = useShape();
  const density = useSizeVariant(size);
  useEffect(() => {
    setDraft((current) =>
      normalizeHex(current) !== null &&
      normalizeHex(current) === normalizeHex(color)
        ? current
        : color
    );
  }, [color]);
  const change = (next: HSV) => {
    setLastHue(next.h);
    setLastSaturation(next.s);
    latestColor.current = toHex(next);
    setColor(latestColor.current);
  };
  const changeHex = (hex: string) => {
    const next = toHSV(hex);
    if (next.s === 0) {
      next.h = hsv.h;
    }
    if (next.v === 0) {
      next.s = hsv.s;
    }
    change(next);
  };
  const pickFromScreen = async () => {
    const { EyeDropper } = window as EyeDropperWindow;
    if (!EyeDropper || disabled) {
      return;
    }
    eyedropperAbort.current?.abort();
    const controller = new AbortController();
    eyedropperAbort.current = controller;
    try {
      const result = await new EyeDropper().open({ signal: controller.signal });
      const hex = normalizeHex(result.sRGBHex);
      if (hex && !controller.signal.aborted) {
        changeHex(hex);
        setDraft(hex);
        onValueCommit?.(hex);
      }
    } catch {
      /* Dismissing the screen picker leaves the color unchanged. */
    }
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }
    change({
      ...hsv,
      s: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      v: Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height)),
    });
  };
  return (
    <SizeProvider size={density}>
      <div className={cn("w-44 max-w-full", className)} {...props}>
        <Popover
          onOpenChange={(open) => {
            if (!open) {
              eyedropperAbort.current?.abort();
            }
          }}
        >
          <PopoverTrigger
            id={triggerId}
            aria-invalid={!normalized || undefined}
            disabled={disabled}
            aria-label={`${ariaLabel}, ${normalized ?? "invalid color"}`}
            render={
              <Button variant="outline" className="w-full justify-start" />
            }
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-5 shrink-0 ring-1 ring-inset ring-foreground/15",
                shape
              )}
              style={{ backgroundColor: normalized ?? "transparent" }}
            />
            <span className="min-w-0 truncate text-left font-normal tabular-nums">
              {normalized ?? color}
            </span>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            aria-label={`${ariaLabel} picker`}
            className={cn(
              "flex w-64 max-w-[calc(100vw-2rem)] flex-col gap-3 p-3",
              shape
            )}
          >
            <div
              role="group"
              aria-label="Saturation and brightness"
              className={cn(
                "relative h-40 touch-none select-none focus-within:ring-2 focus-within:ring-ring",
                shape
              )}
              style={{
                background: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, hsl(${hsv.h} 100% 50%))`,
              }}
              onPointerDown={(event) => {
                if (disabled || event.button !== 0) {
                  return;
                }
                event.preventDefault();
                saturationRef.current?.focus();
                event.currentTarget.setPointerCapture(event.pointerId);
                move(event);
              }}
              onPointerMove={(event) => {
                if (
                  !disabled &&
                  event.currentTarget.hasPointerCapture(event.pointerId)
                ) {
                  move(event);
                }
              }}
              onPointerUp={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  if (!disabled) {
                    move(event);
                    onValueCommit?.(latestColor.current);
                  }
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white ring-1 ring-black/40 shadow-sm"
                style={{
                  backgroundColor: normalized ?? undefined,
                  left: `${hsv.s * 100}%`,
                  top: `${(1 - hsv.v) * 100}%`,
                }}
              />
              <Slider.Root
                disabled={disabled}
                value={hsv.s * 100}
                onValueChange={(s) => change({ ...hsv, s: s / 100 })}
                onValueCommitted={(s) =>
                  onValueCommit?.(toHex({ ...hsv, s: s / 100 }))
                }
                className="sr-only"
              >
                <Slider.Control>
                  <Slider.Track />
                  <Slider.Thumb
                    inputRef={saturationRef}
                    aria-label="Saturation"
                    aria-valuetext={`${Math.round(hsv.s * 100)}%, ${normalized}`}
                  />
                </Slider.Control>
              </Slider.Root>
              <Slider.Root
                disabled={disabled}
                value={hsv.v * 100}
                onValueChange={(v) => change({ ...hsv, v: v / 100 })}
                onValueCommitted={(v) =>
                  onValueCommit?.(toHex({ ...hsv, v: v / 100 }))
                }
                className="sr-only"
              >
                <Slider.Control>
                  <Slider.Track />
                  <Slider.Thumb aria-label="Brightness" />
                </Slider.Control>
              </Slider.Root>
            </div>
            <Slider.Root
              disabled={disabled}
              value={hsv.h}
              min={0}
              max={359}
              onValueChange={(h) => change({ ...hsv, h })}
              onValueCommitted={(h) => onValueCommit?.(toHex({ ...hsv, h }))}
            >
              <Slider.Control className="relative flex h-6 touch-none items-center">
                <Slider.Track
                  className="h-3 w-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
                  }}
                />
                <Slider.Thumb
                  aria-label="Hue"
                  className="size-6 rounded-full border-2 border-white ring-1 ring-black/40 shadow-sm outline-none focus-within:ring-2 focus-within:ring-ring"
                  style={{ backgroundColor: `hsl(${hsv.h} 100% 50%)` }}
                />
              </Slider.Control>
            </Slider.Root>
            <div className="flex items-center gap-2">
              <Input
                id={id}
                aria-label="Hex color"
                maxLength={7}
                value={draft}
                disabled={disabled}
                spellCheck={false}
                autoComplete="off"
                aria-invalid={!normalizeHex(draft) || undefined}
                className="min-w-0 flex-1 tabular-nums"
                onChange={(event) => setDraft(event.target.value)}
                onBlur={() => {
                  const valid = normalizeHex(draft);
                  setDraft(valid ?? normalized ?? color);
                  if (!disabled && valid && valid !== normalized) {
                    changeHex(valid);
                    onValueCommit?.(valid);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    const valid = normalizeHex(draft);
                    setDraft(valid ?? normalized ?? color);
                    if (!disabled && valid && valid !== normalized) {
                      changeHex(valid);
                      onValueCommit?.(valid);
                    }
                  }
                }}
              />
              {hasEyeDropper && (
                <Button
                  type="button"
                  variant="outline"
                  size={density === "compact" ? "icon-compact" : "icon"}
                  aria-label="Pick a color from the screen"
                  disabled={disabled}
                  onClick={pickFromScreen}
                >
                  <Pipette aria-hidden="true" className="size-4" />
                </Button>
              )}
            </div>
            {validSwatches.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-border pt-3">
                <span
                  id={`${id}-suggested`}
                  className="text-xs text-muted-foreground"
                >
                  Suggested
                </span>
                <div
                  role="group"
                  aria-labelledby={`${id}-suggested`}
                  className="grid grid-cols-6 gap-2"
                >
                  {validSwatches.map((swatch, index) => {
                    const hex = normalizeHex(swatch.value);
                    if (!hex) {
                      return null;
                    }
                    return (
                      <Button
                        key={`${swatch.name}-${hex}`}
                        type="button"
                        variant="ghost"
                        disabled={disabled}
                        aria-label={`${swatch.name}, ${hex}`}
                        aria-pressed={hex === normalized}
                        ref={(node) => {
                          swatchRefs.current[index] = node;
                        }}
                        tabIndex={
                          index ===
                          Math.min(activeSwatch, validSwatches.length - 1)
                            ? 0
                            : -1
                        }
                        onFocus={() => setActiveSwatch(index)}
                        onKeyDown={(event) => {
                          const positions: Record<string, number> = {
                            ArrowDown: index + 6,
                            ArrowLeft: index - 1,
                            ArrowRight: index + 1,
                            ArrowUp: index - 6,
                            End: validSwatches.length - 1,
                            Home: 0,
                          };
                          if (positions[event.key] === undefined) {
                            return;
                          }
                          event.preventDefault();
                          const next = Math.max(
                            0,
                            Math.min(
                              validSwatches.length - 1,
                              positions[event.key]
                            )
                          );
                          swatchRefs.current[next]?.focus();
                        }}
                        className={cn(
                          "size-7 p-0 hover:scale-105 ring-1 ring-inset ring-foreground/15 focus-visible:ring-2 focus-visible:ring-ring",
                          hex === normalized &&
                            "ring-2 ring-foreground ring-offset-2 ring-offset-popover"
                        )}
                        style={{ backgroundColor: hex }}
                        onClick={() => {
                          changeHex(hex);
                          setDraft(hex);
                          onValueCommit?.(hex);
                        }}
                      >
                        {hex === normalized && (
                          <Icon
                            name="check"
                            className="size-3.5"
                            style={{
                              color: swatchInk(hex),
                            }}
                          />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </SizeProvider>
  );
};
