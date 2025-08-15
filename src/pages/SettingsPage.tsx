import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("email@exemplo.com");
  const [phone, setPhone] = useState("(00) 00000-0000");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos de senha.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  const handleNotificationUpdate = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Configurações de notificação atualizadas!");
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Password Change */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nova senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10"
                />
              </div>

              <Button 
                onClick={handlePasswordChange}
                disabled={isLoading}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-notification">E-mail</Label>
                <Input
                  id="email-notification"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-notification">Telefone</Label>
                <Input
                  id="phone-notification"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10"
                />
              </div>

              <Button 
                onClick={handleNotificationUpdate}
                disabled={isLoading}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Sobre o ProjectEduConnect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-primary font-semibold">Nossa Missão</h3>
              <p className="text-muted-foreground">
                Proporcionar uma educação de excelência que forme cidadãos críticos, criativos e responsáveis, 
                preparando-os para os desafios do futuro através de uma abordagem pedagógica inovadora e humanizada.
              </p>

              <h3 className="text-primary font-semibold mt-6">Nossa Visão</h3>
              <p className="text-muted-foreground">
                Ser reconhecida como referência em educação fundamental, promovendo o desenvolvimento integral dos 
                alunos e fortalecendo os vínculos entre escola, família e comunidade.
              </p>

              <h3 className="text-primary font-semibold mt-6">Nossos Valores</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Excelência acadêmica e pedagógica</li>
                <li>• Respeito à diversidade e inclusão</li>
                <li>• Transparência e comunicação eficaz</li>
                <li>• Desenvolvimento socioemocional</li>
                <li>• Inovação educacional</li>
                <li>• Parceria família-escola</li>
              </ul>

              <h3 className="text-primary font-semibold mt-6">Abordagem Pedagógica</h3>
              <p className="text-muted-foreground">
                Nossa metodologia combina práticas pedagógicas tradicionais com inovações tecnológicas, priorizando 
                o aprendizado significativo e o desenvolvimento de competências essenciais para o século XXI.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}