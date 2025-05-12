import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQS = [
  {
    question: "How do I make a booking?",
    answer: "Making a booking is easy! Simply browse our activities, select your preferred date and group size, and follow the checkout process. You'll receive instant confirmation via email."
  },
  {
    question: "What is your cancellation policy?",
    answer: "We offer free cancellation up to 48 hours before your activity. Cancellations made within 48 hours of the activity are non-refundable. Special conditions may apply for certain activities."
  },
  {
    question: "How do I modify my booking?",
    answer: "You can modify your booking through your account dashboard up to 48 hours before the activity. For last-minute changes, please contact our customer support team."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express). Payment is processed securely through Stripe."
  },
  {
    question: "Do I need to print my ticket?",
    answer: "No, you don't need to print your ticket. You can show your digital confirmation email or access your booking through our platform"
  }
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mb-8">
          Find answers to common questions about our services
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          {FAQS.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-4">
            Can't find the answer you're looking for? Please chat to our friendly team.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}