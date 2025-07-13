"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type GetImpactInsightsOutput } from "@/ai/flows/get-impact-insights";
import { calculateImpactAction } from "@/app/actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Zap, Mountain, Gauge } from "lucide-react";

const formSchema = z.object({
  deviceType: z.string({ required_error: "Please select a device type." }),
  brand: z.string().optional(),
  model: z.string().optional(),
  ageMonths: z.coerce.number().min(0, "Age cannot be negative.").max(240, "Age seems too high."),
  condition: z.enum(["good", "fair", "poor"], { required_error: "Please select the device's condition." }),
});

export function ImpactCalculator() {
  const [result, setResult] = useState<GetImpactInsightsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ageMonths: 12,
      deviceType: "smartphone",
      condition: "fair",
      brand: "",
      model: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setResult(null);

    const response = await calculateImpactAction(values);

    if (response.error) {
      setError(response.error);
    } else if (response.result) {
      setResult(response.result);
    }

    setLoading(false);
  }
  
  const chartConfig = {
    value: { label: "Grams", color: "hsl(var(--primary))" },
  } satisfies ChartConfig;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Calculate Your Device's Impact</CardTitle>
        <CardDescription>Enter your device details to estimate its environmental footprint and recoverable value.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="deviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a device" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="smartphone">Smartphone</SelectItem>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="desktop_pc">Desktop PC</SelectItem>
                        <SelectItem value="television">Television</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="ageMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (in months)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Apple, Samsung" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., iPhone 14, Galaxy S23" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Condition</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col md:flex-row gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="good" />
                        </FormControl>
                        <FormLabel className="font-normal">Good</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fair" />
                        </FormControl>
                        <FormLabel className="font-normal">Fair</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="poor" />
                        </FormControl>
                        <FormLabel className="font-normal">Poor</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Calculating..." : "Calculate Impact"}
            </Button>
          </form>
        </Form>
        {error && (
            <Alert variant="destructive" className="mt-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {result && (
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-2xl font-headline font-semibold mb-4 text-primary">Impact Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CO₂ Equivalent</CardTitle>
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{result.co2eq} kg</div>
                  <p className="text-xs text-muted-foreground">Estimated carbon footprint</p>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Impact Summary</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{result.impactSummary}</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Mountain className="h-5 w-5 text-muted-foreground" /> Recoverable Raw Materials</CardTitle>
                  <CardDescription>Estimated amount of valuable materials that can be recovered.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                    <BarChart accessibilityLayer data={[
                        { name: "Gold", value: result.rawMaterials.gold },
                        { name: "Copper", value: result.rawMaterials.copper },
                        { name: "Rare Earths", value: result.rawMaterials.rareEarths },
                    ]}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis tickFormatter={(value) => `${value}g`}/>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="value" fill="var(--color-value)" radius={5} />
                    </BarChart>
                    </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}