// src/componentes/FormularioSeguro.js
import React, { useState, useEffect } from 'react';
import seguroService from '../servicos/seguroService';
import { estadosDoBrasil } from '../dados/estados';

const FormularioSeguro = ({ idSeguroEditando, onSeguroSalvo, onCancelar }) => {
    
    const estadoInicial = {
        nomeContratante: '',
        cpfContratante: '',
        destino: 'SP',
        dataInicio: '',
        dataFim: '',
        tipoPlano: 'Standart'
    };

    const [seguro, setSeguro] = useState(estadoInicial);
    const [titulo, setTitulo] = useState('Cadastrar Novo Seguro');

    useEffect(() => {
        // CORREÇÃO 1: Removido o ", estadoInicial" da condição. A verificação correta é apenas se idSeguroEditando existe.
        if (idSeguroEditando) {
            setTitulo('Editar Seguro');
            seguroService.getSeguroPorId(idSeguroEditando)
                .then(response => {
                    const dados = {
                        ...response.data,
                        dataInicio: response.data.dataInicio.split('T')[0],
                        dataFim: response.data.dataFim.split('T')[0]
                    };
                    setSeguro(dados);
                })
                .catch(error => console.error("Erro ao buscar seguro para edição:", error));
        } else {
            setTitulo('Cadastrar Novo Seguro');
            setSeguro(estadoInicial);
        }
    // CORREÇÃO 2: Adicionada a dependência 'estadoInicial' ao array, conforme exigido pelo React.
    }, [idSeguroEditando, estadoInicial]);

    const formatarCPF = (valor) => {
        const cpfApenasNumeros = valor.replace(/\D/g, '');
        return cpfApenasNumeros
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .substring(0, 14);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'cpfContratante') {
            setSeguro(prevState => ({ ...prevState, [name]: formatarCPF(value) }));
        } else {
            setSeguro(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (seguro.nomeContratante.trim().length < 3) {
            alert("O nome do contratante deve ter pelo menos 3 caracteres.");
            return; 
        }

        const cpfApenasNumeros = seguro.cpfContratante.replace(/\D/g, '');
        if (cpfApenasNumeros.length !== 11) {
            alert("O CPF deve conter 11 dígitos.");
            return;
        }

        const seguroParaEnviar = {
            ...seguro,
            dataInicio: `${seguro.dataInicio}T00:00:00`,
            dataFim: `${seguro.dataFim}T00:00:00`,
        };

        const acao = idSeguroEditando
            ? seguroService.atualizarSeguro(idSeguroEditando, seguroParaEnviar)
            : seguroService.criarSeguro(seguroParaEnviar);

        acao.then(() => {
            alert(`Seguro ${idSeguroEditando ? 'atualizado' : 'cadastrado'} com sucesso!`);
            onSeguroSalvo();
        }).catch(error => {
            console.error("Erro ao salvar seguro:", error);
            alert("Ocorreu um erro ao salvar. Verifique o console.");
        });
    };

    return (
        <div>
            <h2>{titulo}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
                
                <input 
                    type="text" 
                    name="nomeContratante" 
                    value={seguro.nomeContratante} 
                    onChange={handleChange} 
                    placeholder="Nome do Contratante" 
                    required 
                    minLength="3" 
                />
                
                <input 
                    type="text" 
                    name="cpfContratante" 
                    value={seguro.cpfContratante} 
                    onChange={handleChange} 
                    placeholder="CPF" 
                    required 
                    maxLength="14"
                />
                
                <label>Destino:</label>
                <select 
                    name="destino" 
                    value={seguro.destino} 
                    onChange={handleChange} 
                    required
                >
                    {estadosDoBrasil.map(estado => (
                        <option key={estado.sigla} value={estado.sigla}>
                            {estado.nome}
                        </option>
                    ))}
                </select>

                <label>Tipo do Plano:</label>
                <select name="tipoPlano" value={seguro.tipoPlano} onChange={handleChange} required>
                    <option value="Standart">Standart</option>
                    <option value="Premium">Premium</option>
                    <option value="Business">Business</option>
                </select>

                <label>Início da Vigência:</label>
                <input type="date" name="dataInicio" value={seguro.dataInicio} onChange={handleChange} required />
                
                <label>Fim da Vigência:</label>
                <input type="date" name="dataFim" value={seguro.dataFim} onChange={handleChange} required />
                
                <div>
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={onCancelar} style={{ marginLeft: '10px' }}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default FormularioSeguro;