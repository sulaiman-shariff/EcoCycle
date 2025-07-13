"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type GetImpactInsightsOutput } from "@/ai/flows/get-impact-insights";
import { calculateImpactAction } from "@/app/actions";
import { getDeviceTypes } from "@/lib/impact-calculator";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Zap, Mountain, Gauge, Tree, Car, Smartphone, Leaf, Droplets, Trash2, Clock, Scale, Calculator, TrendingUp, Globe, Shield, Award, Sparkles, Target, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

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

  const pieChartConfig = {
    value: { label: "kg CO2e", color: "hsl(var(--primary))" },
  } satisfies ChartConfig;

  const deviceTypes = getDeviceTypes();

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Environmental Impact Calculator
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">Powered by EPA data and real-time environmental metrics</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="w-3 h-3 mr-1" />
            EPA Compliant
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Globe className="w-3 h-3 mr-1" />
            Real-time Data
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Award className="w-3 h-3 mr-1" />
            Scientific Accuracy
          </Badge>
        </div>
      </div>

      {/* Form Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            Device Information
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your device details to calculate its environmental footprint and recoverable value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="deviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Device Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 sm:h-12 bg-white border-2 hover:border-green-300 focus:border-green-500 transition-colors">
                            <SelectValue placeholder="Select a device" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {deviceTypes.map((device) => (
                            <SelectItem key={device.value} value={device.value}>
                              {device.label}
                            </SelectItem>
                          ))}
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
                      <FormLabel className="text-sm font-medium">Age (in months)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 24" 
                          className="h-10 sm:h-12 bg-white border-2 hover:border-green-300 focus:border-green-500 transition-colors"
                          {...field} 
                        />
                      </FormControl>
<<<<<<< HEAD
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
=======
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
>>>>>>> 34b20041bf5aeeeae8300bead3f52ce1966d2966
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem className="space-y-3 sm:space-y-4">
                    <FormLabel className="text-sm font-medium">Device Condition</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
                      >
                        <div className="relative">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="good" className="sr-only" />
                            </FormControl>
                            <Label 
                              htmlFor="good" 
                              className="flex flex-col items-center justify-center w-full h-16 sm:h-20 p-3 sm:p-4 text-xs sm:text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 hover:border-green-300 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 transition-all duration-200"
                            >
                              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-600 rounded-full"></div>
                              </div>
                              <span>Good</span>
                              <span className="text-xs text-gray-500">Like new</span>
                            </Label>
                          </FormItem>
                        </div>
                        
                        <div className="relative">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="fair" className="sr-only" />
                            </FormControl>
                            <Label 
                              htmlFor="fair" 
                              className="flex flex-col items-center justify-center w-full h-16 sm:h-20 p-3 sm:p-4 text-xs sm:text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-yellow-50 hover:border-yellow-300 peer-checked:border-yellow-500 peer-checked:bg-yellow-50 peer-checked:text-yellow-700 transition-all duration-200"
                            >
                              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-yellow-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-600 rounded-full"></div>
                              </div>
                              <span>Fair</span>
                              <span className="text-xs text-gray-500">Some wear</span>
                            </Label>
                          </FormItem>
                        </div>
                        
                        <div className="relative">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="poor" className="sr-only" />
                            </FormControl>
                            <Label 
                              htmlFor="poor" 
                              className="flex flex-col items-center justify-center w-full h-16 sm:h-20 p-3 sm:p-4 text-xs sm:text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-red-50 hover:border-red-300 peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-700 transition-all duration-200"
                            >
                              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-red-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full"></div>
                              </div>
                              <span>Poor</span>
                              <span className="text-xs text-gray-500">Heavy wear</span>
                            </Label>
                          </FormItem>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
<<<<<<< HEAD
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
=======
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-10 sm:h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating Impact...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Calculate Environmental Impact
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertTitle className="text-red-800">Calculation Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          {/* Impact Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="card-hover bg-gradient-to-br from-green-50 to-green-100/50 border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-green-800">Total CO₂ Equivalent</CardTitle>
                <Gauge className="h-4 h-5 w-4 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-green-900">{result.co2eq} kg</div>
                <p className="text-xs text-green-600 mt-1">Carbon footprint</p>
                <Progress value={Math.min((result.co2eq / 100) * 100, 100)} className="mt-2 h-2" />
              </CardContent>
            </Card>
            
            <Card className="card-hover bg-gradient-to-br from-blue-50 to-blue-100/50 border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-blue-800">Device Weight</CardTitle>
                <Scale className="h-4 h-5 w-4 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-blue-900">{result.deviceInfo?.weight || 0} kg</div>
                <p className="text-xs text-blue-600 mt-1">Total weight</p>
                <div className="mt-2 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="text-xs text-blue-600">Recoverable materials</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover bg-gradient-to-br from-purple-50 to-purple-100/50 border-0 shadow-lg sm:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-purple-800">Remaining Life</CardTitle>
                <Clock className="h-4 h-5 w-4 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-purple-900">{result.deviceInfo?.remainingLifespan?.toFixed(1) || 0} years</div>
                <p className="text-xs text-purple-600 mt-1">Useful life remaining</p>
                <div className="mt-2 flex items-center gap-2">
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  <span className="text-xs text-purple-600">Extend lifespan</span>
                </div>
              </CardContent>
            </Card>
>>>>>>> 34b20041bf5aeeeae8300bead3f52ce1966d2966
          </div>

          {/* Environmental Comparisons */}
          {result.comparisons && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  Environmental Impact Comparisons
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Your device's impact compared to other activities and natural processes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="group p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Tree className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-green-900">{result.comparisons.treeEquivalents.toFixed(1)}</p>
                        <p className="text-xs sm:text-sm font-medium text-green-700">trees needed</p>
                        <p className="text-xs text-green-600">to absorb CO₂</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Car className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-blue-900">{result.comparisons.carMiles.toFixed(0)}</p>
                        <p className="text-xs sm:text-sm font-medium text-blue-700">miles driven</p>
                        <p className="text-xs text-blue-600">equivalent travel</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-purple-900">{result.comparisons.smartphoneEquivalents.toFixed(1)}</p>
                        <p className="text-xs sm:text-sm font-medium text-purple-700">phones made</p>
                        <p className="text-xs text-purple-600">manufacturing equivalent</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recoverable Materials Chart */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Mountain className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                Recoverable Raw Materials
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">Estimated amount of valuable materials that can be recovered through proper recycling</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[250px] sm:min-h-[300px] w-full">
                <BarChart accessibilityLayer data={[
                    { name: "Gold", value: result.rawMaterials.gold, color: "#FFD700" },
                    { name: "Copper", value: result.rawMaterials.copper, color: "#B87333" },
                    { name: "Rare Earths", value: result.rawMaterials.rareEarths, color: "#4A90E2" },
                ]}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis tickFormatter={(value) => `${value}g`} axisLine={false} tickLine={false} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                Impact Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <p className="text-sm leading-relaxed text-gray-700">{result.impactSummary}</p>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  Recommendations
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Actions you can take to minimize environmental impact and maximize sustainability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {result.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}