import React from "react";
import { notFound } from "next/navigation";
import { container } from "@/infrastructure/di/container";
import ProjectForm from "@/presentation/components/portfolio/ProjectForm";
import { updateProjectAction } from "@/presentation/actions/portfolio.actions";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPortfolioEditPage({ params }: EditPageProps) {
  const { id } = await params;
  const project = await container.projectRepository.findById(id);

  if (!project) {
    notFound();
  }

  const initialData = {
    id: project.id,
    title: project.title,
    description: project.description,
    client: project.client,
    category: project.category,
    images: project.images,
    coverImage: project.coverImage,
    date: project.date,
    status: project.status,
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-white">แก้ไขผลงาน</h1>
        <p className="text-xs text-slate-400 font-light mt-1">
          ปรับแต่งเนื้อหารายละเอียด ปรับเปลี่ยนรูปภาพ หรือจัดการสถานะเผยแพร่ผลงานชิ้นนี้
        </p>
      </div>
      
      <ProjectForm initialData={initialData} onSubmitAction={updateProjectAction} />
    </div>
  );
}
