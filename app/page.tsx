import { Toaster } from "@/components/ui/toaster";
import MultiStepForm from "./components/multistep-form";

export default function Home() {
  return (
    <main className="container mx-auto p-4 pb-16">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-center">MultiStep Form</h1>
      <MultiStepForm />
    </main>
  );
}
