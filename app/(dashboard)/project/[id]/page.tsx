"use client";

import { useParams } from "next/navigation";
import { ProjectLobbyLayout } from "@/features/project/components/ProjectLobbyLayout";

export default function ProjectLobbyPage() {
  const params = useParams();
  const projectId = (params.projectId || params.id) as string;

  return <ProjectLobbyLayout projectId={projectId} />;
}
