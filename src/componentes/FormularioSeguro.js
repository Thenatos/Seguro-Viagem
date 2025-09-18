// src/componentes/FormularioSeguro.js
import React, { useState, useEffect } from 'react';
import seguroService from '../servicos/seguroService';
import axios from 'axios'; // Precisamos do axios para a busca dos estados

// Importando os componentes do Material-UI
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, CircularProgress } from '@mui/material';

// Adapta o formato da data para o input date do HTML
const formatarDataParaInput = (data) => {
    if (!data) return '';
    return new Date(data).toISOString().split('T')[0];
};

function FormularioSeguro({ idSeguroEditando, onSeguroSalvo, onCancelar }) {
    const [seguro, setSeguro] = useState({
        nomeContratante: '',
        cpfContratante: '',
        destino: 'São Paulo', // Valor padrão
        tipoPlano: 'Standart', // Valor padrão
        dataInicio: '',
        dataFim: ''
    });

    // Novo estado para armazenar a lista de estados
    const [estados, setEstados] = useState([]); 

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Efeito para buscar os estados da API do IBGE quando o componente é montado
    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => {
                setEstados(response.data); // Armazena a lista de estados
            })
            .catch(err => {
                console.error("Falha ao buscar estados:", err);
                // Adiciona alguns estados manualmente em caso de falha na API
                setEstados([{ id: 1, nome: "São Paulo" }, { id: 2, nome: "Rio de Janeiro" }]);
            });
    }, []);

    useEffect(() => {
        if (idSeguroEditando) {
            setLoading(true);
            seguroService.getSeguroPorId(idSeguroEditando)
                .then(response => {
                    const dados = response.data;
                    dados.dataInicio = formatarDataParaInput(dados.dataInicio);
                    dados.dataFim = formatarDataParaInput(dados.dataFim);
                    setSeguro(dados);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Falha ao carregar dados do seguro.');
                    setLoading(false);
                });
        }
    }, [idSeguroEditando]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSeguro(prevState => ({ ...prevState, [name]: value }));
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        const promessa = idSeguroEditando
            ? seguroService.atualizarSeguro(idSeguroEditando, seguro)
            : seguroService.criarSeguro(seguro);

        promessa
            .then(() => {
                alert(`Seguro ${idSeguroEditando ? 'atualizado' : 'salvo'} com sucesso!`);
                onSeguroSalvo();
            })
            .catch(err => {
                setError(`Erro ao salvar seguro: ${err.message}`);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (loading && !estados.length) return <CircularProgress />; // Mostra spinner enquanto carrega tudo
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <Box
            component="form"
            onSubmit={onSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '500px', margin: 'auto' }}
        >
            <h2>{idSeguroEditando ? 'Editar Seguro' : 'Cadastrar Novo Seguro'}</h2>
            
            <TextField
                label="Nome do Contratante"
                name="nomeContratante"
                value={seguro.nomeContratante}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
            />
            
            <TextField
                label="CPF do Contratante"
                name="cpfContratante"
                value={seguro.cpfContratante}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
            />

            <FormControl fullWidth>
                <InputLabel>Destino</InputLabel>
                <Select
                    name="destino"
                    value={seguro.destino}
                    label="Destino"
                    onChange={handleChange}
                >
                    {/* Mapeia a lista de estados para criar os itens do menu */}
                    {estados.map(estado => (
                        <MenuItem key={estado.id} value={estado.nome}>
                            {estado.nome}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel>Tipo do Plano</InputLabel>
                <Select
                    name="tipoPlano"
                    value={seguro.tipoPlano}
                    label="Tipo do Plano"
                    onChange={handleChange}
                >
                    <MenuItem value="Standart">Standart</MenuItem>
                    <MenuItem value="Premium">Premium</MenuItem>
                    <MenuItem value="Business">Business</MenuItem>
                </Select>
            </FormControl>

            <TextField
                label="Início da Vigência"
                name="dataInicio"
                type="date"
                value={seguro.dataInicio}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
            />

            <TextField
                label="Fim da Vigência"
                name="dataFim"
                type="date"
                value={seguro.dataFim}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button variant="text" onClick={onCancelar}>Cancelar</Button>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
            </Box>

        </Box>
    );
}

export default FormularioSeguro;