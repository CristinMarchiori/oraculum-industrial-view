import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Visão Geral das Máquinas — Oraculum" },
    { name: "description", content: "Proposta visual de supervisão centralizada das prensas cadastradas no Oraculum, com dados de demonstração." },
    { property: "og:title", content: "Visão Geral das Máquinas — Oraculum" },
    { property: "og:description", content: "Proposta visual de supervisão centralizada das prensas cadastradas no Oraculum, com dados de demonstração." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/oraculum-proposta.html"
      title="Oraculum — Proposta visual de Visão Geral"
      className="block h-screen w-full border-0 bg-background"
    />
  );
}
