---
name: prospeccao
description: >-
  Acha clientes em dois modos. B2B: monta uma lista de empresas do perfil
  ideal (nome, site, cidade, @, contato comercial público), dá uma nota de
  encaixe e escreve a primeira mensagem e os follow-ups. B2C (clientes
  finais): acha onde o seu público está e quem está pedindo o que você vende
  agora (posts e comunidades públicas), e escreve a resposta para o usuário
  mandar da própria conta, sem guardar dado pessoal. Use quando pedirem
  "achar clientes", "leads", "prospecção", "lista de empresas", "quem compraria
  isso", "onde está o meu público", "outbound".
---

# Prospecção (B2B e clientes finais)

Faz parte da `central-marketing`: siga as regras dela. Leia antes
`.agents/product-marketing.md` (o que vende, para quem, preço) e
`.claude/instagram/niche.md` (ramo, país, termos). Nunca envie nada: a skill
acha e escreve; quem manda é o usuário.

## Primeiro: qual modo?
- **B2B:** o cliente é uma empresa, loja, clínica, escola, profissional
  com CNPJ ou perfil comercial.
- **B2C:** o cliente é uma pessoa (quem compra presente, faz aula, encomenda
  bolo). Se o produto tem os dois, faça os dois, separados.

## Regras de dados (LGPD e regras das plataformas)
1. **Só dados públicos e de fontes permitidas:** sites das empresas, buscas
   na web, mapas oficiais, diretórios públicos. Nada de raspar Instagram,
   LinkedIn ou WhatsApp, nada de login pelo usuário, nada de lista comprada.
2. **B2B:** guarde só contatos **comerciais** (e-mail do site, telefone
   comercial, @ da empresa, nome do responsável quando estiver no site da
   própria empresa). Diga a fonte de cada linha.
3. **B2C:** **não monte lista de pessoas.** Guarde só o link do post ou da
   comunidade e o motivo; o usuário responde na hora pela conta dele. Nada de
   nome, telefone ou e-mail de pessoa física.
4. **Onde fica:** a lista vai para `prospeccao/` no projeto, que precisa
   estar no `.gitignore` (crie a regra se não existir). Nunca faça commit.
   Apague linhas que não viraram conversa em 90 dias.
5. **Mensagens:** uma por vez, escrita para aquela empresa ou post, sem
   disparo em massa. E-mail frio B2B sempre com o nome de quem manda, o
   motivo do contato e uma frase clara para sair ("se não fizer sentido, me
   avise que eu não mando mais").

## Modo B2B
1. **Perfil ideal (ICP).** Com o usuário, em 5 linhas: tipo de empresa,
   tamanho, cidade/região, sinal de que precisa (ex.: "abriu há menos de 1
   ano", "não tem site", "posta todo dia no Instagram"), quem decide.
2. **Buscar.** Use a busca na web com 5 a 10 consultas variadas (tipo +
   cidade + sinal), diretórios do ramo e, se o usuário tiver a chave
   `GOOGLE_MAPS_API_KEY`, a API oficial do Google Places (Text Search) para
   negócios locais. Abra o site de cada empresa para conferir.
3. **Lista** em `prospeccao/b2b-AAAA-MM-DD.csv`, colunas:
   `empresa,site,cidade,instagram,contato_publico,fonte,sinal,nota,mensagem`.
   20 a 40 empresas por rodada é o bastante.
4. **Nota de encaixe (0 a 10):** perfil ideal (0-4), sinal de necessidade
   (0-3), facilidade de contato (0-3). Ordene da maior para a menor.
5. **Mensagem** para as 10 de nota mais alta: 3 a 5 linhas, cita algo
   específico da empresa (um post, um serviço, a abertura recente), uma
   proposta concreta e uma pergunta fácil de responder. Escreva com
   `copywriting`; para DM, use `ig-dm`.
6. **Follow-up:** 2 mensagens, depois de 3 e de 7 dias, curtas e diferentes
   da primeira. Depois disso, pare.
7. **Entrega:** a tabela das 10 melhores (empresa, por que encaixa, link,
   mensagem pronta para copiar) e o caminho do CSV.

## Modo B2C (clientes finais)
O objetivo não é uma lista de pessoas, é um mapa de onde e quando o público
pede o que você vende.

1. **Quem compra e quando.** Com o usuário: quem é o cliente, em que momento
   ele procura (datas, problemas, eventos) e as palavras que ele usa.
2. **Onde ele está.** Use a busca na web e, se houver, o vidIQ ou o Apify
   para achar:
   - **pedidos públicos de indicação** ("alguém indica…", "onde comprar…",
     "preciso de…") em Reddit, fóruns, grupos abertos, comentários de posts
     do ramo, perguntas no X e no TikTok;
   - **comunidades e perfis** onde esse público conversa (hashtags, páginas
     de bairro, grupos de interesse, criadores do ramo);
   - **posts virais do ramo** cujos comentários estão cheios de gente
     pedindo o produto.
3. **Mapa** em `prospeccao/b2c-AAAA-MM-DD.md`: para cada achado, o link, a
   data, o que a pessoa ou o grupo pede e por que vale responder. Sem nome,
   telefone ou e-mail de ninguém.
4. **Respostas:** para cada pedido recente (até 7 dias), uma resposta útil
   que ajude de verdade antes de citar a marca, escrita com `ig-comment` ou
   `ig-reply`, sem link na primeira frase. O usuário responde da conta dele.
5. **Atrair, além de abordar:** com base no mapa, sugira 3 conteúdos que
   respondem as perguntas mais repetidas (para `ig-reel`, `pinterest` ou o
   blog), e 3 parcerias com perfis do ramo (para `ig-dm`).
6. **Entrega:** os 10 achados mais quentes com link e resposta pronta, e as
   sugestões de conteúdo e parceria.

## Quando há ferramentas a mais
- `people-search` (Lessie, instalado à parte): para B2B, achar o responsável
  de uma empresa e o contato comercial. Só contatos de trabalho.
- `lessie-email` (instalado à parte): enviar os e-mails que o usuário
  aprovou, um a um, respeitando o limite diário da conta dele.
- Se não estiverem instaladas, entregue as mensagens para o usuário mandar
  e diga o comando de instalação (está no README).

## Nunca
- Inventar empresa, contato, número de seguidores ou faturamento.
- Mandar mensagem, seguir, curtir ou comentar pela conta do usuário.
- Prometer ao lead algo que não está em `product-marketing.md`.
