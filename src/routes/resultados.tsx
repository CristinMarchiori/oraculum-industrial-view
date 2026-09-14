import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/resultados")({ component: ResultsLayout });

function ResultsLayout() { return <Outlet />; }