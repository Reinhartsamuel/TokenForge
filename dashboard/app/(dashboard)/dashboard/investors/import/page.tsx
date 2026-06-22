"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Upload, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Papa from "papaparse";

interface ImportResult {
  imported: number;
  errors: number;
  errorDetails: string[];
}

export default function ImportInvestorsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setPreview(results.data.slice(0, 5));
      },
      error: (error) => {
        toast.error("Failed to parse CSV file");
      },
    });
  }

  async function handleImport() {
    if (preview.length === 0) {
      toast.error("No data to import");
      return;
    }

    setLoading(true);
    try {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = fileInput?.files?.[0];
      if (!file) {
        toast.error("No file selected");
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const investors = results.data.map((row: any) => ({
            name: row.name || row.Name,
            email: row.email || row.Email,
            walletAddress: row.walletAddress || row.wallet_address || row.Wallet,
            entityType: row.entityType || row.entity_type || "individual",
            jurisdiction: row.jurisdiction || row.Jurisdiction,
            kycStatus: row.kycStatus || row.kyc_status || "pending",
            accreditationStatus: row.accreditationStatus || row.accreditation_status || "pending",
            amlStatus: row.amlStatus || row.aml_status || "pending",
            notes: row.notes || row.Notes,
          }));

          const res = await fetch("/api/investors/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ investors }),
          });

          if (res.ok) {
            const data = await res.json();
            setResult(data);
            toast.success(`Imported ${data.imported} investors`);
          } else {
            toast.error("Failed to import investors");
          }
        },
      });
    } catch (err) {
      toast.error("Failed to import investors");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/investors">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Import Investors</h1>
          <p className="text-sm text-muted-foreground mt-1">Bulk import investors from CSV file</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Upload CSV File</CardTitle>
          <CardDescription className="text-muted-foreground">
            CSV should include columns: name, email, walletAddress, entityType, jurisdiction, kycStatus
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>

          {preview.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">Preview (first 5 rows)</div>
              <div className="border border-border rounded-md overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {Object.keys(preview[0]).map((key) => (
                        <th key={key} className="px-3 py-2 text-left text-muted-foreground font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        {Object.values(row).map((value, j) => (
                          <td key={j} className="px-3 py-2 text-foreground">
                            {String(value || "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button onClick={handleImport} disabled={loading || preview.length === 0}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Import Investors
            </Button>
            <Link href="/dashboard/investors">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Import Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-foreground">{result.imported} investors imported</span>
              </div>
              {result.errors > 0 && (
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-foreground">{result.errors} errors</span>
                </div>
              )}
            </div>

            {result.errorDetails.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">Errors:</div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {result.errorDetails.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <Link href="/dashboard/investors">
              <Button>View All Investors</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
