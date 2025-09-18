// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import ListaSeguros from './componentes/ListaSeguros';
import FormularioSeguro from './componentes/FormularioSeguro';
import seguroService from './servicos/seguroService';

function App() {
  const [seguros, setSeguros] = useState([]);
  const [exibindoFormulario, setExibindoFormulario] = useState(false);
  const [idSeguroEditando, setIdSeguroEditando] = useState(null);

  // Função para carregar/recarregar os seguros do backend
  const carregarSeguros = () => {
    seguroService.getTodosSeguros()
      .then(response => {
        setSeguros(response.data);
      })
      .catch(error => console.error("Erro ao buscar seguros:", error));
  };

  // Carrega os seguros assim que o componente é montado
  useEffect(() => {
    carregarSeguros();
  }, []);

  // Funções para controlar a exibição do formulário
  const handleAdicionar = () => {
    setIdSeguroEditando(null); // Garante que não estamos editando
    setExibindoFormulario(true);
  };

  const handleEditar = (id) => {
    setIdSeguroEditando(id); // Define o ID do seguro que queremos editar
    setExibindoFormulario(true);
  };

  const handleExcluir = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este seguro?")) {
      seguroService.excluirSeguro(id)
        .then(() => {
          alert("Seguro excluído com sucesso!");
          carregarSeguros(); // Recarrega a lista
        })
        .catch(error => console.error("Erro ao excluir seguro:", error));
    }
  };

  // Função chamada pelo formulário quando um seguro é salvo
  const handleSeguroSalvo = () => {
    setExibindoFormulario(false); // Esconde o formulário
    setIdSeguroEditando(null);
    carregarSeguros(); // Recarrega a lista para mostrar a alteração
  };

  const handleCancelar = () => {
    setExibindoFormulario(false);
    setIdSeguroEditando(null);
  }

  return (
    <div className="App">
      <h1>Gestão de Seguros de Viagem</h1>

      {/* Condição: Se exibindoFormulario for true, mostra o formulário. Senão, mostra a lista e o botão de adicionar. */}
      {exibindoFormulario ? (
        <FormularioSeguro 
          idSeguroEditando={idSeguroEditando} 
          onSeguroSalvo={handleSeguroSalvo} 
          onCancelar={handleCancelar}
        />
      ) : (
        <>
          <button onClick={handleAdicionar} style={{ marginBottom: '20px' }}>Adicionar Novo Seguro</button>
          <ListaSeguros 
            seguros={seguros} 
            onEditar={handleEditar} 
            onExcluir={handleExcluir} 
          />
        </>
      )}
    </div>
  );
}

export default App;