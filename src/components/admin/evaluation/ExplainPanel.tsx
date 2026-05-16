import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExplainPanelProps {
  explain: string[];
}

export function ExplainPanel({ explain }: ExplainPanelProps) {
  if (!explain.length) return null;

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50 px-5 py-3">
        <CardTitle className="text-sm font-bold text-slate-900">
          Cách tính
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="explain" className="border-0">
            <AccordionTrigger className="px-5 py-3 text-xs font-semibold hover:no-underline">
              Xem giải thích chỉ số ({explain.length})
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4">
              <ul className="list-disc space-y-2 pl-4 text-xs leading-relaxed text-slate-600">
                {explain.map((line, i) => (
                  <li key={`${i}-${line.slice(0, 24)}`}>{line}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
