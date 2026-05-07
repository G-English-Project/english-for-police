import { Activity, ChevronRight, Clock3, UserCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { StudentProgressSummary } from "@/models/admin.model";

export function StudentListCard({
  student,
  onOpen,
}: {
  student: StudentProgressSummary;
  onOpen: (userId: number) => void;
}) {
  return (
    <Card
      className="bg-card border border-border hover:border-primary/35 transition-all cursor-pointer group relative overflow-hidden police-shadow rounded-lg"
      onClick={() => onOpen(student.userId)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/15 group-hover:bg-secondary transition-colors" />

      <CardContent className="p-6 flex flex-col xl:flex-row xl:items-center gap-6">
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <div className="h-14 w-14 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors">
            <UserCircle className="h-9 w-9 text-primary/80 group-hover:text-primary" />
          </div>
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="font-black text-lg text-foreground tracking-tight truncate uppercase">
                {student.fullName}
              </h3>
              <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black tracking-widest px-2 py-0.5">
                {student.rank}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono flex items-center gap-2 truncate">
              <Activity className="h-3 w-3 text-secondary shrink-0" />
              {student.email}
            </p>
          </div>
        </div>

        <div className="w-full xl:w-80 space-y-3 bg-muted/25 p-4 rounded-lg border border-border/50">
          <div className="flex justify-between items-end text-[9px] font-black uppercase tracking-widest">
            <span className="text-muted-foreground">Mức sẵn sàng</span>
            <span className="text-primary">{student.completionPercentage}%</span>
          </div>
          <div className="flex gap-[3px] h-3">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-[2px] transition-all duration-500 ${
                  i < (student.completionPercentage / 100) * 15
                    ? "bg-primary"
                    : "bg-border/40"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between xl:justify-end gap-6">
          <div className="text-right flex items-center gap-2 text-xs text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            {student.lastActive}
          </div>
          <div className="text-right hidden 2xl:block">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Vai trò
            </p>
            <p className="text-sm font-bold text-foreground">{student.role}</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-all rounded-md"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
