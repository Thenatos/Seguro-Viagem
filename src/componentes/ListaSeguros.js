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

// Função para formatar a data para o padrão brasileiro (DD/MM/YYYY)
const formatarDataBR = (data) => {
    if (!data) return 'N/A';
    // Adiciona um 'T00:00:00' para garantir que a data seja interpretada como local e não UTC
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
};


function ListaSeguros({ seguros, onEditar, onExcluir }) {
    
    if (!seguros || seguros.length === 0) {
        return <p>Nenhum seguro cadastrado ainda.</p>;
    }

    return (
        // O Paper cria um container com uma leve sombra, destacando a tabela
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
                            // Adiciona um efeito de hover para destacar a linha
                            sx={{ '&:hover': { backgroundColor: '#fafafa' } }}
                        >
                            <TableCell>{seguro.nomeContratante}</TableCell>
                            <TableCell>{seguro.cpfContratante}</TableCell>
                            <TableCell>{seguro.destino}</TableCell>
                            <TableCell>{seguro.tipoPlano}</TableCell>
                            <TableCell>{formatarDataBR(seguro.dataInicio)}</TableCell>
                            <TableCell>{formatarDataBR(seguro.dataFim)}</TableCell>
                            <TableCell>
                                {/* Box para alinhar os ícones */}
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