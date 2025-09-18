// src/servicos/seguroService.js
import axios from 'axios';

// 1. Defina a API com a URL BASE (sem /api/Seguros no final)
const api = axios.create({
  baseURL: 'https://api-seguroviagem-franciscomartins.azurewebsites.net'
});

// 2. Use os caminhos completos em cada função, começando com /api
const getTodosSeguros = () => {
  return api.get('/api/Seguros');
};

const getSeguroPorId = (id) => {
  return api.get(`/api/Seguros/${id}`);
};

const criarSeguro = (dadosSeguro) => {
  return api.post('/api/Seguros', dadosSeguro);
};

const atualizarSeguro = (id, dadosSeguro) => {
  return api.put(`/api/Seguros/${id}`, dadosSeguro);
};

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