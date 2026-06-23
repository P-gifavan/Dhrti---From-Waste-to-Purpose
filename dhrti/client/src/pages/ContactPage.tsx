import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, MapPin, Phone } from 'lucide-react';
import { contactService } from '../services/contactService';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const ContactPage: React.FC = () => {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus({ type: null, message: '' });
    try {
      await contactService.submitContactForm(data);
      setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
      reset();
    } catch {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    }
  };

  return (
    <div className="pt-24 pb-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16">

          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-6">Get in Touch</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Have questions about selling your waste or sourcing materials? Our team is here to help you navigate the circular economy.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email Us</h3>
                  <p className="text-muted-foreground">supportdhrti@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Call Us</h3>
                  <p className="text-muted-foreground">+91 9561287172</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Office</h3>
                  <p className="text-muted-foreground">Eco Tech Park, Amaravathi<br />Andhra Pradesh, India 522002</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

            {status.type === 'success' && (
              <div className="mb-6 p-4 bg-green-500/15 text-green-600 rounded-lg text-sm font-medium border border-green-500/30">
                {status.message}
              </div>
            )}

            {status.type === 'error' && (
              <div className="mb-6 p-4 bg-destructive/15 text-destructive rounded-lg text-sm font-medium border border-destructive/30">
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  {...register('name')}
                  className="w-full rounded-md border-0 py-2.5 px-3 text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary bg-background"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full rounded-md border-0 py-2.5 px-3 text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary bg-background"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className="w-full rounded-md border-0 py-2.5 px-3 text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary bg-background resize-none"
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
