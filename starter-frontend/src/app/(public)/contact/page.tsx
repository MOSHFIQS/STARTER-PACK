"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
     Clock,
     Loader2,
     Mail,
     MapPin,
     MessageSquare,
     Phone,
     Send,
} from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const contactInfo = [
     {
          icon: MapPin,
          title: "Visit Our Offices",
          details: ["ICT Tower, Dhaka, Bangladesh", "Tech Hub, Silicon Valley, CA"],
     },
     {
          icon: Phone,
          title: "Call Us Today",
          details: ["+880 1711-000001", "support@starterapp.com"],
     },
     {
          icon: Mail,
          title: "Email Inquiry",
          details: ["info@starterapp.com", "support@starterapp.com"],
     },
     {
          icon: Clock,
          title: "Working Hours",
          details: ["Mon - Fri: 9AM - 6PM", "Sat - Sun: Closed"],
     },
];

const PREFERRED_CONTACT_OPTIONS = [
     { value: "EMAIL", label: "Email" },
     { value: "PHONE", label: "Phone" },
     { value: "SMS", label: "SMS" },
];

export default function ContactPage() {
     const [name, setName] = useState("");
     const [email, setEmail] = useState("");
     const [phone, setPhone] = useState("");
     const [subject, setSubject] = useState("");
     const [message, setMessage] = useState("");
     const [preferredContact, setPreferredContact] = useState("EMAIL");
     const [isPending, startTransition] = useTransition();

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          startTransition(async () => {
               try {
                    // Simulate API network latency
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    toast.success("Your message has been sent! We'll get back to you soon.");
                    setName("");
                    setEmail("");
                    setPhone("");
                    setSubject("");
                    setMessage("");
               } catch {
                    toast.error("Failed to send message");
               }
          });
     };

     return (
          <main className="min-h-screen bg-background">
               {/* Hero Section */}
               <section className="relative py-28 md:py-36 overflow-hidden bg-neutral-950 text-white">
                    <div className="absolute inset-0 z-0">
                         <Image
                              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
                              alt="Modern office building interior"
                              fill
                              className="object-cover opacity-25"
                              priority
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
                    </div>
                    <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
                         <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-white/10 mb-6 backdrop-blur-md">
                              <MessageSquare className="size-7 text-white" />
                         </div>
                         <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                              Get in <span className="text-indigo-400">Touch</span>
                         </h1>
                         <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                              Have questions about the Starter App template or need customization assistance? Our support team is here to help.
                         </p>
                    </div>
               </section>

               {/* Contact Info Cards */}
               <section className="py-12 -mt-10 relative z-10">
                    <div className="max-w-7xl mx-auto px-4">
                         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                              {contactInfo.map((info) => (
                                   <Card key={info.title} className="border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] rounded-2xl">
                                        <CardContent className="p-8 text-center flex flex-col items-center">
                                             <div className="inline-flex items-center justify-center size-12 rounded-xl bg-indigo-500/10 mb-4">
                                                  <info.icon className="size-6 text-indigo-500" />
                                             </div>
                                             <h3 className="font-bold text-foreground text-base mb-2 tracking-tight">{info.title}</h3>
                                             {info.details.map((detail) => (
                                                  <p key={detail} className="text-sm text-muted-foreground leading-relaxed">
                                                       {detail}
                                                  </p>
                                             ))}
                                        </CardContent>
                                   </Card>
                              ))}
                         </div>
                    </div>
               </section>

               {/* Contact Form Section */}
               <section className="py-16 md:py-24 bg-background">
                    <div className="max-w-4xl mx-auto px-4">
                         <Card className="border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.01)] rounded-2xl p-8">
                              <div className="mb-6">
                                   <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                                        <Send className="size-5 text-indigo-500" />
                                        Send Us a Message
                                   </h2>
                                   <p className="text-sm text-muted-foreground mt-1">
                                        Fill out the form below and we'll respond as soon as possible.
                                   </p>
                              </div>

                              <form onSubmit={handleSubmit} className="space-y-5">
                                   <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="grid gap-1.5">
                                             <Label htmlFor="name" className="text-sm font-semibold text-foreground">Full Name *</Label>
                                             <Input
                                                  id="name"
                                                  type="text"
                                                  placeholder="John Doe"
                                                  value={name}
                                                  onChange={(e) => setName(e.target.value)}
                                                  className="rounded-xl border-border bg-background text-foreground focus:ring-indigo-500/20"
                                                  required
                                             />
                                        </div>
                                        <div className="grid gap-1.5">
                                             <Label htmlFor="phone" className="text-sm font-semibold text-foreground">Phone *</Label>
                                             <Input
                                                  id="phone"
                                                  type="text"
                                                  placeholder="+1 (555) 123-4567"
                                                  value={phone}
                                                  onChange={(e) => setPhone(e.target.value)}
                                                  className="rounded-xl border-border bg-background text-foreground focus:ring-indigo-500/20"
                                                  required
                                             />
                                        </div>
                                   </div>

                                   <div className="grid gap-1.5">
                                        <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email Address *</Label>
                                        <Input
                                             id="email"
                                             type="email"
                                             placeholder="you@example.com"
                                             value={email}
                                             onChange={(e) => setEmail(e.target.value)}
                                             className="rounded-xl border-border bg-background text-foreground focus:ring-indigo-500/20"
                                             required
                                        />
                                   </div>

                                   <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="grid gap-1.5">
                                             <Label htmlFor="subject" className="text-sm font-semibold text-foreground">Subject *</Label>
                                             <Input
                                                  id="subject"
                                                  type="text"
                                                  placeholder="How can we help?"
                                                  value={subject}
                                                  onChange={(e) => setSubject(e.target.value)}
                                                  className="rounded-xl border-border bg-background text-foreground focus:ring-indigo-500/20"
                                                  required
                                             />
                                        </div>
                                        <div className="grid gap-1.5">
                                             <Label htmlFor="preferredContact" className="text-sm font-semibold text-foreground">Preferred Contact Method</Label>
                                             <Select value={preferredContact} onValueChange={setPreferredContact}>
                                                  <SelectTrigger className="rounded-xl border-border bg-background text-foreground focus:ring-indigo-500/20">
                                                       <SelectValue placeholder="Select method" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       {PREFERRED_CONTACT_OPTIONS.map((opt) => (
                                                            <SelectItem key={opt.value} value={opt.value}>
                                                                 {opt.label}
                                                            </SelectItem>
                                                       ))}
                                                  </SelectContent>
                                             </Select>
                                        </div>
                                   </div>

                                   <div className="grid gap-1.5">
                                        <Label htmlFor="message" className="text-sm font-semibold text-foreground">Message *</Label>
                                        <Textarea
                                             id="message"
                                             placeholder="Write your message details here..."
                                             value={message}
                                             onChange={(e) => setMessage(e.target.value)}
                                             className="min-h-[150px] rounded-xl border-border bg-background text-foreground focus:ring-indigo-500/20"
                                             required
                                        />
                                   </div>

                                   <Button
                                        type="submit"
                                        className="w-full h-12 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all duration-300"
                                        disabled={isPending}
                                   >
                                        {isPending ? (
                                             <>
                                                  <Loader2 className="mr-2 size-4 animate-spin" />
                                                  Sending Message...
                                             </>
                                        ) : (
                                             <>
                                                  <Send className="mr-2 size-4" />
                                                  Send Message
                                             </>
                                        )}
                                   </Button>
                              </form>
                         </Card>
                    </div>
               </section>
          </main>
     );
}
