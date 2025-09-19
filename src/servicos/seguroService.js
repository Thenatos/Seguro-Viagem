
import axios from 'axios';

// Configuração da instância do Axios com a URL base da API do Portal Azure
const api = axios.create({
  baseURL: 'https://api-seguroviagem-franciscomartins.azurewebsites.net'
});

// Função para obter todos os seguros
const getTodosSeguros = () => {
  return api.get('/api/Seguros');
};
// Função para obter um seguro específico pelo ID
const getSeguroPorId = (id) => {
  return api.get(`/api/Seguros/${id}`);
};
// Função para criar um novo seguro
const criarSeguro = (dadosSeguro) => {
  return api.post('/api/Seguros', dadosSeguro);
};
// Função para atualizar um seguro existente
const atualizarSeguro = (id, dadosSeguro) => {
  return api.put(`/api/Seguros/${id}`, dadosSeguro);
};
// Função para excluir um seguro pelo ID
const excluirSeguro = (id) => {
  return api.delete(`/api/Seguros/${id}`);
};

// Exporta todas as funções para que possam ser usadas em outros lugares
const funcoesApi = {
    getTodosSeguros,
    getSeguroPorId,
    criarSeguro,
    atualizarSeguro,
    excluirSeguro
};

export default funcoesApi;