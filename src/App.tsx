import React, { useState, useRef, useEffect } from 'react';

// Imports das capas de imagens
import capaCorte from './assets/corte.png';
import capaTrono from './assets/trono.png';
import capaPriorado from './assets/priorado.png';
import capaCoracao from './assets/coracao.png';
import capaNarnia from './assets/narnia.png';
import capaInstrumentos from './assets/instrumentos.png';
import capaMortal from './assets/mortal.png';
import capaPrimeira from './assets/primeira.png';
import capaAquiles from './assets/aquiles.png';

/* ─── Types ─────────────────────────────────────────────────────────────── */

type Screen = 'hero' | 'quiz' | 'diagnostic' | 'result' | 'dev-login' | 'dev-dashboard';
type Subgenre = 'epic' | 'dark' | 'urban' | 'romantasy' | 'historical' | 'portal' | 'grimdark' | 'mythological' | 'steampunk';

interface Option {
  text: string;
  icon: string;
  subgenre: Subgenre;
}

interface Question {
  id: number;
  question: string;
  subtitle: string;
  options: Option[];
}

interface SubgenreResult {
  title: string;
  subtitle: string;
  description: string;
  emblem: string;
  traits: string[];
  bookSuggestion: string;
  bookSynopsis: string;
  bookCover: string;
  authors: string;
}

interface ParticipantRecord {
  name: string;
  subgenre: string;
  date?: string;
}

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdTJhH0cNPc_3lryKA5GRjRoE4SYrUr5lN4ypBZLS6NZgX_TBJCpfaVW7PcSP3jwrq/exec';

/* ─── Data: 15 Perguntas com 4 Opções Cada ───────────────────────────────── */

const questions: Question[] = [
  {
    id: 1,
    question: 'Onde sua jornada começa?',
    subtitle: 'O ponto de partida revela muito sobre o destino',
    options: [
      { text: 'Uma taverna barulhenta às margens do reino', icon: '🍺', subgenre: 'epic' },
      { text: 'Um cemitério envolto em névoa ao cair da noite', icon: '🌙', subgenre: 'dark' },
      { text: 'O metrô de uma cidade grande, cheio de segredos', icon: '🌆', subgenre: 'urban' },
      { text: 'Um espelho antigo que te transporta para outro mundo', icon: '🪞', subgenre: 'portal' },
    ],
  },
  {
    id: 2,
    question: 'Qual é o seu maior dom?',
    subtitle: 'O talento que te define entre todos os viajantes',
    options: [
      { text: 'O amor que desafia destinos e profecias ancestrais', icon: '💫', subgenre: 'romantasy' },
      { text: 'O conhecimento de tradições e rituais milenares', icon: '📜', subgenre: 'historical' },
      { text: 'A coragem de liderar exércitos em batalhas épicas', icon: '⚔️', subgenre: 'epic' },
      { text: 'O domínio sobre forças sombrias e proibidas', icon: '🖤', subgenre: 'dark' },
    ],
  },
  {
    id: 3,
    question: 'Quem caminha ao seu lado?',
    subtitle: 'O companheiro escolhido é o espelho da sua alma',
    options: [
      { text: 'Um demônio que selou um pacto contigo no passado', icon: '😈', subgenre: 'grimdark' },
      { text: 'Um detetive sobrenatural que decifra os segredos da cidade', icon: '🔍', subgenre: 'urban' },
      { text: 'Um príncipe ou princesa de um reino rival', icon: '👑', subgenre: 'romantasy' },
      { text: 'Um inventor engenhoso com óculos de aviador e engrenagens', icon: '⚙️', subgenre: 'steampunk' },
    ],
  },
  {
    id: 4,
    question: 'O que mais te fascina em uma história?',
    subtitle: 'O fio que te prende às páginas até o amanhecer',
    options: [
      { text: 'A descoberta de um mundo completamente novo e maravilhoso', icon: '✨', subgenre: 'portal' },
      { text: 'Batalhas épicas, reinos em guerra e profecias antigas', icon: '🏰', subgenre: 'epic' },
      { text: 'A reconstrução de uma era histórica com magia entrelaçada', icon: '🕯️', subgenre: 'historical' },
      { text: 'Criaturas sobrenaturais escondidas nas sombras do mundo real', icon: '🌃', subgenre: 'urban' },
    ],
  },
  {
    id: 5,
    question: 'Como você enfrenta o perigo?',
    subtitle: 'A estratégia revela o seu verdadeiro caráter',
    options: [
      { text: 'Com feitiços proibidos e um coração despedaçado', icon: '💔', subgenre: 'dark' },
      { text: 'Com a força do amor e uma aliança improvável', icon: '🌹', subgenre: 'romantasy' },
      { text: 'Usando magia antiga aprendida de grimórios medievais', icon: '📖', subgenre: 'historical' },
      { text: 'Atravessando portais para buscar aliados em outros mundos', icon: '🌀', subgenre: 'portal' },
    ],
  },
  {
    id: 6,
    question: 'Qual artefato você escolheria?',
    subtitle: 'O objeto que carregaria em sua jornada final',
    options: [
      { text: 'Uma espada lendária forjada sob estrelas divinas', icon: '🗡️', subgenre: 'epic' },
      { text: 'Um grimório de feitiços das trevas mais profundas', icon: '📓', subgenre: 'dark' },
      { text: 'Um amuleto que revela o invisível nas ruas da cidade', icon: '🔮', subgenre: 'urban' },
      { text: 'Uma bússola a vapor que aponta para reinos esquecidos', icon: '🧭', subgenre: 'steampunk' },
    ],
  },
  {
    id: 7,
    question: 'Qual é o seu refúgio secreto?',
    subtitle: 'O lugar onde você busca paz quando o mundo desaba',
    options: [
      { text: 'O topo de uma montanha sagrada sob o olhar de deuses antigos', icon: '⚡', subgenre: 'mythological' },
      { text: 'Uma biblioteca subterrânea esquecida pelo tempo', icon: '📚', subgenre: 'historical' },
      { text: 'Uma torre sombria isolada em um pântano perpétuo', icon: '🏰', subgenre: 'grimdark' },
      { text: 'Um café aconchegante em uma esquina chuvosa', icon: '☕', subgenre: 'urban' },
    ],
  },
  {
    id: 8,
    question: 'Qual o seu tipo de conflito favorito?',
    subtitle: 'A fagulha que acende a chama da narrativa',
    options: [
      { text: 'Dilemas morais extremos onde ninguém sai totalmente ileso', icon: '⚖️', subgenre: 'grimdark' },
      { text: 'Rivalidades mortais misturadas com paixões arrebatadoras', icon: '🔥', subgenre: 'romantasy' },
      { text: 'Confrontos diretos contra divindades e monstros mitológicos', icon: '🐉', subgenre: 'mythological' },
      { text: 'Invenções tecnológicas colidindo com forças arcanas', icon: '🔧', subgenre: 'steampunk' },
    ],
  },
  {
    id: 9,
    question: 'Como a magia se manifesta ao seu redor?',
    subtitle: 'A assinatura energética da sua essência',
    options: [
      { text: 'Como um clarão de luz pura que altera o tecido da realidade', icon: '✨', subgenre: 'portal' },
      { text: 'Como fumaça densa e sussurros vindos do além-túmulo', icon: '💨', subgenre: 'dark' },
      { text: 'Como faíscas elétricas saindo de engenharias a vapor', icon: '⚡', subgenre: 'steampunk' },
      { text: 'Como um fogo interior alimentado por juramentos de sangue', icon: '❤️‍🔥', subgenre: 'romantasy' },
    ],
  },
  {
    id: 10,
    question: 'Qual é a sua relação com o destino?',
    subtitle: 'A forma como você enxerga o futuro escrito nas estrelas',
    options: [
      { text: 'O destino é uma linha reta que devemos cumprir com honra', icon: '🛡️', subgenre: 'epic' },
      { text: 'O destino é uma piada cruel de deuses caprichosos', icon: '🎭', subgenre: 'mythological' },
      { text: 'O destino pode ser reescrito através de alianças e sacrifícios', icon: '✍', subgenre: 'romantasy' },
      { text: 'O destino não existe; nós o forjamos nas trevas do presente', icon: '⚒️', subgenre: 'grimdark' },
    ],
  },
  {
    id: 11,
    question: 'Qual paisagem desperta sua curiosidade?',
    subtitle: 'O cenário que captura seus pensamentos mais profundos',
    options: [
      { text: 'Ruínas ancestrais cobertas por musgo e runas esquecidas', icon: '🏛', subgenre: 'historical' },
      { text: 'Cidades vertiginosas iluminadas a gás com dirigíveis no céu', icon: '🎈', subgenre: 'steampunk' },
      { text: 'Florestas encantadas onde árvores sussurram segredos antigos', icon: '🌲', subgenre: 'portal' },
      { text: 'Montanhas coroadas por tempestades e templos esquecidos', icon: '⛰️', subgenre: 'mythological' },
    ],
  },
  {
    id: 12,
    question: 'O que você mais teme encontrar?',
    subtitle: 'O abismo que olha de volta para você',
    options: [
      { text: 'A traição daqueles em quem você jurou confiar cegamente', icon: '🗡️️', subgenre: 'grimdark' },
      { text: 'O esquecimento eterno e a perda de todas as memórias', icon: '⏳', subgenre: 'historical' },
      { text: 'A corrupção total da alma por forças que não pode controlar', icon: '👁️', subgenre: 'dark' },
      { text: 'Ficar preso para sempre em um mundo que não é o seu', icon: '🚪', subgenre: 'portal' },
    ],
  },
  {
    id: 13,
    question: 'Qual é o seu estilo de combate preferido?',
    subtitle: 'A dança mortal que você executa no calor da crise',
    options: [
      { text: 'Estratégia militar impecável em campos de batalha abertos', icon: '🚩', subgenre: 'epic' },
      { text: 'Astúcia rápida, punhais ocultos e sombras protetoras', icon: '🗡️', subgenre: 'urban' },
      { text: 'Invocações divinas e bênçãos de panteões antigos', icon: '🔱', subgenre: 'mythological' },
      { text: 'Uso de engenhocas mecânicas e pistolas de repetição arcana', icon: '🔫', subgenre: 'steampunk' },
    ],
  },
  {
    id: 14,
    question: 'Como você prefere que termine sua jornada?',
    subtitle: 'O eco que sua lenda deixará para a posteridade',
    options: [
      { text: 'Transformado em um mito cantado por bardos por gerações', icon: '🎶', subgenre: 'epic' },
      { text: 'Encontrando o amor verdadeiro e construindo um novo reino', icon: '🏰', subgenre: 'romantasy' },
      { text: 'Sobrevivendo às cinzas de um mundo implacável, ainda de pé', icon: '🔥', subgenre: 'grimdark' },
      { text: 'Voltando para casa transformado por uma sabedoria secreta', icon: '🏡', subgenre: 'portal' },
    ],
  },
  {
    id: 15,
    question: 'Qual destas frases melhor define o seu lema de vida?',
    subtitle: 'A última palavra antes da grande decisão',
    options: [
      { text: '“O sangue dos inocentes clama por justiça nas trevas.”', icon: '🩸', subgenre: 'grimdark' },
      { text: '“Mesmo entre deuses e monstros, o amor é a única força indomável.”', icon: '💖', subgenre: 'romantasy' },
      { text: '“A engrenagem gira, o vapor sobe e o destino é construído por nossas mãos.”', icon: '⚙️', subgenre: 'steampunk' },
      { text: '“Os mitos nunca morrem; eles apenas aguardam quem ouse chamá-los.”', icon: '🌟', subgenre: 'mythological' },
    ],
  },
];

const subgenreResults: Record<Subgenre, SubgenreResult> = {
  epic: {
    title: 'Alta Fantasia Épica',
    subtitle: 'Reinos Imortais & Profecias das Eras',
    description: 'Sua alma pulsa com o ritmo das batalhas eternas. Você é feito de lendas, honra e estrelas.',
    emblem: '⚔️',
    traits: ['Grandioso', 'Épico', 'Mitológico', 'Profético'],
    bookSuggestion: 'Trono de Vidro — Sarah J. Maas',
    bookSynopsis: 'Celaena Sardothien, uma jovem assassina com uma dívida imortal.',
    bookCover: capaTrono,
    authors: 'Tolkien · Sanderson · Sarah J. Maas',
  },
  dark: {
    title: 'Fantasia Sombria',
    subtitle: 'Fronteiras entre o Crepúsculo e o Abismo',
    description: 'As trevas não te assustam — elas te fascinam. Você caminha nas bordas perigosas do mundo.',
    emblem: '🖤',
    traits: ['Sombrio', 'Visceral', 'Intenso', 'Complexo'],
    bookSuggestion: 'Coração Lascivo',
    bookSynopsis: 'Uma narrativa visceral e de escolhas morais cinzentas.',
    bookCover: capaCoracao,
    authors: 'Joe Abercrombie · V.E. Schwab',
  },
  urban: {
    title: 'Fantasia Urbana',
    subtitle: 'Ruas Encantadas de Metrópoles Secretas',
    description: 'Você enxerga o que os outros ignoram — a magia escondida nos becos e neons da cidade grande.',
    emblem: '🌃',
    traits: ['Contemporâneo', 'Misterioso', 'Dualista', 'Perspicaz'],
    bookSuggestion: 'Cidade dos Ossos (Os Instrumentos Mortais)',
    bookSynopsis: 'Clary Fray testemunha um assassinato cometido por jovens cobertos de tatuagens arcanas.',
    bookCover: capaInstrumentos,
    authors: 'Neil Gaiman · Cassandra Clare · Jim Butcher',
  },
  romantasy: {
    title: 'Romantasy',
    subtitle: 'Reinos onde o Amor é a Maior das Magias',
    description: 'Para você, nenhuma batalha épica supera a tensão inegável de dois corações destinados.',
    emblem: '🌹',
    traits: ['Apaixonado', 'Intenso', 'Mágico', 'Emotivo'],
    bookSuggestion: 'Corte de Rosas e Espinhos — Sarah J. Maas',
    bookSynopsis: 'Ao matar uma loba na floresta, Feyre é levada a uma terra mágica repleta de perigos e paixão.',
    bookCover: capaCorte,
    authors: 'Sarah J. Maas · Rebecca Yarros · Holly Black',
  },
  historical: {
    title: 'Fantasia Histórica',
    subtitle: 'Eras Perdidas onde a Magia Moldou a História',
    description: 'Você sente o cheiro de pergaminhos antigos e escuta o sussurro de civilizações esquecidas.',
    emblem: '🕯️',
    traits: ['Histórico', 'Ritualístico', 'Atmosférico', 'Erudito'],
    bookSuggestion: 'O Priorado da Laranjeira — Samantha Shannon',
    bookSynopsis: 'Um mundo dividido e ameaçado por um despertar dracônico ancestral.',
    bookCover: capaPriorado,
    authors: 'Susanna Clarke · Naomi Novik · Samantha Shannon',
  },
  portal: {
    title: 'Fantasia de Portal',
    subtitle: 'Além — nos Mundos do Outro Lado do Espelho',
    description: 'Você sempre olhou para espelhos, armários e fontes antigas com uma pergunta cheia de esperança.',
    emblem: '🌀',
    traits: ['Maravilhoso', 'Transformador', 'Descoberta', 'Reinvenção'],
    bookSuggestion: 'As Crônicas de Nárnia — C.S. Lewis',
    bookSynopsis: 'Através de um guarda-roupa empoeirado, irmãos comuns entram em um mundo mágico e congelado.',
    bookCover: capaNarnia,
    authors: 'C.S. Lewis · Lev Grossman · Seanan McGuire',
  },
  grimdark: {
    title: 'Grimdark',
    subtitle: 'Honra Sangrenta em Mundos Implacáveis',
    description: 'Para você, o mundo não é preto no branco. A sobrevivência exige escolhas duras e cicatrizes na alma.',
    emblem: '🗡️',
    traits: ['Realista', 'Sombrio', 'Desafiador', 'Cruel'],
    bookSuggestion: 'A Primeira Lei — Joe Abercrombie',
    bookSynopsis: 'Um inquisidor sádico, um bárbaro atormentado e um nobre arrogante cruzam seus caminhos.',
    bookCover: capaPrimeira,
    authors: 'Joe Abercrombie · George R.R. Martin · Mark Lawrence',
  },
  mythological: {
    title: 'Fantasia Mitológica',
    subtitle: 'Fúria dos Deuses & Panteões Ancestrais',
    description: 'Seu espírito caminha entre altares e colossos, onde heróis desafiam oráculos e divindades.',
    emblem: '⚡',
    traits: ['Divino', 'Épico', 'Lendário', 'Ancestral'],
    bookSuggestion: 'A Canção de Aquiles — Madeline Miller',
    bookSynopsis: 'A jornada mítica e trágica de dois jovens príncipes unidos pelo destino e pela guerra.',
    bookCover: capaAquiles,
    authors: 'Madeline Miller · Rick Riordan · Neil Gaiman',
  },
  steampunk: {
    title: 'Steampunk & Fantasia a Vapor',
    subtitle: 'Engrenagens, Magia Arcana e Dirigíveis',
    description: 'Você une o místico ao industrial, criando maravilhas tecnológicas impulsionadas a vapor e eletricidade.',
    emblem: '⚙️',
    traits: ['Inventivo', 'Mecânico', 'Vitoriano', 'Visionário'],
    bookSuggestion: 'As Máquinas Mortais — Philip Reeve',
    bookSynopsis: 'Cidades sobre rodas vagando por um mundo devastado em busca de recursos.',
    bookCover: capaMortal,
    authors: 'Philip Reeve · China Miéville · Jules Verne',
  },
};

function calculateResult(answers: Subgenre[]): Subgenre {
  const scores: Record<Subgenre, number> = {
    epic: 0, dark: 0, urban: 0, romantasy: 0, historical: 0, portal: 0, grimdark: 0, mythological: 0, steampunk: 0,
  };
  answers.forEach(a => scores[a]++);
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as Subgenre;
}

/* ─── Componentes Visuais ─────────────────────────────────────────────────── */

function Filigrana({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 420 56"
      style={{ width: '100%', maxWidth: '350px', margin: '0 auto', transform: flip ? 'scaleY(-1)' : undefined, display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#D4AF37" strokeWidth="0.8" fill="none">
        <line x1="0" y1="28" x2="148" y2="28" />
        <line x1="272" y1="28" x2="420" y2="28" />
        <circle cx="210" cy="28" r="22" />
        <circle cx="210" cy="28" r="15" />
        <circle cx="210" cy="28" r="5" fill="#D4AF37" />
        <polyline points="148,28 180,8 210,8 240,8 272,28" />
        <polyline points="148,28 180,48 210,48 240,48 272,28" />
        <circle cx="148" cy="28" r="4" fill="#D4AF37" />
        <circle cx="272" cy="28" r="4" fill="#D4AF37" />
      </g>
    </svg>
  );
}

type ButtonVariant = 'primary' | 'secondary';

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; color: string; shadow: string }> = {
  primary: { bg: '#560319', color: '#F5F3E7', shadow: '0 4px 20px rgba(86,3,25,0.6)' },
  secondary: { bg: '#4B5320', color: '#F5F3E7', shadow: '0 4px 20px rgba(75,83,32,0.6)' },
};

function DiamondButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  wide = false,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  wide?: boolean;
  type?: 'button' | 'submit';
}) {
  const s = VARIANT_STYLES[variant];
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: s.bg,
        color: s.color,
        fontFamily: "Georgia, serif",
        fontSize: '1rem',
        fontWeight: 600,
        letterSpacing: '0.12em',
        padding: '12px 36px',
        minWidth: wide ? '220px' : '180px',
        clipPath: 'polygon(16px 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0% 50%)',
        border: '1px solid #D4AF37',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        boxShadow: disabled ? 'none' : s.shadow,
      }}
    >
      {children}
    </button>
  );
}

function CornerBrackets() {
  const b = '1.5px solid #D4AF37';
  const s = '15px';
  return (
    <>
      <span style={{ position: 'absolute', top: 10, left: 10, width: s, height: s, borderTop: b, borderLeft: b }} />
      <span style={{ position: 'absolute', top: 10, right: 10, width: s, height: s, borderTop: b, borderRight: b }} />
      <span style={{ position: 'absolute', bottom: 10, left: 10, width: s, height: s, borderBottom: b, borderLeft: b }} />
      <span style={{ position: 'absolute', bottom: 10, right: 10, width: s, height: s, borderBottom: b, borderRight: b }} />
    </>
  );
}

function GoldDivider({ glyph = '✦' }: { glyph?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1rem 0' }}>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
      <span style={{ color: '#D4AF37', fontSize: '0.9rem' }}>{glyph}</span>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
    </div>
  );
}

function ParchmentCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(145deg, #231218 0%, #1a1a1a 50%, #152212 100%)',
        border: '1.5px solid rgba(212,175,55,0.7)',
        boxShadow: '0 16px 50px rgba(0,0,0,0.6), inset 0 0 40px rgba(86,3,25,0.3)',
        padding: '2.5rem 2rem',
        color: '#F5F3E7',
        ...style,
      }}
    >
      <CornerBrackets />
      {children}
    </div>
  );
}

function HeroSection({ onStart, onDevAccess }: { onStart: () => void; onDevAccess: () => void }) {
  return (
    <main style={{ background: 'radial-gradient(circle at center, #2c0b16 0%, #0c090a 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <ParchmentCard style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <Filigrana />
        <h2 style={{ fontFamily: "Georgia, serif", color: '#D4AF37', fontSize: '2.4rem', margin: '1.2rem 0', textShadow: '0 2px 10px rgba(212,175,55,0.4)' }}>
          Qual é o seu Subgênero de Fantasia?
        </h2>
        <GoldDivider />
        <p style={{ fontFamily: "Georgia, serif", fontStyle: 'italic', color: '#E6C7C2', fontSize: '1.15rem', margin: '1.5rem 0', lineHeight: 1.6 }}>
          Responda às 15 perguntas sob o véu do mistério e descubra a qual mundo literário a sua alma pertence.
        </p>
        <Filigrana flip />
        <div style={{ marginTop: '1.8rem', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <DiamondButton onClick={onStart} variant="primary" wide>Iniciar Jornada</DiamondButton>
        </div>
      </ParchmentCard>
      
      <button 
        onClick={onDevAccess}
        style={{ background: 'transparent', border: 'none', color: '#D4AF37', marginTop: '1.5rem', fontFamily: 'Georgia, serif', fontSize: '0.85rem', cursor: 'pointer', opacity: 0.7, textDecoration: 'underline' }}
      >
        Acesso de Programadora (Gêneros & Planilha)
      </button>
    </main>
  );
}

function DevLoginSection({ onLoginSuccess, onBack }: { onLoginSuccess: () => void; onBack: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'lepique2026') {
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <main style={{ background: 'radial-gradient(circle at center, #2c0b16 0%, #0c090a 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <ParchmentCard style={{ maxWidth: '450px', width: '100%', textAlign: 'center' }}>
        <Filigrana />
        <h2 style={{ fontFamily: "Georgia, serif", color: '#D4AF37', fontSize: '1.8rem', margin: '1.2rem 0' }}>
          Painel da Programadora
        </h2>
        <GoldDivider glyph="🔒" />
        <p style={{ fontStyle: 'italic', color: '#E6C7C2', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Digite a senha secreta para consultar os dados salvos na sua Planilha Google.
        </p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', color: '#D4AF37', fontSize: '0.85rem', marginBottom: '5px', fontFamily: 'Georgia, serif' }}>Senha de Acesso:</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => { setPassword(e.target.value); setError(false); }} 
              required
              placeholder="Digite a senha..."
              style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid #D4AF37', color: '#F5F3E7', borderRadius: '4px', fontFamily: 'Georgia, serif' }}
            />
            {error && <span style={{ color: '#ff6b6b', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>Senha incorreta. Tente novamente.</span>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '10px' }}>
            <DiamondButton type="submit" variant="primary">Entrar</DiamondButton>
          </div>
        </form>
        <div style={{ marginTop: '1rem' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#E6C7C2', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Georgia, serif', textDecoration: 'underline' }}>
            Voltar ao Início
          </button>
        </div>
      </ParchmentCard>
    </main>
  );
}

function DevDashboardSection({ onBack, onSelectSubgenre }: { onBack: () => void; onSelectSubgenre: (sub: Subgenre) => void }) {
  const [participants, setParticipants] = useState<ParticipantRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch(GOOGLE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setParticipants(data);
        } else {
          setErrorMsg('Formato de dados inesperado da planilha.');
        }
      })
      .catch(err => {
        console.error("Erro ao carregar dados do Google Sheets:", err);
        setErrorMsg('Não foi possível conectar à planilha. Verifique a URL do Script.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const subgenreKeys = Object.keys(subgenreResults) as Subgenre[];

  return (
    <main style={{ background: 'radial-gradient(circle at center, #2c0b16 0%, #0c090a 100%)', minHeight: '100vh', padding: '3rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '850px', width: '100%' }}>
        <ParchmentCard>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Filigrana />
            <h2 style={{ fontFamily: "Georgia, serif", color: '#D4AF37', fontSize: '2rem', margin: '1rem 0' }}>
              Painel Dev: Dados & Subgêneros
            </h2>
            <p style={{ fontStyle: 'italic', color: '#E6C7C2', fontSize: '0.9rem' }}>
              Visualize os registros da planilha e teste os resultados de cada subgênero clicando neles abaixo.
            </p>
            <GoldDivider glyph="📊" />
          </div>

          {/* Tabela de Participantes */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#D4AF37', fontFamily: 'Georgia, serif', fontSize: '1.1rem', marginBottom: '8px' }}>Participantes Registrados na Planilha:</h3>
            <div style={{ maxHeight: '25vh', overflowY: 'auto', border: '1px solid rgba(212,175,55,0.3)', padding: '10px', background: 'rgba(0,0,0,0.3)' }}>
              {loading ? (
                <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#E6C7C2', padding: '1rem' }}>
                  Carregando registros da planilha...
                </p>
              ) : errorMsg ? (
                <p style={{ textAlign: 'center', color: '#ffb3b3', padding: '1rem' }}>
                  {errorMsg}
                </p>
              ) : participants.length === 0 ? (
                <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#E6C7C2', padding: '1rem' }}>
                  Nenhum registro encontrado na planilha.
                </p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Georgia, serif', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #D4AF37', color: '#D4AF37' }}>
                      <th style={{ padding: '6px' }}>Nome</th>
                      <th style={{ padding: '6px' }}>Subgênero Registrado</th>
                      <th style={{ padding: '6px' }}>Data / Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(212,175,55,0.1)', color: '#F5F3E7' }}>
                        <td style={{ padding: '6px', fontWeight: 'bold' }}>{p.name}</td>
                        <td style={{ padding: '6px', color: '#E6C7C2' }}>{p.subgenre}</td>
                        <td style={{ padding: '6px', fontSize: '0.75rem', opacity: 0.8 }}>{p.date || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Lista de Subgêneros para Teste Rápido */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#D4AF37', fontFamily: 'Georgia, serif', fontSize: '1.1rem', marginBottom: '8px' }}>Testar Telas de Resultado por Subgênero:</h3>
            <p style={{ fontStyle: 'italic', color: '#E6C7C2', fontSize: '0.85rem', marginBottom: '12px' }}>
              Clique em qualquer subgênero para abrir exatamente como ele aparece no fim do quiz:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {subgenreKeys.map(key => {
                const item = subgenreResults[key];
                return (
                  <button
                    key={key}
                    onClick={() => onSelectSubgenre(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(212,175,55,0.5)',
                      color: '#F5F3E7',
                      cursor: 'pointer',
                      fontFamily: 'Georgia, serif',
                      fontSize: '0.9rem',
                      textAlign: 'left',
                      borderRadius: '4px',
                      transition: 'background 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{item.emblem}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <DiamondButton onClick={onBack} variant="secondary">Voltar ao Início</DiamondButton>
          </div>
        </ParchmentCard>
      </div>
    </main>
  );
}

function QuizSection({ onComplete }: { onComplete: (result: Subgenre, name: string) => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Subgenre[]>([]);
  const [name, setName] = useState('');
  const [stepName, setStepName] = useState(true);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  const q = questions[currentIdx];

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setStepName(false);
  };

  const handleSelectOption = (subgenre: Subgenre, optIdx: number) => {
    setSelectedOpt(optIdx);
    setTimeout(() => {
      const nextAnswers = [...answers, subgenre];
      setAnswers(nextAnswers);
      setSelectedOpt(null);
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(currentIdx + 1);
      } else {
        const finalSubgenre = calculateResult(nextAnswers);
        onComplete(finalSubgenre, name);
      }
    }, 350);
  };

  if (stepName) {
    return (
      <main style={{ background: 'radial-gradient(circle at center, #2c0b16 0%, #0c090a 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <ParchmentCard style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <Filigrana />
          <h2 style={{ fontFamily: "Georgia, serif", color: '#D4AF37', fontSize: '1.8rem', margin: '1.2rem 0' }}>
            Como os bardos devem te chamar?
          </h2>
          <GoldDivider glyph="✒️" />
          <p style={{ fontStyle: 'italic', color: '#E6C7C2', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Insira seu nome para registrar sua jornada nos anais do reino.
          </p>
          <form onSubmit={handleNameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome ou alcunha..."
              required
              style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.4)', border: '1px solid #D4AF37', color: '#F5F3E7', borderRadius: '4px', fontFamily: 'Georgia, serif', fontSize: '1rem', textAlign: 'center' }}
            />
            <div style={{ marginTop: '1rem' }}>
              <DiamondButton type="submit" variant="primary">Prosseguir à Senda</DiamondButton>
            </div>
          </form>
        </ParchmentCard>
      </main>
    );
  }

  return (
    <main style={{ background: 'radial-gradient(circle at center, #2c0b16 0%, #0c090a 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '650px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D4AF37', fontFamily: 'Georgia, serif', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
          <span>Viajante: <strong>{name}</strong></span>
          <span>Questão {currentIdx + 1} de {questions.length}</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(212,175,55,0.2)', marginBottom: '1.5rem', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, height: '100%', background: '#D4AF37', transition: 'width 0.3s ease' }} />
        </div>

        <ParchmentCard>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.8rem' }}>{q.options[0]?.icon || '✨'}</span>
            <h2 style={{ fontFamily: "Georgia, serif", color: '#D4AF37', fontSize: '1.5rem', margin: '0.8rem 0 0.4rem 0' }}>
              {q.question}
            </h2>
            <p style={{ fontStyle: 'italic', color: '#E6C7C2', fontSize: '0.9rem' }}>{q.subtitle}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {q.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.subgenre, idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '14px 18px',
                    background: isSelected ? 'rgba(86,3,25,0.8)' : 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(212,175,55,0.5)',
                    color: '#F5F3E7',
                    textAlign: 'left',
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderRadius: '4px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{opt.icon}</span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        </ParchmentCard>
      </div>
    </main>
  );
}

function DiagnosticSection({ participantName, subgenre, onNext }: { participantName: string; subgenre: Subgenre; onNext: () => void }) {
  const info = subgenreResults[subgenre];

  return (
    <main style={{ background: 'radial-gradient(circle at center, #2c0b16 0%, #0c090a 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <ParchmentCard style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <Filigrana />
        <h2 style={{ fontFamily: "Georgia, serif", color: '#D4AF37', fontSize: '2rem', margin: '1.2rem 0' }}>
          O Oráculo Revelou seu Destino, {participantName}
        </h2>
        <GoldDivider glyph={info.emblem} />
        <div style={{ margin: '1.5rem 0' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>{info.emblem}</span>
          <h3 style={{ fontFamily: 'Georgia, serif', color: '#D4AF37', fontSize: '1.6rem' }}>{info.title}</h3>
          <p style={{ fontStyle: 'italic', color: '#E6C7C2', fontSize: '1rem', marginTop: '0.3rem' }}>{info.subtitle}</p>
        </div>
        <p style={{ fontFamily: 'Georgia, serif', color: '#F5F3E7', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          {info.description}
        </p>
        <DiamondButton onClick={onNext} variant="primary">Ver Detalhes do Reino & Livro Guia</DiamondButton>
      </ParchmentCard>
    </main>
  );
}

function ResultSection({ participantName, subgenre, onRestart, isDevPreview = false }: { participantName: string; subgenre: Subgenre; onRestart: () => void; isDevPreview?: boolean }) {
  const info = subgenreResults[subgenre];
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isDevPreview);

  useEffect(() => {
    if (!saved && !saving && !isDevPreview) {
      setSaving(true);
      const params = new URLSearchParams({ name: participantName, subgenre: info.title });
      fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`)
        .then(() => setSaved(true))
        .catch(err => console.error("Erro ao salvar na planilha:", err))
        .finally(() => setSaving(false));
    }
  }, [participantName, info.title, saved, saving, isDevPreview]);

  return (
    <main style={{ background: 'radial-gradient(circle at center, #2c0b16 0%, #0c090a 100%)', minHeight: '100vh', padding: '3rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '750px', width: '100%' }}>
        <ParchmentCard>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Filigrana />
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#D4AF37', fontSize: '2.2rem', margin: '1rem 0' }}>
              {info.title} {isDevPreview && '(Modo de Visualização Dev)'}
            </h2>
            <p style={{ fontStyle: 'italic', color: '#E6C7C2', fontSize: '1.1rem' }}>{info.subtitle}</p>
            <GoldDivider glyph={info.emblem} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <img
                src={info.bookCover}
                alt={info.bookSuggestion}
                style={{ width: '100%', maxWidth: '200px', border: '2px solid #D4AF37', boxShadow: '0 8px 25px rgba(0,0,0,0.6)', borderRadius: '4px' }}
              />
            </div>
            <div>
              <h4 style={{ color: '#D4AF37', fontFamily: 'Georgia, serif', fontSize: '1.1rem', marginBottom: '0.4rem' }}>Livro Recomendado:</h4>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontWeight: 'bold', marginBottom: '0.6rem' }}>{info.bookSuggestion}</p>
              <p style={{ fontStyle: 'italic', color: '#E6C7C2', fontSize: '0.9rem', marginBottom: '1.0rem', lineHeight: 1.5 }}>"{info.bookSynopsis}"</p>
              <h5 style={{ color: '#D4AF37', fontFamily: 'Georgia, serif', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Grandes Autores:</h5>
              <p style={{ fontSize: '0.9rem', color: '#F5F3E7', opacity: 0.9 }}>{info.authors}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '2rem' }}>
            {info.traits.map((trait, idx) => (
              <span key={idx} style={{ background: 'rgba(212,175,55,0.150)', border: '1px solid #D4AF37', color: '#D4AF37', padding: '4px 12px', fontSize: '0.85rem', fontFamily: 'Georgia, serif', borderRadius: '2px' }}>
                {trait}
              </span>
            ))}
          </div>

          {!isDevPreview && (
            <div style={{ textAlign: 'center', fontSize: '0.85rem', fontStyle: 'italic', color: '#E6C7C2', marginBottom: '1.5rem' }}>
              {saving ? 'Registrando sua jornada na planilha...' : saved ? '✦ Sua jornada foi eternizada com sucesso!' : ''}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <DiamondButton onClick={onRestart} variant="primary">
              {isDevPreview ? 'Voltar ao Painel Dev' : 'Refazer Jornada'}
            </DiamondButton>
          </div>
        </ParchmentCard>
      </div>
    </main>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('hero');
  const [participantName, setParticipantName] = useState('');
  const [userSubgenre, setUserSubgenre] = useState<Subgenre>('epic');
  const [isDevPreview, setIsDevPreview] = useState(false);

  const handleQuizComplete = (subgenre: Subgenre, name: string) => {
    setUserSubgenre(subgenre);
    setParticipantName(name);
    setIsDevPreview(false);
    setScreen('diagnostic');
  };

  const handleDevSelectSubgenre = (sub: Subgenre) => {
    setUserSubgenre(sub);
    setParticipantName('Programadora');
    setIsDevPreview(true);
    setScreen('result');
  };

  return (
    <>
      {screen === 'hero' && <HeroSection onStart={() => setScreen('quiz')} onDevAccess={() => setScreen('dev-login')} />}
      {screen === 'dev-login' && <DevLoginSection onLoginSuccess={() => setScreen('dev-dashboard')} onBack={() => setScreen('hero')} />}
      {screen === 'dev-dashboard' && <DevDashboardSection onBack={() => setScreen('hero')} onSelectSubgenre={handleDevSelectSubgenre} />}
      {screen === 'quiz' && <QuizSection onComplete={handleQuizComplete} />}
      {screen === 'diagnostic' && <DiagnosticSection participantName={participantName} subgenre={userSubgenre} onNext={() => setScreen('result')} />}
      {screen === 'result' && <ResultSection participantName={participantName} subgenre={userSubgenre} onRestart={() => isDevPreview ? setScreen('dev-dashboard') : setScreen('hero')} isDevPreview={isDevPreview} />}
    </>
  );
}
