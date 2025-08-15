import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
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

export default function ClassDetailsPage() {
  const { serie } = useParams<{ serie: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (serie) {
      const decodedSerie = decodeURIComponent(serie);
      const classStudents = database.alunos.filter(
        (student: Student) => student.serie === decodedSerie
      );
      setStudents(classStudents);
    }
  }, [serie]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/turmas")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {serie ? decodeURIComponent(serie) : "Turma"}
            </h1>
            <p className="text-muted-foreground">
              {students.length} {students.length === 1 ? 'aluno' : 'alunos'}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {students.map((student) => (
            <Card key={student.id_alunos} className="shadow-card">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Student Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {student.nome_do_aluno}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {student.id_alunos} • {student.serie}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Guardian Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Dados do Responsável</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{student.responsavel_nome}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{student.email_responsavel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{student.telefone_responsavel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {students.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  Nenhum aluno encontrado para esta turma.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}