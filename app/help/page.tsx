"use client";

import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import emailjs from '@emailjs/browser';

export default function HelpPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // EmailJS service credentials
      const serviceId = 'service_otjfrir';
      const templateId = 'template_qbim4od';
      const publicKey = process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY || 'xlmYdm4I-qLmrUkC-';
      
      // Send the email
      await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current!,
        publicKey
      );

      toast({
        title: "Success!",
        description: "Your message has been sent. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto p-4 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-zinc-800 bg-zinc-950/50 shadow-lg">
          <CardHeader className="border-b border-zinc-800 pb-6">
            <CardTitle className="text-2xl font-bold">Need Help?</CardTitle>
            <CardDescription className="text-zinc-400 mt-2">
              Answers to common questions about using Bluey's Sign Language Translator
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">How does the sign detection work?</h3>
              <p className="text-zinc-300">
                Our sign language detector uses your device's camera and TensorFlow.js to analyze hand positions and movements in real-time. The AI model has been trained on thousands of sign language examples to accurately recognize signs.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Why isn't my sign being detected?</h3>
              <p className="text-zinc-300">
                For best results, ensure you're in a well-lit environment with your hands clearly visible to the camera. Position yourself so your hands are centered in the frame, and make signs deliberately.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Is my camera data private?</h3>
              <p className="text-zinc-300">
                Yes, absolutely. All processing happens directly on your device. We never store or transmit your video data to any server. Your privacy is our top priority.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Which sign languages are supported?</h3>
              <p className="text-zinc-300">
                Currently, we support American Sign Language (ASL) and Filipino Sign Language (FSL). We're continuously working to expand our language support.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950/50 shadow-lg">
          <CardHeader className="border-b border-zinc-800 pb-6">
            <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
            <CardDescription className="text-zinc-400 mt-2">
              Have a question or feedback? Reach out to our team directly. Messages go to Jason Barrientos.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-zinc-800 bg-zinc-900"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-zinc-800 bg-zinc-900"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject"
                  name="subject"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  className="border-zinc-800 bg-zinc-900"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message"
                  name="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="border-zinc-800 bg-zinc-900 min-h-[150px]"
                />
              </div>
              
              {/* Hidden field for recipient - this will be picked up by EmailJS template */}
              <input 
                type="hidden" 
                name="to_email" 
                value="jasonbluebarrientos@gmail.com" 
              />
            </form>
          </CardContent>
          <CardFooter className="border-t border-zinc-800 pt-4 px-6 pb-6">
            <Button 
              type="submit" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8 p-6 rounded-xl bg-blue-900/20 border border-blue-800">
        <h3 className="text-lg font-semibold text-white mb-2">About This Project</h3>
        <p className="text-zinc-300">
          Bluey's Sign Language Translator is a thesis project developed to bridge communication gaps between the deaf community and hearing individuals. Our goal is to make sign language more accessible and facilitate better understanding between different communities.
        </p>
        <p className="text-zinc-300 mt-4">
          For academic inquiries or collaboration opportunities related to this thesis project, please contact Jason Blue Barrientos directly at <a href="mailto:jasonbluebarrientos@gmail.com" className="text-blue-400 hover:underline">jasonbluebarrientos@gmail.com</a>.
        </p>
      </div>
    </main>
  );
} 