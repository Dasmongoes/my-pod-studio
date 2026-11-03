import { Ruler } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SIZE_CHART } from "@/config/sizeChart";

// "Size Guide" link that opens the measurement table.
const SizeGuide = () => (
  <Dialog>
    <DialogTrigger className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4">
      <Ruler className="w-3.5 h-3.5" />
      Size Guide
    </DialogTrigger>
    <DialogContent className="max-w-md">
      <DialogTitle className="text-display text-3xl uppercase">Size Guide</DialogTitle>
      <DialogDescription>
        Unisex oversized fit with drop shoulders. Measurements are in inches and may vary slightly. For a closer fit,
        consider sizing down.
      </DialogDescription>
      <table className="w-full text-sm text-center">
        <thead>
          <tr className="border-b border-border text-[10px] uppercase tracking-widest">
            <th scope="col" className="py-3 text-left font-bold">Size</th>
            <th scope="col" className="py-3 font-bold">Chest</th>
            <th scope="col" className="py-3 font-bold">Length</th>
            <th scope="col" className="py-3 font-bold">Shoulder</th>
          </tr>
        </thead>
        <tbody>
          {SIZE_CHART.map(({ size, chest, length, shoulder }) => (
            <tr key={size} className="border-b border-border/60 text-muted-foreground">
              <th scope="row" className="py-3 text-left font-semibold text-foreground">{size}</th>
              <td className="py-3">{chest}</td>
              <td className="py-3">{length}</td>
              <td className="py-3">{shoulder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DialogContent>
  </Dialog>
);

export default SizeGuide;
