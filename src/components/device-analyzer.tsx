'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Upload, Camera, Image as ImageIcon, Zap, Leaf, DollarSign, Info, Loader2 } from 'lucide-react';
import { VisionAnalysisResult } from '@/lib/vision-api';
import { useAuth } from '@/lib/firebase/auth';
import { analyzeDeviceAction } from '@/app/actions';

interface DeviceAnalyzerProps {
  onAnalysisComplete?: (result: VisionAnalysisResult) => void;
}

export function DeviceAnalyzer({ onAnalysisComplete }: DeviceAnalyzerProps) {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      setError('Please log in to analyze devices');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setUploadProgress(0);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadstart = () => {
        setUploadProgress(30);
      };
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 50) + 30;
          setUploadProgress(percent);
        }
      };
      reader.onloadend = async () => {
        const base64ImageUrl = reader.result as string;
        setSelectedImage(base64ImageUrl);
        setUploadProgress(90);

        const response = await analyzeDeviceAction(base64ImageUrl, user.uid);

        if (response.error || !response.result) {
          throw new Error(response.error || 'Analysis failed to return a result.');
        }

        setUploadProgress(100);
        setAnalysisResult(response.result);
        onAnalysisComplete?.(response.result);
      };
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCameraCapture = () => {
    fileInputRef.current?.click();
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setSelectedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            Device Analyzer
          </CardTitle>
          <CardDescription className="text-gray-600">
            Upload a photo of your electronic device to get instant analysis and recycling recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          {!analysisResult && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Image
                </Button>
                <Button
                  onClick={handleCameraCapture}
                  disabled={isAnalyzing}
                  variant="outline"
                  className="flex-1 h-12 border-2 border-blue-200 hover:border-blue-300"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Take Photo
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <div className="text-center text-sm text-gray-500">
                Supported formats: JPG, PNG, GIF • Max size: 10MB
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Analyzing device...</span>
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
                <Button onClick={resetAnalysis} variant="outline" size="sm">
                  Analyze Another Device
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-700">Device Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedImage && (
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={selectedImage}
                          alt="Device"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Analysis Details */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Device Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Device Type:</span>
                        <Badge variant="secondary" className="capitalize">
                          {analysisResult.deviceType}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Confidence:</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getConfidenceColor(analysisResult.confidence)}`} />
                          <span className="text-sm font-medium">
                            {(analysisResult.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      {analysisResult.brand && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Brand:</span>
                          <Badge variant="outline" className="capitalize">
                            {analysisResult.brand}
                          </Badge>
                        </div>
                      )}

                      {analysisResult.model && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Model:</span>
                          <span className="text-sm font-medium">{analysisResult.model}</span>
                        </div>
                      )}

                      {analysisResult.condition && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Condition:</span>
                          <Badge className={getConditionColor(analysisResult.condition)}>
                            {analysisResult.condition}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Features */}
                  {analysisResult.features.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-700">Detected Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <Separator />

              {/* Environmental Impact */}
              <Tabs defaultValue="recycling" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="recycling" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Recycling Value
                  </TabsTrigger>
                  <TabsTrigger value="environmental" className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Environmental Impact
                  </TabsTrigger>
                  <TabsTrigger value="materials" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Recoverable Materials
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recycling" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="text-3xl font-bold text-green-600">
                          ${analysisResult.suggestedRecyclingValue.toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Estimated recycling value based on device type, condition, and brand
                        </p>
                        <div className="flex justify-center">
                          <Badge variant="secondary" className="text-xs">
                            This is an estimate - actual value may vary
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="environmental" className="mt-4">
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {analysisResult.environmentalImpact.co2Manufacturing.toFixed(1)} kg
                          </div>
                          <div className="text-sm text-gray-600">CO₂ from Manufacturing</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {analysisResult.environmentalImpact.co2Usage.toFixed(1)} kg
                          </div>
                          <div className="text-sm text-gray-600">CO₂ from Usage</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        Recycling this device prevents these emissions from entering the environment
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="materials" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Recoverable Materials:</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.environmentalImpact.materialsRecoverable.map((material, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                          These materials can be extracted and reused in new products, reducing the need for mining and manufacturing new materials.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
