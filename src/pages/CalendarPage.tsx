import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import database from "@/data/database.json";
interface CalendarEvent {
  id: string;
  titulo: string;
  data: string;
  horario: string;
  descricao: string;
  series: string[];
}
export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    titulo: "",
    horario: "",
    descricao: "",
    series: [] as string[]
  });
  const { toast } = useToast();
  useEffect(() => {
    setEvents(database.eventos_calendario);
  }, []);
  useEffect(() => {
    if (selectedDate) {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.data === selectedDateStr);
      setTodayEvents(dayEvents);
    }
  }, [selectedDate, events]);
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleSerieChange = (serie: string, checked: boolean) => {
    setNewEvent(prev => ({
      ...prev,
      series: checked 
        ? [...prev.series, serie]
        : prev.series.filter(s => s !== serie)
    }));
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.titulo || !newEvent.horario) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const eventDate = format(selectedDate, "yyyy-MM-dd");
    const event: CalendarEvent = {
      id: Date.now().toString(),
      titulo: newEvent.titulo,
      data: eventDate,
      horario: newEvent.horario,
      descricao: newEvent.descricao,
      series: newEvent.series
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({ titulo: "", horario: "", descricao: "", series: [] });
    setIsDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Evento adicionado com sucesso!"
    });
  };

  const availableSeries = ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano", "6º Ano", "7º Ano", "8º Ano", "9º Ano"];
  return <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Cronograma Escolar</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Calendário</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar 
                mode="single" 
                selected={selectedDate} 
                onSelect={setSelectedDate} 
                month={currentMonth} 
                onMonthChange={setCurrentMonth} 
                className="w-fit mx-auto" 
                modifiers={{
                  eventDay: events.map(event => new Date(event.data + 'T00:00:00'))
                }} 
                modifiersStyles={{
                  eventDay: {
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    borderRadius: '8px',
                    fontWeight: 'bold'
                  }
                }} 
              />
            </CardContent>
          </Card>

          {/* Today's Events */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Eventos do Dia</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Adicionar Evento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Evento</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="titulo">Título *</Label>
                        <Input
                          id="titulo"
                          value={newEvent.titulo}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, titulo: e.target.value }))}
                          placeholder="Digite o título do evento"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="horario">Horário *</Label>
                        <Input
                          id="horario"
                          type="time"
                          value={newEvent.horario}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, horario: e.target.value }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="descricao">Descrição</Label>
                        <Textarea
                          id="descricao"
                          value={newEvent.descricao}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, descricao: e.target.value }))}
                          placeholder="Digite a descrição do evento"
                          rows={3}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Séries</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {availableSeries.map((serie) => (
                            <div key={serie} className="flex items-center space-x-2">
                              <Checkbox
                                id={serie}
                                checked={newEvent.series.includes(serie)}
                                onCheckedChange={(checked) => handleSerieChange(serie, checked as boolean)}
                              />
                              <Label htmlFor={serie} className="text-sm">{serie}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddEvent}>
                          Adicionar Evento
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {todayEvents.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                  <p>Sem eventos.</p>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="font-medium text-foreground">Título</p>
                    <div className="mt-2 p-2 bg-background rounded border">
                      <p className="text-sm text-muted-foreground">Tipo</p>
                      <p className="text-sm">Prova, Reunião...</p>
                    </div>
                  </div>
                </div> : <div className="space-y-4">
                  {todayEvents.map(event => <div key={event.id} className="p-4 bg-edu-primary-light rounded-lg border border-primary/20">
                      <h3 className="font-semibold text-foreground">{event.titulo}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.horario} • {event.series.join(", ")}
                      </p>
                      <p className="text-sm text-foreground mt-2">{event.descricao}</p>
                    </div>)}
                </div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>;
}