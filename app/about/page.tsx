import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <main className="container mx-auto p-4">
      <Card className="border-2 border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle>About BB Sign Language Translator</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-blue">
          <p className="lead">
            BB Sign Language Translator is a child-friendly tool designed to help bridge communication gaps between sign language users and others.
          </p>
          {/* Add more content */}
        </CardContent>
      </Card>
    </main>
  )
} 