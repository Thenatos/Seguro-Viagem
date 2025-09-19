
import React from 'react';
import seguroService from '../servicos/seguroService';
import axios from 'axios';


import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, CircularProgress } from '@mui/material';

const formatarDataParaInput = (data) => {
    if (!data) return '';
    return new Date(data).toISOString().split('T')[0];
};

// Função para aplicar a máscara de CPF
const mascaraCPF = (valor) => {
    if (!valor) return "";
    return valor
        .replace(/\D/g, '') // Remove tudo o que não é dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o sexto e o sétimo dígitos
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Coloca um hífen entre o nono e o décimo dígitos
        .substring(0, 14); // Limita ao tamanho máximo do CPF (11 dígitos + 3 caracteres)
};
// Componente de Formulário de Seguro
function FormularioSeguro({ idSeguroEditando, onSeguroSalvo, onCancelar }) {
    const [seguro, setSeguro] = React.useState({
        nomeContratante: '',
        cpfContratante: '',
        destino: 'São Paulo',
        tipoPlano: 'Standart',
        dataInicio: '',
        dataFim: ''
    });

    const [estados, setEstados] = React.useState([]); // Lista de estados para o campo de destino
    const [loading, setLoading] = React.useState(false); 
    const [error, setError] = React.useState('');  

    React.useEffect(() => {// Buscar a lista de estados do IBGE
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => {
                setEstados(response.data);
            })
            .catch(err => {
                console.error("Falha ao buscar estados:", err);
                setEstados([{ id: 1, nome: "São Paulo" }, { id: 2, nome: "Rio de Janeiro" }]);
            });
    }, []);

    React.useEffect(() => { 
        if (idSeguroEditando) {// Se estivermos editando, busca os dados do seguro
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
// Aplica a máscara de CPF apenas no campo específico
        if (name === 'cpfContratante') {
            setSeguro(prevState => ({ ...prevState, [name]: mascaraCPF(value) }));
        } else {
            setSeguro(prevState => ({ ...prevState, [name]: value }));
        }
    };
// Função para lidar com o envio do formulário
    const onSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        // Decide se vai criar ou atualizar com base na presença do idSeguroEditando
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

    if (loading && !estados.length) return <CircularProgress />;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <Box 
            component="form"
            onSubmit={onSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '500px', margin: 'auto' }}
        >
            <h2>{idSeguroEditando ? 'Editar Seguro' : 'Cadastrar Novo Seguro'}</h2>
            
            <TextField // O TextField do Nome do Contratante permanece o mesmo
                label="Nome do Contratante"
                name="nomeContratante"
                value={seguro.nomeContratante}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
            />
            
            {/* O TextField do CPF volta a ser um componente simples */}
            <TextField
                label="CPF do Contratante"
                name="cpfContratante"
                value={seguro.cpfContratante}
                onChange={handleChange} // O nosso handleChange agora tem a lógica da máscara
                variant="outlined"
                fullWidth
                required
                placeholder="000.000.000-00"
            />
            
            <FormControl fullWidth> 
                <InputLabel>Destino</InputLabel>
                <Select name="destino" value={seguro.destino} label="Destino" onChange={handleChange}>
                    {estados.map(estado => (
                        <MenuItem key={estado.id} value={estado.nome}>
                            {estado.nome}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth> 
                <InputLabel>Tipo do Plano</InputLabel>
                <Select name="tipoPlano" value={seguro.tipoPlano} label="Tipo do Plano" onChange={handleChange}>
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