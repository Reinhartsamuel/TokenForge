"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";

interface CorporateAction {
  id: string;
  tokenId: string;
  type: string;
  title: string;
  description: string | null;
  status: string | null;
  executionDate: string | null;
  snapshotDate: string | null;
  totalAmount: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export default function CorporateActionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const actionId = params.id as string;

  const [action, setAction] = useState<CorporateAction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/corporate-actions/${actionId}`);
        if (res.ok) {
          const data = await res.json();
          setAction(data.action);
        }
      } catch (err) {
        console.error("Failed to fetch corporate action:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [actionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!action) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Corporate action not found</p>
        <Link href="/dashboard/corporate-actions">
          <Button variant="link">Back to corporate actions</Button>
        </Link>
      </div>
    );
  }

  const actionTypeLabels: Record<string, string> = {
    dividend: "Dividend",
    vote: "Vote",
    buyback: "Buyback",
    snapshot: "Snapshot",
    forced_transfer: "Forced Transfer",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/corporate-actions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{action.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{actionTypeLabels[action.type] || action.type}</p>
          </div>
        </div>
        <StatusBadge status={action.status || "pending"} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Action Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Type</div>
              <Badge variant="outline">{actionTypeLabels[action.type] || action.type}</Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <StatusBadge status={action.status || "pending"} />
            </div>
            {action.executionDate && (
              <div>
                <div className="text-sm text-muted-foreground">Execution Date</div>
                <div className="text-foreground">{new Date(action.executionDate).toLocaleDateString()}</div>
              </div>
            )}
            {action.snapshotDate && (
              <div>
                <div className="text-sm text-muted-foreground">Snapshot Date</div>
                <div className="text-foreground">{new Date(action.snapshotDate).toLocaleDateString()}</div>
              </div>
            )}
            {action.totalAmount && (
              <div>
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-foreground">{action.totalAmount}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="text-foreground">{new Date(action.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Last Updated</div>
              <div className="text-foreground">{new Date(action.updatedAt).toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {action.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap">{action.description}</p>
          </CardContent>
        </Card>
      )}

      {action.metadata && Object.keys(action.metadata).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm text-foreground">
              {JSON.stringify(action.metadata, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
