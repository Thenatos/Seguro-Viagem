// src/componentes/FormularioSeguro.js
import React, { useState, useEffect } from 'react';
import seguroService from '../servicos/seguroService';

// Importando os componentes do Material-UI
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, CircularProgress } from '@mui/material';

// Adapta o formato da data para o input date do HTML
const formatarDataParaInput = (data) => {
    if (!data) return '';
    // Converte a data (ex: "2025-09-18T00:00:00") para "YYYY-MM-DD"
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (idSeguroEditando) {
            setLoading(true);
            seguroService.getSeguroPorId(idSeguroEditando)
                .then(response => {
                    // Formata as datas antes de colocar no estado
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

    if (loading) return <CircularProgress />; // Mostra um spinner de carregamento
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        // Usamos o componente Box do MUI para criar um container e dar espaçamento
        <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2, // Espaçamento entre os itens
                maxWidth: '500px',
                margin: 'auto'
            }}
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
                    <MenuItem value="São Paulo">São Paulo</MenuItem>
                    <MenuItem value="Rio de Janeiro">Rio de Janeiro</MenuItem>
                    <MenuItem value="Salvador">Salvador</MenuItem>
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
                InputLabelProps={{ shrink: true }} // Garante que o label não sobreponha a data
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
            
            {/* Box para alinhar os botões lado a lado */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button variant="text" onClick={onCancelar}>Cancelar</Button>
                <Button type="submit" variant="contained" color="primary">
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
            </Box>

        </Box>
    );
}

export default FormularioSeguro;