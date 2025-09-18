// src/servicos/seguroService.js
import axios from 'axios';

// URL base da nossa API. Ajuste a porta se for diferente.
const API_URL = 'https://victorious-cliff-0ebcc850f.1.azurestaticapps.net';

// Função para buscar todos os seguros (Leitura - Read)
const getTodosSeguros = () => {
    return axios.get(API_URL);
};

// Função para buscar um seguro específico pelo ID
const getSeguroPorId = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

// Função para criar um novo seguro (Cadastro - Create)
const criarSeguro = (dadosSeguro) => {
    return axios.post(API_URL, dadosSeguro);
};

// Função para atualizar um seguro existente (Edição - Update)
const atualizarSeguro = (id, dadosSeguro) => {
    return axios.put(`${API_URL}/${id}`, dadosSeguro);
};

// Função para excluir um seguro (Exclusão - Delete)
const excluirSeguro = (id) => {
    return axios.delete(`${API_URL}/${id}`);
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