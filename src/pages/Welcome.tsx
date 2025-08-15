import { GraduationCap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-edu-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary">EduConnect</h1>
          </div>
          
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Bem-vindo ao <span className="text-primary">ProjectEduConnect</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plataforma de gestão escolar que conecta famílias e educadores em um ambiente 
            seguro e intuitivo.
          </p>
        </div>

        {/* Teacher Access Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-lg shadow-elevated border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-edu-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Sou Docente</h3>
              <p className="text-muted-foreground">
                Mantenha-se conectado com o Cronograma Escolar
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Acompanhamento do cronograma escolar</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Gerenciamento de turmas</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Comunicar-se com responsáveis</span>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate("/login")}
                className="w-full h-12 text-base font-medium mt-6"
              >
                Acessar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}