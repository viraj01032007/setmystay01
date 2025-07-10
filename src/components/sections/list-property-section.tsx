
"use client";

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UploadCloud, Image as ImageIcon, X, ShieldCheck, Video, Plus, FileText, FileUp, Wifi, Car, Dumbbell, Utensils, Tv, Snowflake, Wind, Droplets, Zap, Users, Shield, VenetianMask } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import { AutocompleteInput } from '@/components/shared/autocomplete-input';
import { indianStates } from '@/lib/states';
import { allIndianCities, indianCitiesByState } from '@/lib/cities';
import { indianAreas } from '@/lib/areas';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';


const amenitiesList = [
  'Electricity Backup', '24x7 Water Supply', 'Lift/Elevator', 'Gated Security', 'Reserved Parking', 'Visitor Parking', 'Intercom Facility', 'Power Backup', 'Fire Safety', 'CCTV Surveillance',
  'Wi-Fi', 'Broadband Internet', 'Smart Home Features', 'DTH/Cable TV', 'Mobile Charging Points', 'LAN Port',
  'Gymnasium', 'Swimming Pool', 'Yoga Area', 'Jogging Track', 'Spa/Sauna', 'Health Club',
  'Club House', 'Party Hall', 'Community Hall', 'Amphitheatre', 'Library', 'Indoor Games (TT, Carrom)', 'Outdoor Games (Tennis, Basketball)', 'Lounge/Common Room',
  "Kids' Play Area", 'Daycare Center', 'Senior Citizen Sitting Area', 'Family Area',
  'Landscaped Garden', 'Balcony', 'Terrace Garden', 'Sit-out Area', 'Park View', 'Lake View', 'Open Green Space', 'Eco-friendly (Solar Panels, Rainwater Harvesting)',
  'Western Toilet', 'Indian Toilet', 'Attached Bathroom', 'Shared Bathroom', 'Geyser', 'Shower', 'Bathtub', 'Wash Basin', 'Towel Rack', 'Exhaust Fan', 'Toilet Paper Holder', 'Hot & Cold Water',
  'Private Kitchen', 'Shared Kitchen', 'Modular Kitchen', 'Refrigerator', 'Microwave', 'Gas Connection', 'Induction', 'Chimney', 'Water Purifier (RO/UV)', 'Sink', 'Kitchen Utensils', 'Dining Table',
  'Single Bed', 'Double Bed', 'Mattress', 'Pillow', 'Blanket', 'Wardrobe', 'Study Table', 'Chair', 'Dressing Table', 'Fan', 'Lights', 'Curtains', 'AC', 'Cooler', 'TV', 'Shoe Rack', 'Side Table',
  'Washing Machine (Private/Common)', 'Laundry Service', 'Drying Area', 'Iron & Ironing Board', 'Dustbin', 'Broom/Mop', 'Bucket & Mug', 'Cleaning Tools',
  'Room Cleaning', 'Bathroom Cleaning', 'Linen Change', 'Daily/Weekly Cleaning',
  'In-house Mess', 'Tiffin Service', 'Veg/Non-Veg Available', 'Breakfast/Lunch/Dinner', 'Self Cooking Allowed', 'Common Dining Area',
  '24x7 Security Guard', 'CCTV Cameras', 'Biometric Access', 'Keycard Entry', 'Fire Alarm', 'Fire Exit', 'First Aid Kit', 'Emergency Alarm',
  'Lift', 'Reception Area', 'Front Desk', 'Terrace Access', 'Common Hall', 'Lounge Area', 'Generator Backup', 'Pantry', 'RO Water', 'EV Charging Point',
  'Two-Wheeler Parking', 'Car Parking', 'Valet Parking', 'EV Charging', 'Shuttle Service',
  'Near Metro Station', 'Near Bus Stop', 'Near Grocery Store', 'Near Mall', 'Near College', 'Near Office', 'Near Hospital', 'Near ATM', 'Peaceful Area',
  // Original Amenities for backward compatibility if needed
  'Parking', 'Gym', 'Pool', 'Elevator', 'Security', 'Meals', 'Laundry', 'Housekeeping', 'Garden', 'Mirror'
].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates


const amenityIcons: { [key: string]: React.ElementType } = {
  'AC': Snowflake, 'WiFi': Wifi, 'Parking': Car, 'Gym': Dumbbell, 'Pool': Wind, 'Elevator': Users, 'Security': Shield, 'Balcony': VenetianMask, 'Power Backup': Zap, 'Meals': Utensils, 'Laundry': Droplets, 'Housekeeping': Droplets, 'Garden': Wind, 'TV': Tv
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const fileSchema = z
  .any()
  .refine((files) => files?.length === 1, "File is required.")
  .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), ".jpg, .jpeg, .png and .pdf files are accepted.");


const formSchema = z.object({
  propertyType: z.enum(['Rental', 'PG', 'Roommate']),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  rent: z.coerce.number().min(1000, 'Rent must be at least 1000'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  locality: z.string().min(1, 'Locality is required'),
  address: z.string().min(10, 'Full address is required'),
  ownerName: z.string().min(2, 'Name is required'),
  phonePrimary: z.string().refine((val) => /^\d{10}$/.test(val), {
    message: "Primary phone number must be 10 digits.",
  }),
  phoneSecondary: z.string().refine((val) => val === "" || /^\d{10}$/.test(val), {
    message: "Secondary phone number must be 10 digits.",
  }).optional(),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  brokerStatus: z.enum(['With Broker', 'Without Broker']),
  aadhaarCard: fileSchema,
  electricityBill: fileSchema.optional(),
  noc: fileSchema.optional(),
  videoFile: z.any().optional(),
  gender: z.string().optional(),
}).refine(data => {
    if (data.propertyType === 'Rental' || data.propertyType === 'PG') {
        return !!data.electricityBill;
    }
    return true;
}, {
    message: 'Electricity Bill is required for Rental and PG listings.',
    path: ['electricityBill'],
}).refine(data => {
    if (data.propertyType === 'Roommate') {
        return !!data.gender;
    }
    return true;
}, {
    message: 'Gender is required when looking for a roommate.',
    path: ['gender'],
});

type FormValues = z.infer<typeof formSchema>;

interface ListPropertySectionProps {
  onSubmit: (data: FormValues & { images: File[] }) => void;
}

const FileUploadField = ({ name, label, control, required = false }: { name: "aadhaarCard" | "electricityBill" | "noc", label: string, control: any, required?: boolean }) => {
    const [fileName, setFileName] = useState<string | null>(null);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}{required && <span className="text-destructive">*</span>}</FormLabel>
                    <FormControl>
                        <div
                            className="border-2 border-dashed border-muted rounded-lg p-4 text-center cursor-pointer hover:border-primary"
                            onClick={() => document.getElementById(`upload-${name}`)?.click()}
                        >
                            <FileUp className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                                {fileName || `Click to upload ${label}`}
                            </p>
                            <Input
                                id={`upload-${name}`}
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onBlur={field.onBlur}
                                name={field.name}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        field.onChange(e.target.files);
                                        setFileName(file.name);
                                    }
                                }}
                                ref={field.ref}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export function ListPropertySection({ onSubmit }: ListPropertySectionProps) {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: 'Rental',
      brokerStatus: 'Without Broker',
      rent: 15000,
      amenities: [],
      phonePrimary: '',
      phoneSecondary: '',
      gender: undefined,
      state: '',
      city: '',
      locality: '',
    },
  });
  
  const propertyType = form.watch('propertyType');
  const stateValue = form.watch('state');
  const cityValue = form.watch('city');
  const selectedAmenities = form.watch('amenities') || [];

  const citySuggestions = stateValue ? indianCitiesByState[stateValue] || [] : allIndianCities;
  const areaSuggestions = cityValue ? indianAreas[cityValue] || [] : [];

  useEffect(() => {
    form.setValue('city', '');
  }, [stateValue, form]);

  useEffect(() => {
    form.setValue('locality', '');
  }, [cityValue, form]);


  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    const finalData = { 
        ...data, 
        images: mediaFiles,
        aadhaarCard: data.aadhaarCard[0],
        electricityBill: data.electricityBill?.[0],
        noc: data.noc ? data.noc[0] : undefined,
        videoFile: data.videoFile ? data.videoFile[0] : undefined,
    };
    onSubmit(finalData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMediaFiles(prev => [...prev, ...Array.from(event.target.files)].slice(0, 5));
    }
  };

  const handleAddCustomAmenity = () => {
    if (customAmenity && amenitiesList.includes(customAmenity) && !selectedAmenities.includes(customAmenity)) {
        form.setValue('amenities', [...selectedAmenities, customAmenity]);
        setCustomAmenity('');
    }
  };

  const handleRemoveAmenity = (amenityToRemove: string) => {
    form.setValue('amenities', selectedAmenities.filter(a => a !== amenityToRemove));
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
                
                {propertyType === 'Roommate' && (
                    <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                )}
                
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
                    <CardDescription>Select all the amenities that apply, or search for more options.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FormField
                        control={form.control}
                        name="amenities"
                        render={() => (
                            <FormItem>
                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
                                  {['AC', 'WiFi', 'Parking', 'Gym', 'Meals', 'Laundry', 'Security', 'TV'].map((amenity) => {
                                      const Icon = amenityIcons[amenity] || Shield;
                                      return (
                                        <FormField
                                            key={amenity}
                                            control={form.control}
                                            name="amenities"
                                            render={({ field }) => (
                                                <FormItem
                                                    key={amenity}
                                                    className="flex-1"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(amenity)}
                                                            onCheckedChange={(checked) => {
                                                                const updatedAmenities = checked
                                                                    ? [...(field.value || []), amenity]
                                                                    : field.value?.filter((value) => value !== amenity);
                                                                field.onChange(updatedAmenities);
                                                            }}
                                                            className="sr-only"
                                                            id={`amenity-${amenity}`}
                                                        />
                                                    </FormControl>
                                                    <FormLabel 
                                                        htmlFor={`amenity-${amenity}`}
                                                        className="flex flex-col items-center justify-center gap-2 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                                                        data-state={field.value?.includes(amenity) ? 'checked' : 'unchecked'}
                                                    >
                                                      <Icon className="w-6 h-6" />
                                                      <span className="text-sm font-medium text-center">{amenity}</span>
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                      )
                                  })}
                                </div>
                                <div className="mt-6">
                                  <FormLabel>Search for more amenities</FormLabel>
                                  <div className="flex gap-2 mt-2">
                                      <AutocompleteInput
                                        placeholder="e.g., Piped Gas"
                                        value={customAmenity}
                                        onChange={setCustomAmenity}
                                        suggestions={amenitiesList.filter(a => !selectedAmenities.includes(a))}
                                      />
                                      <Button type="button" onClick={handleAddCustomAmenity}>
                                          <Plus className="w-4 h-4 mr-2" /> Add
                                      </Button>
                                  </div>
                                </div>

                                {selectedAmenities.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h4 className="text-sm font-medium mb-2">Selected Amenities:</h4>
                                        <ScrollArea className="h-40">
                                            <div className="flex flex-wrap gap-2">
                                                {selectedAmenities.map((amenity) => (
                                                    <Badge key={amenity} variant="secondary" className="pl-2">
                                                        {amenity}
                                                        <button type="button" onClick={() => handleRemoveAmenity(amenity)} className="ml-2 p-0.5 rounded-full hover:bg-destructive/20 text-destructive">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photo & Video Upload</CardTitle>
                <CardDescription>Add photos (Max 5) and a video tour.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="mb-6">
                    <FormLabel>Photos</FormLabel>
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary" onClick={() => document.getElementById('media-upload')?.click()}>
                      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground"/>
                      <p className="mt-4 text-sm text-muted-foreground">Drag & drop or click to upload photos</p>
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
                </div>

                <div>
                    <FormField
                        control={form.control}
                        name="videoFile"
                        render={({ field: { onChange, onBlur, name, ref } }) => (
                            <FormItem>
                                <FormLabel>Video Tour (Optional)</FormLabel>
                                <FormControl>
                                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary" onClick={() => document.getElementById('video-upload')?.click()}>
                                        <Video className="mx-auto h-12 w-12 text-muted-foreground"/>
                                        <p className="mt-4 text-sm text-muted-foreground">
                                            {form.getValues('videoFile')?.[0]?.name || 'Click to upload video file'}
                                        </p>
                                        <Input
                                            id="video-upload"
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            onBlur={onBlur}
                                            name={name}
                                            onChange={(e) => onChange(e.target.files)}
                                            ref={ref}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Verification Documents</CardTitle>
                <CardDescription>Upload these documents for verification. This will only be visible to our admin team.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                 <FileUploadField name="aadhaarCard" label="Aadhaar Card" control={form.control} required />
                 {propertyType !== 'Roommate' && (
                    <>
                        <FileUploadField name="electricityBill" label="Electricity Bill" control={form.control} required />
                        <div className="md:col-span-2">
                            <FileUploadField name="noc" label="NOC (Optional)" control={form.control} />
                        </div>
                    </>
                 )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                            <AutocompleteInput 
                                placeholder="e.g., Maharashtra"
                                value={field.value}
                                onChange={field.onChange}
                                suggestions={indianStates}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}/>
                 <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <AutocompleteInput 
                                placeholder="e.g., Navi Mumbai"
                                value={field.value}
                                onChange={field.onChange}
                                suggestions={citySuggestions}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="locality" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Area / Locality</FormLabel>
                        <FormControl>
                           <AutocompleteInput 
                                placeholder="e.g., Kharghar"
                                value={field.value}
                                onChange={field.onChange}
                                suggestions={areaSuggestions}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
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
                <FormField control={form.control} name="phonePrimary" render={({ field }) => (
                  <FormItem><FormLabel>Primary Phone Number (Required)</FormLabel><FormControl><Input type="tel" placeholder="9876543210" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="phoneSecondary" render={({ field }) => (
                  <FormItem><FormLabel>Secondary Phone Number (Optional)</FormLabel><FormControl><Input type="tel" placeholder="9876543211" {...field} /></FormControl><FormMessage /></FormItem>
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
