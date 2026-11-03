import {
  ShopifyProduct,
  isColorOption,
  isOptionValueAvailable,
  optionLabel,
  sortOptionValues,
  swatchColor,
} from "@/lib/shopify";
import { cn } from "@/lib/utils";
import SizeGuide from "@/components/SizeGuide";

interface VariantPickerProps {
  product: ShopifyProduct;
  selected: Record<string, string>;
  onChange: (optionName: string, value: string) => void;
  compact?: boolean;
}

// Colour swatches + size buttons. Combinations that are sold out are shown crossed out.
const VariantPicker = ({ product, selected, onChange, compact = false }: VariantPickerProps) => {
  const options = product.options.filter(
    (o) => !(o.values.length === 1 && o.values[0] === "Default Title"),
  );

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      {options.map((option) => {
        const values = sortOptionValues(option.name, option.values);
        const isColor = isColorOption(option.name);

        return (
          <div key={option.name} className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-foreground">
                {optionLabel(option.name)}:
                <span className="text-muted-foreground font-medium ml-1.5">{selected[option.name]}</span>
              </p>
              {option.name.toLowerCase() === "size" && <SizeGuide />}
            </div>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={optionLabel(option.name)}>
              {values.map((val) => {
                const isSelected = selected[option.name] === val;
                const available = isOptionValueAvailable(product, selected, option.name, val);
                const swatch = isColor ? swatchColor(val) : null;

                if (swatch) {
                  return (
                    <button
                      key={val}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${val}${available ? "" : " (sold out)"}`}
                      title={available ? val : `${val} — sold out`}
                      onClick={() => onChange(option.name, val)}
                      className={cn(
                        "relative w-9 h-9 rounded-full border-2 transition-all",
                        isSelected
                          ? "border-foreground scale-110"
                          : "border-border hover:border-foreground/60",
                        !available && "opacity-40",
                      )}
                    >
                      <span
                        className="absolute inset-1 rounded-full border border-white/30"
                        style={{ backgroundColor: swatch }}
                      />
                      {!available && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="block w-full h-px bg-foreground rotate-45" />
                        </span>
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={val}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${val}${available ? "" : " (sold out)"}`}
                    onClick={() => onChange(option.name, val)}
                    className={cn(
                      "min-w-12 border text-xs uppercase font-medium transition-all",
                      compact ? "px-3 py-2" : "px-4 py-3",
                      isSelected
                        ? "bg-foreground text-background border-foreground font-bold"
                        : "border-border hover:border-foreground/40 text-foreground",
                      !available && !isSelected && "text-muted-foreground line-through decoration-1",
                    )}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VariantPicker;
