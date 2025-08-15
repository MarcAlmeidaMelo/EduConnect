import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import database from "@/data/database.json";

interface Student {
  id_alunos: string;
  nome_do_aluno: string;
  serie: string;
  email_responsavel: string;
  telefone_responsavel: string;
  responsavel_nome: string;
}

interface ClassInfo {
  serie: string;
  studentCount: number;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [newClass, setNewClass] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Group students by class and count them
    const classGroups = database.alunos.reduce((acc: Record<string, number>, student: Student) => {
      acc[student.serie] = (acc[student.serie] || 0) + 1;
      return acc;
    }, {});

    const classesData = Object.entries(classGroups).map(([serie, count]) => ({
      serie,
      studentCount: count
    }));

    setClasses(classesData);
  }, []);

  const handleViewStudents = (serie: string) => {
    navigate(`/turmas/${encodeURIComponent(serie)}`);
  };

  const handleAddClass = () => {
    if (newClass.trim()) {
      const exists = classes.find(c => c.serie === newClass.trim());
      if (!exists) {
        setClasses([...classes, { serie: newClass.trim(), studentCount: 0 }]);
        setNewClass("");
      }
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Turmas</h1>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">Turmas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {classes.map((classInfo) => (
              <div
                key={classInfo.serie}
                className="flex items-center justify-between p-4 bg-muted rounded-lg border"
              >
                <div>
                  <h3 className="font-semibold text-foreground">{classInfo.serie}</h3>
                  <p className="text-sm text-muted-foreground">
                    {classInfo.studentCount} alunos
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleViewStudents(classInfo.serie)}
                  className="gap-2"
                >
                  <Users className="w-4 h-4" />
                  Ver alunos
                </Button>
              </div>
            ))}

            {/* Add new class */}
            <div className="flex gap-2 pt-4 border-t">
              <Input
                placeholder="Nova turma (ex: 6º A)"
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddClass()}
                className="flex-1"
              />
              <Button onClick={handleAddClass} className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}