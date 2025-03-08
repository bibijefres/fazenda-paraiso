import React, { useState, useEffect } from "react"; {  Container,  Edit, 
  Form,
  Button,
  Table,
  Alert,
  ProgressBar,
  Navbar,
  ToggleButton,
  ToggleButtonGroup,
  Tabs,
  Tab
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
;
  BarChart2,
  DollarSign,
  CheckCircle
} from "react-feather";
import "bootstrap/dist/c
  import {
  Trash2,
  Edit,
  PlusCircle,
  import SimpleLogin from "./SimpleLogin"ss/bootstrap.min.css";
import "./App.css";
import logo from "./assets/logo.svg";  // Ajuste/remova se não tiver.

export default function FazendaParaisoApp() {
  // ─────────────────────────────────────────────────────────
  // Estados principais
  // ─────────────────────────────────────────────────────────
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [bovinos, setBovinos] = useState([]);

  // **Campo de busca** para filtrar na tabela
  const [searchTerm, setSearchTerm] = useState("");

  // Dados Básicos
  const [basicData, setBasicData] = useState({
    brinco: "",
  const [authenticated, setAuthenticated] = useState(false);  conautenticated, setAuthenticated] = useState(false);
    raca: "",
    sexo: "M",
    dataEntrada: "",
    pesoInicial: "",
    localManejo: "",
    observacoes: ""
  });

  // Vacinas
  const [vacinaData, setVacinaData] = useState({
    ultimaVacina: "",
    proximaVacina: "",
    tipoVacina: ""
  });

  // Financeiro
  const [financeData, setFinanceData] = useState({
    custoAlimentacao: "",
    custoMedicacao: "",
    receitaVenda: ""
  });

  // Alertas e controle de edição
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Wizard: 3 passos
  const progressSteps = 3;
  const currentProgress = Math.round(((currentStepIndex + 1) / progressSteps) * 100);

  // ─────────────────────────────────────────────────────────
  // 1) Carregar do localStorage
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    const savedBovinos = localStorage.getItem("bovinos");
    if (savedBovinos) {
      setBovinos(JSON.parse(savedBovinos));
    }
  }, []);

  // 2) Salvar no localStorage sempre que bovinos mudar
  useEffect(() => {
    localStorage.setItem("bovinos", JSON.stringify(bovinos));
  }, [bovinos]);

  // ─────────────────────────────────────────────────────────
  // Navegação do Wizard
  // ─────────────────────────────────────────────────────────
  const handleNextStep = () => {
    if (currentStepIndex === 0) {
      // Validação do step 1
      if (!basicData.brinco || !basicData.raca || !basicData.pesoInicial) {
        setErrorMsg("Preencha pelo menos: Brinco, Raça e Peso Inicial.");
        return;
      }
    }
    setErrorMsg("");
    setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg("");
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // ─────────────────────────────────────────────────────────
  // Edição e Exclusão
  // ─────────────────────────────────────────────────────────
  const handleEdit = (index) => {
    const boi = bovinos[index];
    // Preenche states do Wizard
    setBasicData({
      brinco: boi.brinco,
      raca: boi.raca,
      sexo: boi.sexo,
      dataEntrada: boi.dataEntrada,
      pesoInicial: boi.pesoInicial || "",
      localManejo: boi.localManejo,
      observacoes: boi.observacoes
    });
    setVacinaData({
      ultimaVacina: boi.ultimaVacina || "",
      proximaVacina: boi.proximaVacina || "",
      tipoVacina: boi.tipoVacina || ""
    });
    setFinanceData({
      custoAlimentacao: boi.custoAlimentacao || "",
      custoMedicacao: boi.custoMedicacao || "",
      receitaVenda: boi.receitaVenda || ""
    });

    // Remove do array para re-inserir ao salvar
    const updated = [...bovinos];
    updated.splice(index, 1);
    setBovinos(updated);

    setEditIndex(index);
    setSuccessMsg("Carregando dados para edição...");
    setCurrentStepIndex(0);
  };

  const handleDelete = (index) => {
    const updated = [...bovinos];
    updated.splice(index, 1);
    setBovinos(updated);
    setSuccessMsg("Boi removido com sucesso!");
  };

  // ─────────────────────────────────────────────────────────
  // Finalizar e salvar
  // ─────────────────────────────────────────────────────────
  const handleFinish = () => {
    const newBoi = {
      ...basicData,
      ...vacinaData,
      ...financeData,
      // Converte valores para floats
      pesoInicial: parseFloat(basicData.pesoInicial) || 0,
      custoAlimentacao: parseFloat(financeData.custoAlimentacao) || 0,
      custoMedicacao: parseFloat(financeData.custoMedicacao) || 0,
      receitaVenda: parseFloat(financeData.receitaVenda) || 0
    };

    setBovinos((prev) => [...prev, newBoi]);
    setSuccessMsg(editIndex === null ? "Boi cadastrado com sucesso!" : "Boi atualizado com sucesso!");
    // Reset
    setEditIndex(null);
    setBasicData({
      brinco: "",
      raca: "",
      sexo: "M",
      dataEntrada: "",
      pesoInicial: "",
      localManejo: "",
      observacoes: ""
    });
    setVacinaData({ ultimaVacina: "", proximaVacina: "", tipoVacina: "" });
    setFinanceData({ custoAlimentacao: "", custoMedicacao: "", receitaVenda: "" });
    setCurrentStepIndex(0);
  };

  // ─────────────────────────────────────────────────────────
  // Cálculos de Custos, Receitas, Lucro
  // ─────────────────────────────────────────────────────────
  const totalCustos = bovinos.reduce(
    (acc, b) => acc + (b.custoAlimentacao || 0) + (b.custoMedicacao || 0),
    0
  );
  const totalReceitas = bovinos.reduce((acc, b) => acc + (b.receitaVenda || 0), 0);
  const lucroLiquido = totalReceitas - totalCustos;

  // ─────────────────────────────────────────────────────────
  // Filtro de busca: brinco ou raca
  // ─────────────────────────────────────────────────────────
  const filteredBovinos = bovinos.filter((b) => {
    const search = searchTerm.toLowerCase();
    return (
      b.brinco.toLowerCase().includes(search) ||
      b.raca.toLowerCase().includes(search)
    );
  });

  return (
    <>
   
 if (!authenticated) {
    return <SimpleLogin onLogin={() => setAuthenticated(true)} />;
}
 
 } alt="Fazenda Paraíso" className="fazenda-logo" />
          <Navbar.Brand className="fazenda-name">Fazenda Paraíso</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="p-4 bg-light rounded shadow-lg">
        <div className="text-center mb-4">
          <h2 className="text-success fw-bold mt-3">Gestão Avançada</h2>
        </div>

        {/* Resumo Financeiro */}
        <Card className="my-3 p-3 shadow-sm border-0 text-center">
          <h5>
            <DollarSign size={20} /> Custos:{" "}
            <span className="text-danger fw-bold">R$ {totalCustos.toFixed(2)}</span>{" "}
            | Receitas:{" "}
            <span className="text-success fw-bold">R$ {totalReceitas.toFixed(2)}</span>{" "}
            | Lucro:{" "}
            <span className={lucroLiquido >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
              R$ {lucroLiquido.toFixed(2)}
            </span>
          </h5>
        </Card>

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        {/* Barra de Progresso do Wizard */}
        <div className="mb-3">
          <h6>Etapa {currentStepIndex + 1} de {progressSteps}</h6>
          <ProgressBar now={currentProgress} label={`${currentProgress}%`} />
        </div>

        {/* STEP 1 - Dados Básicos */}
        {currentStepIndex === 0 && (
          <Card className="mb-4 shadow-sm">
            <Card.Header>
              <PlusCircle size={20} /> Dados Básicos
            </Card.Header>
            <Card.Body>
              <Form>
                <div className="row g-3">
                  <div className="col-md-4">
                    <Form.Label>Brinco (ID)*</Form.Label>
                    <Form.Control
                      value={basicData.brinco}
                      onChange={(e) => setBasicData({ ...basicData, brinco: e.target.value })}
                      placeholder="Ex: 015"
                    />
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Raça*</Form.Label>
                    <Form.Control
                      value={basicData.raca}
                      onChange={(e) => setBasicData({ ...basicData, raca: e.target.value })}
                      placeholder="Ex: Nelore"
                    />
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Sexo</Form.Label>
                    <br />
                    <ToggleButtonGroup
                      type="radio"
                      name="sexo"
                      value={basicData.sexo}
                      onChange={(val) => setBasicData({ ...basicData, sexo: val })}
                    >
                      <ToggleButton id="macho" value="M" variant="outline-success">
                        Macho
                      </ToggleButton>
                      <ToggleButton id="femea" value="F" variant="outline-danger">
                        Fêmea
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Data de Entrada</Form.Label>
                    <Form.Control
                      value={basicData.dataEntrada}
                      onChange={(e) => setBasicData({ ...basicData, dataEntrada: e.target.value })}
                      placeholder="dd/mm/aaaa"
                    />
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Peso Inicial (kg)*</Form.Label>
                    <Form.Control
                      value={basicData.pesoInicial}
                      onChange={(e) => setBasicData({ ...basicData, pesoInicial: e.target.value })}
                      placeholder="Ex: 220"
                    />
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Local de Manejo</Form.Label>
                    <Form.Control
                      value={basicData.localManejo}
                      onChange={(e) => setBasicData({ ...basicData, localManejo: e.target.value })}
                      placeholder="Ex: Confinamento"
                    />
                  </div>
                  <div className="col-md-12">
                    <Form.Label>Observações</Form.Label>
                    <Form.Control
                      value={basicData.observacoes}
                      onChange={(e) => setBasicData({ ...basicData, observacoes: e.target.value })}
                      placeholder="Ex: cuidados especiais..."
                    />
                  </div>
                </div>
                <div className="text-end mt-3">
                  <Button variant="success" onClick={handleNextStep}>
                    Próximo
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}

        {/* STEP 2 - Vacinas */}
        {currentStepIndex === 1 && (
          <Card className="mb-4 shadow-sm">
            <Card.Header>Vacinas</Card.Header>
            <Card.Body>
              <Form>
                <div className="row g-3">
                  <div className="col-md-4">
                    <Form.Label>Última Vacina</Form.Label>
                    <Form.Control
                      value={vacinaData.ultimaVacina}
                      onChange={(e) => setVacinaData({ ...vacinaData, ultimaVacina: e.target.value })}
                      placeholder="Ex: Febre Aftosa"
                    />
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Próxima Vacina</Form.Label>
                    <Form.Control
                      value={vacinaData.proximaVacina}
                      onChange={(e) => setVacinaData({ ...vacinaData, proximaVacina: e.target.value })}
                      placeholder="Ex: 01/05/2024"
                    />
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Tipo de Vacina</Form.Label>
                    <Form.Control
                      value={vacinaData.tipoVacina}
                      onChange={(e) => setVacinaData({ ...vacinaData, tipoVacina: e.target.value })}
                      placeholder="Ex: Múltipla"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <Button variant="secondary" onClick={handlePrevStep}>
                    Voltar
                  </Button>
                  <Button variant="success" onClick={handleNextStep}>
                    Próximo
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}

        {/* STEP 3 - Financeiro */}
        {currentStepIndex === 2 && (
          <Card className="mb-4 shadow-sm">
            <Card.Header>Financeiro</Card.Header>
            <Card.Body>
              <Form>
                <div className="row g-3">
                  <div className="col-md-4">
                    <Form.Label>Custo Alimentação (R$)</Form.Label>
                    <Form.Control
                      value={financeData.custoAlimentacao}
                      onChange={(e) => setFinanceData({ ...financeData, custoAlimentacao: e.target.value })}
                      placeholder="Ex: 400"
                    />
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Custo Medicamento (R$)</Form.Label>
                    <Form.Control
                      value={financeData.custoMedicacao}
                      onChange={(e) => setFinanceData({ ...financeData, custoMedicacao: e.target.value })}
                      placeholder="Ex: 120"
                    />
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Receita de Venda (R$)</Form.Label>
                    <Form.Control
                      value={financeData.receitaVenda}
                      onChange={(e) => setFinanceData({ ...financeData, receitaVenda: e.target.value })}
                      placeholder="Ex: 3800"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <Button variant="secondary" onClick={handlePrevStep}>
                    Voltar
                  </Button>
                  <Button variant="success" onClick={handleFinish}>
                    <CheckCircle size={16} className="me-2" />
                    Finalizar e Salvar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}

        {/* LISTA DE BOVINOS */}
        <Card className="my-4 shadow-sm">
          <Card.Body>
            <h4>Lista de Bovinos</h4>

            {/* Campo de busca */}
            <div className="mb-3">
              <Form.Label>Buscar Boi (Brinco ou Raça)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite algo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Table striped bordered hover className="mt-3">
              <thead className="table-success">
                <tr>
                  <th>Brinco</th>
                  <th>Raça</th>
                  <th>Sexo</th>
                  <th>Data Entrada</th>
                  <th>Peso Inicial (kg)</th>
                  <th>Última Vacina</th>
                  <th>Próxima Vacina</th>
                  <th>Custo (Alim.+Med.)</th>
                  <th>Receita</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {/** Filtramos por brinco ou raca */}
                {bovinos
                  .filter((b) => {
                    const search = searchTerm.toLowerCase();
                    return (
                      b.brinco.toLowerCase().includes(search) ||
                      b.raca.toLowerCase().includes(search)
                    );
                  })
                  .map((b, idx) => {
                    const totalCusto =
                      (b.custoAlimentacao || 0) + (b.custoMedicacao || 0);
                    return (
                      <tr key={idx}>
                        <td>{b.brinco}</td>
                        <td>{b.raca}</td>
                        <td>{b.sexo === "M" ? "Macho" : "Fêmea"}</td>
                        <td>{b.dataEntrada}</td>
                        <td>{b.pesoInicial}</td>
                        <td>{b.ultimaVacina || "-"}</td>
                        <td>{b.proximaVacina || "-"}</td>
                        <td>R$ {totalCusto.toFixed(2)}</td>
                        <td>R$ {(b.receitaVenda || 0).toFixed(2)}</td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(idx)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(idx)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Relatórios e Gráficos */}
        <Card className="p-4 shadow-sm border-0">
          <Card.Body>
            <h3 className="text-success mb-4">
              <BarChart2 size={28} className="me-2" /> Relatórios
            </h3>
            <Tabs defaultActiveKey="financeiro" className="mb-3">
              <Tab eventKey="financeiro" title="Financeiro (Barras)">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bovinos}>
                    <XAxis dataKey="brinco" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="custoAlimentacao" fill="#dc3545" name="Alimentação" />
                    <Bar dataKey="custoMedicacao" fill="#ffc107" name="Medicação" />
                    <Bar dataKey="receitaVenda" fill="#28a745" name="Receita" />
                  </BarChart>
                </ResponsiveContainer>
              </Tab>

              <Tab eventKey="peso" title="Peso (Linha)">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bovinos}>
                    <XAxis dataKey="brinco" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pesoInicial"
                      stroke="#007bff"
                      name="Peso Inicial (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
