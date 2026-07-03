---
trigger: always_on
---

# Comunicação em Português Brasileiro

Todas as mensagens, explicações e respostas devem ser em Português do Brasil. Termos técnicos e código permanecem em inglês.

# AUTONOMIA TOTAL NO TERMINAL

**Este framework é para leigos. O usuário NÃO sabe usar terminal.**

VOCÊ DEVE executar TODOS os comandos sozinho. NUNCA peça para o usuário:
- "Rode este comando no terminal"
- "Execute X manualmente"
- "Abra o terminal e faça Y"

**Comandos interativos (netlify init, gh auth, etc.):**
1. Execute o comando
2. Envie os inputs necessários para cada prompt (1, Enter, nome, etc.)
3. Continue até concluir

**A única exceção:** Quando o navegador abrir para OAuth (autorização GitHub/Netlify), informe ao usuário que ele precisa clicar em "Autorizar" no navegador que abriu automaticamente.

**Se algo falhar:** Tente resolver sozinho. Só peça ajuda ao usuário em último caso, e mesmo assim, nunca peça para ele executar comandos.

# Servidor Local

Use a skill `local-server` para gerenciar o servidor de desenvolvimento. A skill cuida de:
- Verificar se já existe um servidor rodando
- Encontrar uma porta disponível se necessário
- Fornecer a URL correta

NUNCA rode múltiplas instâncias do servidor para a mesma pasta.

# Imagens via Netlify CDN

Formato: `/.netlify/images?url=/images/foto.jpg&w=800&q=80`. NUNCA use caminhos diretos para imagens.

# Hero sem animação de ENTRADA

NUNCA adicione animações de entrada (AOS, fade, opacity:0) no hero. O hero deve aparecer instantaneamente. Animações pós-carregamento são permitidas e encorajadas.

# Formulário

Use o formulário existente no index.html como base. Ele já tem intl-tel-input e Netlify Forms configurados.

# AOS em elementos de scroll

Use `data-aos="fade-up"` em elementos que aparecem no scroll. NUNCA no hero.
Ao inicializar AOS, SEMPRE use `disableMutationObserver: true` para evitar CLS.

# Performance Preventiva (aplicar durante desenvolvimento)

**Imagens:** Sempre com width/height numéricos e CDN. Hero com `loading="eager"`, resto com `loading="lazy"`.

**Scripts pesados (Three.js, GSAP, partículas):** NUNCA import estático. SEMPRE Dynamic Import + IntersectionObserver para carregar quando a seção ficar visível. NUNCA linkar no HTML.

**Fontes:** Manter síncronas com `preconnect` + `display=swap`. NUNCA usar `media="print" onload` (atrasa download e anula preconnect). Max 3 weights.

**Hero:** NUNCA opacity:0, transform, ou data-aos inicial. Container com min-height fixo.

**CSS principal:** Durante desenvolvimento, manter síncrono (bloqueante). No `/otimizar`, pode ser convertido para critical CSS inline + async (ver skill optimize secao 12). NUNCA usar `media="print" onload` SEM critical CSS inline (causa CLS massivo).

# Caminhos absolutos

Comece caminhos de arquivos com `/`. NUNCA use caminhos relativos como `./` ou `../`.

# NUNCA instalar pacotes

Este template não tem build step. NUNCA rode npm, node, ou comandos de build.

# NUNCA usar emojis

Não use emojis em nenhum lugar. A não ser se for solicitado explicitamente pelo usuário

# Socratic Gate (Perguntar Antes de Implementar)

Para tarefas complexas ou ambíguas, PERGUNTE antes de implementar:

- Requisito vago → Pergunte: "O que exatamente você quer?"
- Múltiplas abordagens possíveis → Pergunte: "Prefere A ou B?"
- Impacto em outras partes → Pergunte: "Isso vai afetar X, posso prosseguir?"
- Decisão de design → Pergunte: "Qual estilo prefere?"

**Regra:** Se houver 1% de dúvida, PERGUNTE. Não assuma.

**Exceção:** Correções óbvias de bugs ou erros de sintaxe podem ser feitas diretamente.

# NUNCA proceder automaticamente

Cada workflow tem um escopo definido. Ao finalizar um workflow:
- PARE COMPLETAMENTE
- Aguarde instrução explícita do usuário
- NUNCA inicie o próximo workflow automaticamente
- NUNCA comece a implementar código sem instrução explícita
- Mesmo se o usuário disser "ok" ou "aprovado", apenas confirme e aguarde comando para próxima ação

# Estrutura de Pastas e Versoes

Cada pagina do site fica em sua propria pasta. A versao ATIVA sempre fica na raiz da pasta da pagina.

```
projeto/
├── pagina-vendas/
│   ├── index.html          ← versao ATIVA
│   ├── style.css
│   ├── copy.md
│   ├── layout.md
│   ├── _backup_v1/         ← versao anterior
│   └── _backup_v2/         ← outra versao anterior
├── pagina-obrigado/
│   ├── index.html
│   └── style.css
└── .agent/
```

**Regras:**
1. `/gerar-copy` cria a pasta da pagina com o nome fornecido
2. Versao ativa = SEMPRE na raiz da pasta da pagina
3. Ao pedir nova versao → mover arquivos atuais para `_backup_vN/` e criar nova versao na raiz
4. Pastas com prefixo `_backup_` sao versoes antigas (ignorar em operacoes normais)
5. Numeracao sequencial: `_backup_v1/`, `_backup_v2/`, etc.