// src/componentes/ListaSeguros.js
import React from 'react';

// O componente agora recebe a lista e as funções como propriedades (props)
const ListaSeguros = ({ seguros, onEditar, onExcluir }) => {

    return (
        <div>
            <h2>Apólices Cadastradas</h2>
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th>Nome do Contratante</th>
                        <th>CPF</th>
                        <th>Destino</th>
 			<th>Tipo do Plano</th>
                        <th>Início da Vigência</th>
                        <th>Fim da Vigência</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Verifica se a lista de seguros está vazia */}
                    {seguros.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>Nenhuma apólice cadastrada.</td>
                        </tr>
                    ) : (
                        seguros.map((seguro) => (
                            <tr key={seguro.id}>
                                <td>{seguro.nomeContratante}</td>
                                <td>{seguro.cpfContratante}</td>
                                <td>{seguro.destino}</td>
				<td>{seguro.tipoPlano}</td>
                                <td>{new Date(seguro.dataInicio).toLocaleDateString()}</td>
                                <td>{new Date(seguro.dataFim).toLocaleDateString()}</td>
                                <td style={{ textAlign: 'center' }}>
                                    {/* O botão Editar chama a função onEditar, passando o ID do seguro */}
                                    <button onClick={() => onEditar(seguro.id)}>Editar</button>
                                    
                                    {/* O botão Excluir chama a função onExcluir, passando o ID */}
                                    <button onClick={() => onExcluir(seguro.id)} style={{ marginLeft: '10px' }}>Excluir</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListaSeguros;