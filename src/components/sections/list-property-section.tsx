
"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UploadCloud, Image as ImageIcon, X, ShieldCheck, Video } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';

const amenitiesList = ['AC', 'WiFi', 'Parking', 'Gym', 'Pool', 'Elevator', 'Security', 'Balcony', 'Power Backup', 'Meals', 'Laundry', 'Housekeeping', 'Garden'];
const amenityIcons: { [key: string]: string } = {
  'AC': '❄️', 'WiFi': '📶', 'Parking': '🅿️', 'Gym': '🏋️', 'Pool': '🏊', 'Elevator': '↕️', 'Security': '🛡️', 'Balcony': '🪟', 'Power Backup': '🔋', 'Meals': '🍴', 'Laundry': '🧺', 'Housekeeping': '🧹', 'Garden': '🌳'
};

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const formSchema = z.object({
  propertyType: z.enum(['Rental', 'PG', 'Roommate']),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  rent: z.coerce.number().min(1000, 'Rent must be at least 1000'),
  city: z.string().min(1, 'City is required'),
  locality: z.string().min(1, 'Locality is required'),
  address: z.string().min(10, 'Full address is required'),
  ownerName: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^\d{10}$/, 'Must be a valid 10-digit phone number'),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  brokerStatus: z.enum(['With Broker', 'Without Broker']),
  verificationDocument: z.any().optional(),
  videoFile: z
    .any()
    .refine((file) => file instanceof File, "Video is required.")
    .refine((file) => file?.size <= MAX_VIDEO_SIZE, `Max video size is 50MB.`)
    .refine(
      (file) => file?.type ? ACCEPTED_VIDEO_TYPES.includes(file.type) : false,
      ".mp4, .webm and .ogg formats are supported."
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface ListPropertySectionProps {
  onSubmit: (data: FormValues & { images: File[] }) => void;
}

export function ListPropertySection({ onSubmit }: ListPropertySectionProps) {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: 'Rental',
      brokerStatus: 'Without Broker',
      rent: 15000,
      amenities: [],
    },
  });
  
  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit({ ...data, images: mediaFiles });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMediaFiles(prev => [...prev, ...Array.from(event.target.files)].slice(0, 5));
    }
  };
  
  const handleVerificationFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVerificationFile(event.target.files[0]);
      form.setValue('verificationDocument', event.target.files[0]);
    }
  };

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setVideoFile(file);
        form.setValue('videoFile', file, { shouldValidate: true });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight">List Your Property</h1>
            <p className="mt-4 text-lg text-muted-foreground">Reach thousands of potential tenants and roommates by listing your space on SetMyStay.</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
                <CardDescription>Start with the basics about your property.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="propertyType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Rental">Rental (BHK/House)</SelectItem>
                        <SelectItem value="PG">PG / Co-living</SelectItem>
                        <SelectItem value="Roommate">Looking for Roommate</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}/>
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Property Title</FormLabel><FormControl><Input placeholder="e.g., Spacious 2BHK Apartment" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="rent" render={({ field }) => (
                  <FormItem><FormLabel>Monthly Rent (₹)</FormLabel><FormControl><Input type="number" placeholder="25000" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="brokerStatus" render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Are you a broker or owner?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl><RadioGroupItem value="Without Broker" /></FormControl>
                          <FormLabel className="font-normal">Owner</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl><RadioGroupItem value="With Broker" /></FormControl>
                          <FormLabel className="font-normal">Broker</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                    <CardDescription>Select all the amenities that apply.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FormField
                        control={form.control}
                        name="amenities"
                        render={() => (
                            <FormItem>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {amenitiesList.map((amenity) => (
                                    <FormField
                                    key={amenity}
                                    control={form.control}
                                    name="amenities"
                                    render={({ field }) => {
                                        return (
                                        <FormItem
                                            key={amenity}
                                            className="flex flex-row items-center space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(amenity)}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...(field.value || []), amenity])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                        (value) => value !== amenity
                                                        )
                                                    )
                                                }}
                                            />
                                            </FormControl>
                                            <FormLabel className="font-normal flex items-center gap-2">
                                              <span className="text-lg w-6 text-center">{amenityIcons[amenity]}</span>
                                              <span>{amenity}</span>
                                            </FormLabel>
                                        </FormItem>
                                        )
                                    }}
                                    />
                                ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photo Upload</CardTitle>
                <CardDescription>Add photos to attract more interest. (Max 5)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary" onClick={() => document.getElementById('media-upload')?.click()}>
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground"/>
                  <p className="mt-4 text-sm text-muted-foreground">Drag & drop or click to upload</p>
                  <Input id="media-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
                {mediaFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {mediaFiles.map((file, i) => (
                      <div key={i} className="relative group">
                        <Image src={URL.createObjectURL(file)} alt={file.name} width={100} height={100} className="w-full h-24 object-cover rounded-md"/>
                        <button type="button" onClick={() => setMediaFiles(mediaFiles.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3"/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Video Tour (Required)</CardTitle>
                <CardDescription>Upload a short video tour. (Max 50MB)</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                    control={form.control}
                    name="videoFile"
                    render={() => (
                        <FormItem>
                            <FormControl>
                                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary" onClick={() => document.getElementById('video-upload')?.click()}>
                                    <Video className="mx-auto h-12 w-12 text-muted-foreground"/>
                                    <p className="mt-4 text-sm text-muted-foreground">
                                        {videoFile ? videoFile.name : 'Click to upload video file'}
                                    </p>
                                    <Input id="video-upload" type="file" accept="video/*" className="hidden" onChange={handleVideoFileChange} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Verification Document</CardTitle>
                <CardDescription>Upload a document for verification (e.g., Aadhar card, Agreement). This will only be visible to our admin team.</CardDescription>
              </CardHeader>
              <CardContent>
                 <FormField control={form.control} name="verificationDocument" render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary" onClick={() => document.getElementById('verification-upload')?.click()}>
                                <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground"/>
                                <p className="mt-4 text-sm text-muted-foreground">
                                    {verificationFile ? verificationFile.name : 'Click to upload your verification document'}
                                </p>
                                <Input id="verification-upload" type="file" accept="image/*,application/pdf" className="hidden" onChange={handleVerificationFileChange} />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                 )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., Navi Mumbai" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="locality" render={({ field }) => (
                    <FormItem><FormLabel>Locality / Area</FormLabel><FormControl><Input placeholder="e.g., Kharghar" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <div className="md:col-span-2">
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem><FormLabel>Full Address</FormLabel><FormControl><Textarea placeholder="Enter complete address..." {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                  </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="ownerName" render={({ field }) => (
                  <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="9876543210" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full">
                Proceed to Payment & List
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
