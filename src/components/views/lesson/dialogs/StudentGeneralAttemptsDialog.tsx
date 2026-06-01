import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import type { GeneralAttemptStudentDetail } from "@/models/general-attempts.model";
import { AttemptsStatsSummary } from "../charts/AttemptsStatsSummary";
import { AttemptsTrendChart } from "../charts/AttemptsTrendChart";
import { ChapterStatsChart } from "../charts/ChapterStatsChart";
import { AttemptsDetailTable } from "../charts/AttemptsDetailTable";

interface StudentGeneralAttemptsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: GeneralAttemptStudentDetail | null;
  isLoading: boolean;
  error: Error | null;
}

export const StudentGeneralAttemptsDialog: React.FC<
  StudentGeneralAttemptsDialogProps
> = ({ open, onOpenChange, data, isLoading, error }) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!data && !isLoading && !error) {
    return null;
  }

  const allAttempts = data?.chapters.flatMap((c) => c.attempts) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading attempts data...
              </span>
            ) : error ? (
              <span className="text-red-600">Error loading data</span>
            ) : (
              `${data?.fullName} - General Test Attempts`
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p className="font-semibold">{error.message}</p>
          </div>
        ) : data ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="chapters">By Chapter</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <AttemptsStatsSummary data={data} />
              {allAttempts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No attempts recorded yet
                </div>
              )}
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              {allAttempts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No attempts to display trends
                </div>
              ) : (
                <AttemptsTrendChart attempts={allAttempts} />
              )}
            </TabsContent>

            <TabsContent value="chapters" className="space-y-6">
              {data.chapters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No chapter data available
                </div>
              ) : (
                <ChapterStatsChart chapters={data.chapters} />
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              {allAttempts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No attempts to display
                </div>
              ) : (
                <AttemptsDetailTable data={data} />
              )}
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
