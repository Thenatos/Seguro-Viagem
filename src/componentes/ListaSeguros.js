// src/componentes/ListaSeguros.js
import React from 'react';

// Importando os componentes de Tabela do Material-UI
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    IconButton,
    Box 
} from '@mui/material';

// Importando os Ícones
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// ############################# CORREÇÃO FEITA AQUI #############################
// Função para formatar a data para o padrão brasileiro (DD/MM/YYYY)
// A data que vem da API já está em um formato que o new Date() entende.
const formatarDataBR = (data) => {
    if (!data) return 'N/A';
    // Apenas passamos a data diretamente para o construtor Date
    return new Date(data).toLocaleDateString('pt-BR');
};
// ###############################################################################


function ListaSeguros({ seguros, onEditar, onExcluir }) {
    
    if (!seguros || seguros.length === 0) {
        return <p>Nenhum seguro cadastrado ainda.</p>;
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de seguros">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Nome do Contratante</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>CPF</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Destino</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Plano</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Início</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Fim</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {seguros.map((seguro) => (
                        <TableRow
                            key={seguro.id}
                            sx={{ '&:hover': { backgroundColor: '#fafafa' } }}
                        >
                            <TableCell>{seguro.nomeContratante}</TableCell>
                            <TableCell>{seguro.cpfContratante}</TableCell>
                            <TableCell>{seguro.destino}</TableCell>
                            <TableCell>{seguro.tipoPlano}</TableCell>
                            <TableCell>{formatarDataBR(seguro.dataInicio)}</TableCell>
                            <TableCell>{formatarDataBR(seguro.dataFim)}</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <IconButton 
                                        aria-label="editar" 
                                        color="primary" 
                                        onClick={() => onEditar(seguro.id)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        aria-label="excluir" 
                                        color="error" 
                                        onClick={() => onExcluir(seguro.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ListaSeguros;