import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
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
            <CardContent>
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} month={currentMonth} onMonthChange={setCurrentMonth} className="w-full" modifiers={{
              eventDay: events.map(event => new Date(event.data))
            }} modifiersStyles={{
              eventDay: {
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                borderRadius: '8px'
              }
            }} />
            </CardContent>
          </Card>

          {/* Today's Events */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Eventos do Dia</CardTitle>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Evento
                </Button>
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