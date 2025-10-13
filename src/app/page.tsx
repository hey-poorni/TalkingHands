import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bot, Captions, Hand, Mic, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/logo';

const features = [
  {
    icon: <Waves className="h-8 w-8 text-accent" />,
    title: 'Live Sign Language Translation',
    description: "Our AI translates sign language from your camera into text in real-time, breaking down communication barriers instantly.",
    image: PlaceHolderImages.find(img => img.id === 'live-translation'),
  },
  {
    icon: <Hand className="h-8 w-8 text-accent" />,
    title: 'Text to Sign Gestures',
    description: "Type any text and watch our 3D virtual avatar perform the sign language gestures, making it a great tool for learning.",
    image: PlaceHolderImages.find(img => img.id === '3d-avatar'),
  },
  {
    icon: <Bot className="h-8 w-8 text-accent" />,
    title: 'AI Conversation Assistant',
    description: "Get summaries of your conversations, ask questions, and let our AI assistant help you manage your meetings.",
    image: PlaceHolderImages.find(img => img.id === 'ai-assistant'),
  },
  {
    icon: <Captions className="h-8 w-8 text-accent" />,
    title: 'Floating Captions',
    description: "See what others are saying with elegant floating captions overlaid on the video, ensuring you never miss a word.",
    image: PlaceHolderImages.find(img => img.id === 'emoji-reactions'),
  },
];

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Logo />
          <Button asChild className="button-glow transition-all">
            <Link href="/app">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
          {heroImage && (
             <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover opacity-10"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="container relative mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-primary-foreground drop-shadow-glow-primary sm:text-5xl md:text-6xl lg:text-7xl">
              Communication without Barriers
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Talking Hands bridges the gap between sign language and spoken words with cutting-edge AI. Experience seamless real-time translation and inclusive meetings.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" className="button-glow transition-all duration-300">
                <Link href="/app">
                  Start Translating Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-card/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">A New Era of Communication</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Discover the powerful features designed to make every conversation accessible.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
              {features.map((feature, index) => (
                <Card key={index} className="overflow-hidden bg-card transition-shadow hover:shadow-2xl card-glow">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    {feature.image && (
                      <div className="relative aspect-video overflow-hidden rounded-lg">
                        <Image
                          src={feature.image.imageUrl}
                          alt={feature.image.description}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          data-ai-hint={feature.image.imageHint}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row md:px-6">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground md:mt-0">
            © {new Date().getFullYear()} Talking Hands. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
