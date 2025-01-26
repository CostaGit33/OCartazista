// Função para salvar o cartaz como imagem
const salvarCartaz = () => {
    const cartaz = document.getElementById("cartaz");
    html2canvas(cartaz).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, "cartaz.png");
      });
    });
};

// Função para atualizar o conteúdo do cartaz ao digitar nos campos de input
const atualizarTextoCartaz = (elemento, valor, textoPadrao) => {
    document.getElementById(elemento).textContent = valor || textoPadrao;
};

// Atualiza o título com base no campo de input de nome da oferta
document.getElementById("nomeOferta").addEventListener("input", (e) => {
    atualizarTextoCartaz("cartazTitulo", e.target.value, "Nome da Oferta");
});

// Atualiza a descrição com base no campo de input de descrição
document.getElementById("descricao").addEventListener("input", (e) => {
    atualizarTextoCartaz("cartazDescricao", e.target.value, "Descrição do produto ou serviço.");
});

// Função para formatar o preço separando reais e centavos
const formatarPreco = (valor) => {
    if (valor) {
        const [reais, centavos] = valor.split('.');
        return {
            reais: parseInt(reais),
            centavos: centavos ? centavos.padStart(2, '0') : '00'
        };
    }
    return { reais: 0, centavos: '00' };
};

// Atualiza o preço com a separação dos valores inteiros e centavos
document.getElementById("preco").addEventListener("input", (e) => {
    const { reais, centavos } = formatarPreco(e.target.value);
    document.getElementById("valorInteiro").textContent = reais.toLocaleString('pt-BR');
    document.getElementById("valorCentavos").textContent = `,${centavos}`;
});

