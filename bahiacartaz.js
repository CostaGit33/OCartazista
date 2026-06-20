// ========================================
// GERENCIADOR DE CARTAZES ARTESANAIS
// ========================================

class GerenciadorCartazes {
  constructor() {
    this.cartazes = [];
    this.proximoId = 1;
    this.inicializar();
  }

  inicializar() {
    // Elementos do DOM
    this.containerCartazes = document.getElementById('cartazesContainer');
    this.btnAdicionar = document.getElementById('adicionarCartaz');
    this.btnLimparTodos = document.getElementById('limparTodos');
    this.inputNome = document.getElementById('nomeOferta');
    this.inputDescricao = document.getElementById('descricao');
    this.inputPreco = document.getElementById('preco');
    this.selectUnidade = document.getElementById('unidade');

    // Event listeners
    this.btnAdicionar.addEventListener('click', () => this.adicionarCartaz());
    this.btnLimparTodos.addEventListener('click', () => this.limparTodos());

    // Permitir adicionar cartaz ao pressionar Enter
    this.inputPreco.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.adicionarCartaz();
    });

    // Carregar cartazes do localStorage
    this.carregarDoLocalStorage();
  }

  adicionarCartaz() {
    const nome = this.inputNome.value.trim();
    const descricao = this.inputDescricao.value.trim();
    const preco = parseFloat(this.inputPreco.value);
    const unidade = this.selectUnidade.value;

    // Validação
    if (!nome || !descricao || isNaN(preco) || preco <= 0) {
      alert('Por favor, preencha todos os campos corretamente!');
      return;
    }

    // Criar objeto do cartaz
    const cartaz = {
      id: this.proximoId++,
      nome,
      descricao,
      preco,
      unidade
    };

    // Adicionar à lista e renderizar
    this.cartazes.push(cartaz);
    this.renderizarCartaz(cartaz);
    this.salvarNoLocalStorage();

    // Limpar formulário
    this.inputNome.value = '';
    this.inputDescricao.value = '';
    this.inputPreco.value = '';
    this.inputNome.focus();
  }

  renderizarCartaz(cartaz) {
    const { reais, centavos } = this.formatarPreco(cartaz.preco);

    const elementoCartaz = document.createElement('div');
    elementoCartaz.className = 'cartaz';
    elementoCartaz.id = `cartaz-${cartaz.id}`;
    elementoCartaz.innerHTML = `
      <div class="cartaz-titulo">${this.escaparHTML(cartaz.nome)}</div>
      <div class="cartaz-descricao">${this.escaparHTML(cartaz.descricao)}</div>
      <div class="cartaz-preco-wrapper">
        <span class="cartaz-preco-inteiro">${reais}</span>
        <div class="cartaz-preco-side">
          <span class="cartaz-preco-centavos">,${centavos}</span>
          <span class="cartaz-unidade">${cartaz.unidade}</span>
        </div>
      </div>
      <div class="cartaz-controls">
        <button class="btn-salvar" onclick="gerenciador.salvarCartazComoImagem(${cartaz.id})">Salvar</button>
        <button class="btn-remover" onclick="gerenciador.removerCartaz(${cartaz.id})">Remover</button>
      </div>
    `;

    this.containerCartazes.appendChild(elementoCartaz);
  }

  removerCartaz(id) {
    this.cartazes = this.cartazes.filter(c => c.id !== id);
    const elemento = document.getElementById(`cartaz-${id}`);
    if (elemento) {
      elemento.remove();
    }
    this.salvarNoLocalStorage();
  }

  limparTodos() {
    if (confirm('Tem certeza que deseja remover todos os cartazes?')) {
      this.cartazes = [];
      this.containerCartazes.innerHTML = '';
      this.salvarNoLocalStorage();
    }
  }

  formatarPreco(valor) {
    const partes = valor.toFixed(2).split('.');
    return {
      reais: parseInt(partes[0]).toLocaleString('pt-BR'),
      centavos: partes[1]
    };
  }

  escaparHTML(texto) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return texto.replace(/[&<>"']/g, m => map[m]);
  }

  salvarCartazComoImagem(id) {
    const elemento = document.getElementById(`cartaz-${id}`);
    if (!elemento) return;

    // Verificar se html2canvas está disponível
    if (typeof html2canvas === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      document.head.appendChild(script);
      script.onload = () => this.capturarImagem(elemento, id);
      return;
    }

    this.capturarImagem(elemento, id);
  }

  capturarImagem(elemento, id) {
    html2canvas(elemento, {
      backgroundColor: '#ffeb3b',
      scale: 2,
      logging: false
    }).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `cartaz-${id}.png`;
      link.click();
    }).catch(err => {
      console.error('Erro ao capturar imagem:', err);
      alert('Erro ao salvar a imagem. Tente novamente.');
    });
  }

  salvarNoLocalStorage() {
    localStorage.setItem('cartazes', JSON.stringify(this.cartazes));
  }

  carregarDoLocalStorage() {
    const dados = localStorage.getItem('cartazes');
    if (dados) {
      try {
        this.cartazes = JSON.parse(dados);
        if (this.cartazes.length > 0) {
          this.proximoId = Math.max(...this.cartazes.map(c => c.id)) + 1;
          this.cartazes.forEach(cartaz => this.renderizarCartaz(cartaz));
        }
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      }
    }
  }
}

// Inicializar gerenciador quando o DOM estiver pronto
let gerenciador;
document.addEventListener('DOMContentLoaded', () => {
  gerenciador = new GerenciadorCartazes();
});
