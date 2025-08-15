import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Send, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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

interface MessageTemplate {
  id: string;
  titulo: string;
  template: string;
}

export default function CommunicationPage() {
  const [selectedSerie, setSelectedSerie] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedMessage, setSelectedMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  
  const [series, setSeries] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([]);

  useEffect(() => {
    // Load data from database
    const uniqueSeries = Array.from(new Set(database.alunos.map((student: Student) => student.serie)));
    setSeries(uniqueSeries);
    setStudents(database.alunos);
    setMessageTemplates(database.mensagens_predefinidas);
  }, []);

  useEffect(() => {
    if (selectedSerie) {
      const filtered = students.filter(student => student.serie === selectedSerie);
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
    setSelectedStudent("");
  }, [selectedSerie, students]);

  const selectedMessageTemplate = messageTemplates.find(msg => msg.id === selectedMessage);
  const needsDate = selectedMessageTemplate?.template.includes('[DATA]');

  const processMessage = (template: string, studentName: string, date?: Date) => {
    let processed = template.replace(/\[NOME_DO_ALUNO\]/g, studentName);
    if (date && template.includes('[DATA]')) {
      processed = processed.replace(/\[DATA\]/g, format(date, "dd/MM/yyyy", { locale: ptBR }));
    }
    return processed;
  };

  const handleSendMessage = async () => {
    if (!selectedSerie) {
      toast.error("Por favor, selecione uma série.");
      return;
    }

    if (!selectedStudent) {
      toast.error("Por favor, selecione um aluno.");
      return;
    }

    if (!selectedMessage) {
      toast.error("Por favor, selecione uma mensagem.");
      return;
    }

    if (needsDate && !selectedDate) {
      toast.error("Por favor, selecione uma data para esta mensagem.");
      return;
    }

    const student = students.find(s => s.id_alunos === selectedStudent);
    const messageTemplate = messageTemplates.find(m => m.id === selectedMessage);

    if (!student || !messageTemplate) {
      toast.error("Erro ao encontrar dados do aluno ou mensagem.");
      return;
    }

    setIsLoading(true);

    try {
      const processedMessage = processMessage(
        messageTemplate.template,
        student.nome_do_aluno,
        selectedDate
      );

      const payload = {
        timestamp: new Date().toISOString(),
        escola: {
          nome: "EduConnect School",
          sistema: "ProjectEduConnect"
        },
        aluno: {
          id: student.id_alunos,
          nome: student.nome_do_aluno,
          serie: student.serie
        },
        responsavel: {
          nome: student.responsavel_nome,
          email: student.email_responsavel,
          telefone: student.telefone_responsavel
        },
        mensagem: {
          conteudo: processedMessage,
          template_original: messageTemplate.template,
          data_evento: selectedDate ? format(selectedDate, "yyyy-MM-dd") : null
        },
        metadados: {
          usuario_sistema: "Professor",
          canal_envio: ["email", "whatsapp"],
          prioridade: "normal",
          categoria: "comunicacao_escolar"
        }
      };

      // Send to webhook
      const response = await fetch("https://marcelmelo.app.n8n.cloud/webhook-test/b5d40ed8-186d-4028-b84a-2c2f63532f07", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Source": "ProjectEduConnect",
          "X-Timestamp": new Date().toISOString()
        },
        mode: "no-cors",
        body: JSON.stringify(payload)
      });

      // Simulate saving to local database (in a real app, this would be an API call)
      const messageRecord = {
        id: `msg_${Date.now()}`,
        timestamp: new Date().toISOString(),
        student_id: student.id_alunos,
        template_id: messageTemplate.id,
        processed_message: processedMessage,
        ...payload
      };

      toast.success(`Mensagem enviada com sucesso para ${student.nome_do_aluno}!`);
      
      // Reset form
      setSelectedSerie("");
      setSelectedStudent("");
      setSelectedMessage("");
      setSelectedDate(undefined);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Enviar Mensagem</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                Selecione o aluno e a mensagem que deseja enviar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Série Selection */}
              <div className="space-y-2">
                <Label htmlFor="serie">Série</Label>
                <Select value={selectedSerie} onValueChange={setSelectedSerie}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma série" />
                  </SelectTrigger>
                  <SelectContent>
                    {series.map((serie) => (
                      <SelectItem key={serie} value={serie}>
                        {serie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Student Selection */}
              <div className="space-y-2">
                <Label htmlFor="aluno">Aluno</Label>
                <Select 
                  value={selectedStudent} 
                  onValueChange={setSelectedStudent}
                  disabled={!selectedSerie}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStudents.map((student) => (
                      <SelectItem key={student.id_alunos} value={student.id_alunos}>
                        {student.nome_do_aluno}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message Template Selection */}
              <div className="space-y-2">
                <Label htmlFor="mensagem">Mensagem</Label>
                <Select value={selectedMessage} onValueChange={setSelectedMessage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma mensagem" />
                  </SelectTrigger>
                  <SelectContent>
                    {messageTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection (conditional) */}
              {needsDate && (
                <div className="space-y-2">
                  <Label>Data do Evento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Message Preview */}
              {selectedMessageTemplate && selectedStudent && (
                <div className="space-y-2">
                  <Label>Prévia da Mensagem</Label>
                  <div className="p-4 bg-muted rounded-lg border">
                    <p className="text-sm text-foreground">
                      {processMessage(
                        selectedMessageTemplate.template,
                        students.find(s => s.id_alunos === selectedStudent)?.nome_do_aluno || "",
                        selectedDate
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Send Button */}
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="w-full h-12 text-base font-medium gap-2"
              >
                <Send className="w-4 h-4" />
                {isLoading ? "Enviando Mensagem..." : "Enviar Mensagem"}
              </Button>
            </CardContent>
          </Card>

          {/* Warning Message */}
          {!selectedSerie && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <p className="text-sm text-orange-800">
                Por favor, selecione uma série
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}