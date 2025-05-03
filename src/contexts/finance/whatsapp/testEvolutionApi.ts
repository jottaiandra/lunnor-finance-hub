
import { toast } from "@/components/ui/sonner";

const EVOLUTION_API_BASE_URL = "https://evolution.anayaatendente.online";

export const testEvolutionApi = async () => {
  const apiToken = "DF53146D34F6-4999-A172-475485A2AC7C";
  const senderNumber = "5583991618969";
  const recipientNumber = "5587996605453";
  const message = "Teste de conexão com a Evolution API realizado por Lovable.";

  console.log("Testando conexão com:", {
    apiToken: apiToken.substring(0, 5) + '...',
    senderNumber,
    recipientNumber
  });

  try {
    // Make the request to the Evolution API
    const evolutionResponse = await fetch(`${EVOLUTION_API_BASE_URL}/message/sendText/${senderNumber}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": apiToken
      },
      body: JSON.stringify({
        number: recipientNumber,
        options: {
          delay: 1200
        },
        textMessage: {
          text: message
        }
      })
    });
    
    // Get the response data
    const responseData = await evolutionResponse.json();
    console.log('Resposta da API Evolution (teste):', responseData);
    
    // Check if the request was successful
    const success = evolutionResponse.ok && responseData?.status === 'success';
    
    if (success) {
      toast.success("Conexão com a Evolution API testada com sucesso!");
      return {
        success: true,
        data: responseData
      };
    } else {
      console.error("Falha na API:", responseData);
      toast.error(`Falha ao conectar: ${responseData?.error?.message || "Erro desconhecido"}`);
      return {
        success: false,
        error: responseData?.error?.message || "Erro desconhecido",
        data: responseData
      };
    }
  } catch (error: any) {
    console.error("Erro ao testar conexão com Evolution:", error);
    toast.error(`Erro ao conectar: ${error.message}`);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};
