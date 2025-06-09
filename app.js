// Import do WebLLM (assumindo que estará local, na pasta models/)
import { MLClient, sampling } from "./models/index.js";

const chat = document.getElementById("chat");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let client;
let model;

async function initialize() {
  client = await MLClient.load({
    modelPath: "./models/",
    modelName: "ggml-alpaca-7b-q4.bin",  // modelo exemplo, ajuste se quiser outro
  });

  model = client.model;
  addAIMessage("Olá! Eu sou uma IA simples rodando no seu navegador.");
}

function addMessage(text, sender = "ai") {
  const div = document.createElement("div");
  div.classList.add("message");
  div.classList.add(sender);
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";
  addMessage("...", "ai"); // Indicador temporário

  // Gera resposta com o modelo
  try {
    const response = await model.generate(text, {
      maxTokens: 100,
      temperature: 0.7,
      topP: 0.9,
      stream: false,
    });

    // Remove o indicador "..." da última mensagem
    chat.lastChild.remove();

    addMessage(response);
  } catch (err) {
    chat.lastChild.remove();
    addMessage("Erro ao gerar resposta: " + err.message);
  }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

initialize();
