# Metodo Zero v20

Framework para criar landing pages unicas com HTML, CSS e JavaScript puros. Sem npm, node ou webpack. Infraestrutura 100% Netlify.

---

## Comandos

### Fluxo Principal

```
/gerar-copy → /gerar-design → /gerar-layout → /desenvolver → /publicar
```

| Comando | O que faz |
|---------|-----------|
| `/gerar-copy` | Cria pasta da pagina e textos persuasivos |
| `/gerar-design` | Define identidade visual, cria Hero + 1 secao de amostra |
| `/gerar-layout` | Especifica todas as secoes da pagina |
| `/desenvolver` | Constroi a pagina completa |
| `/publicar` | Deploy para producao via Netlify |

### Auxiliares

| Comando | O que faz |
|---------|-----------|
| `/visualizar-local` | Servidor local na porta 8888 |
| `/otimizar` | Auditoria e correcoes de performance |
| `/previsualizar` | Deploy Preview via Pull Request |
| `/debug` | Investiga e resolve erros |

---

## Inicio Rapido

```bash
cp -r framework-v20 meu-projeto
cd meu-projeto
```

Abra no Claude Code e use `/gerar-copy nome-da-pagina` para comecar.

---

## Estrutura do Projeto

```
meu-projeto/
├── pagina-vendas/        # Cada pagina tem sua pasta
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── copy.md           # Textos gerados
│   └── layout.md         # Especificacao visual
├── pagina-obrigado/      # Outras paginas
├── netlify.toml
└── .agent/               # Configuracoes do framework
```

---

## Versoes Alternativas

Ao pedir uma nova versao da pagina, a versao atual vai para `_backup_v1/` e a nova e criada na raiz. Versoes anteriores ficam preservadas.

---

## Requisitos

- Claude Code (CLI)
- Netlify CLI (`npm install -g netlify-cli`)
- Conta Netlify (gratis)
