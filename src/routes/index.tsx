import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Monitoração — Oraculum" },
    { name: "description", content: "Monitoração simulada de ciclos, pressão e temperatura de prensas industriais." },
    { property: "og:title", content: "Monitoração — Oraculum" },
    { property: "og:description", content: "Monitoração simulada de ciclos, pressão e temperatura de prensas industriais." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/oraculum.html"
      title="Oraculum — Osciloscópio Industrial"
      className="block h-screen w-full border-0 bg-background"
    />
  );
}
