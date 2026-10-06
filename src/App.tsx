import React, { useState, useRef, useEffect } from 'react';

// Imports das capas de imagens
import capaCorte from './assets/corte.png';
import capaTrono from './assets/trono.png';
import capaPriorado from './assets/priorado.png';
import capaCoracao from './assets/coracao.png';
import capaNarnia from './assets/narnia.png';
import capaInstrumentos from './assets/instrumentos.png';

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

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz2lOopoqdZWV_ZW1N0rrrWu4MHQFh5qvd8z9_AynncX6WAduCH5oKRxeXBP6q-1DL_/exec';

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
      { text: 'O destino pode ser reescrito através de alianças e sacrifícios', icon: '✍️️', subgenre: 'romantasy' },
      { text: 'O destino não existe; nós o forjamos nas trevas do presente', icon: '⚒️', subgenre: 'grimdark' },
    ],
  },
  {
    id: 11,
    question: 'Qual paisagem desperta sua curiosidade?',
    subtitle: 'O cenário que captura seus pensamentos mais profundos',
    options: [
      { text: 'Ruínas ancestrais cobertas por musgo e runas esquecidas', icon: '🏛️️', subgenre: 'historical' },
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
      { text: 'A traição daqueles em quem você jurou confiar cegamente', icon: '🗡️', subgenre: 'grimdark' },
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
    bookCover: capaCoracao,
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
    bookCover: capaTrono,
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
    bookCover: capaPriorado,
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

function DevDashboardSection({ onBack }: { onBack: () => void }) {
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

  return (
    <main style={{ background: 'radial-gradient(circle at center, #2c0b16 0%, #0c090a 100%)', minHeight: '100vh', padding: '3rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '850px', width: '100%' }}>
        <ParchmentCard>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Filigrana />
            <h2 style={{ fontFamily: "Georgia, serif", color: '#D4AF37', fontSize: '2rem', margin: '1rem 0' }}>
              Painel Dev: Dados do Google Sheets
            </h2>
            <p style={{ fontStyle: 'italic', color: '#E6C7C2', fontSize: '0.9rem' }}>
              Registros obtidos em tempo real direto da sua planilha integrada.
            </p>
            <GoldDivider glyph="📊" />
          </div>

          <div style={{ maxHeight: '38vh', overflowY: 'auto', marginBottom: '1.5rem', border: '1px solid rgba(212,175,55,0.3)', padding: '10px', background: 'rgba(0,0,0,0.3)' }}>
            {loading ? (
              <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#E6C7C2', padding: '2rem' }}>
                Carregando registros da planilha...
              </p>
            ) : errorMsg ? (
              <p style={{ textAlign: 'center', color: '#ffb3b3', padding: '2rem' }}>
                {errorMsg}
              </p>
            ) : participants.length === 0 ? (
              <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#E6C7C2', padding: '2rem' }}>
                Nenhum registro encontrado na planilha.
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Georgia, serif', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #D4AF37', color: '#D4AF37' }}>
                    <th style={{ padding: '8px' }}>Nome</th>
                    <th style={{ padding: '8px' }}>Subgênero Registrado</th>
                    <th style={{ padding: '8px' }}>Data / Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(212,175,55,0.1)', color: '#F5F3E7' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{p.name}</td>
                      <td style={{ padding: '8px', color: '#E6C7C2' }}>{p.subgenre}</td>
                      <td style={{ padding: '8px', fontSize: '0.8rem', opacity: 0.8 }}>{p.date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <DiamondButton onClick={onBack} variant="secondary">Voltar ao Início</DiamondButton>
          </div>
        </ParchmentCard>
      </div>
    </main>
  );
}

function DiagnosticSection({ onSubmit, isSubmitting }: { onSubmit: (name: string) => void; isSubmitting: boolean }) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;
    onSubmit(name);
  };

  return (
    <main style={{ background: 'radial-gradient(circle at center, #2c0b16 0%, #0c090a 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <ParchmentCard style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <Filigrana />
        <h2 style={{ fontFamily: "Georgia, serif", color: '#D4AF37', fontSize: '2rem', margin: '1.2rem 0' }}>
          Registo de Viajante
        </h2>
        <GoldDivider glyph="◆" />
        <p style={{ fontStyle: 'italic', color: '#E6C7C2', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Insira o seu nome para que os anais do reino registem o seu diagnóstico místico.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', color: '#D4AF37', fontSize: '0.85rem', marginBottom: '5px', fontFamily: 'Georgia, serif' }}>Seu Nome:</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              disabled={isSubmitting}
              placeholder="O seu nome..."
              style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid #D4AF37', color: '#F5F3E7', borderRadius: '4px', fontFamily: 'Georgia, serif' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            <DiamondButton type="submit" variant="primary" wide disabled={isSubmitting}>
              {isSubmitting ? 'A enviar para Planilha...' : 'Revelar Destino'}
            </DiamondButton>
          </div>
        </form>
      </ParchmentCard>
    </main>
  );
}

function QuizSection({ question, questionIndex, total, selected, onSelect, onNext }: any) {
  const isLast = questionIndex === total - 1;
  const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  return (
    <main style={{ background: 'radial-gradient(circle at center, #2c0b16 0%, #0c090a 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '620px', width: '100%' }}>
        <p style={{ textAlign: 'center', color: '#D4AF37', fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "Georgia, serif" }}>
          Pergunta {questionIndex + 1} de {total}
        </p>
        <ParchmentCard>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: "Georgia, serif", color: '#F5F3E7', fontSize: '1.85rem', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              {question.question}
            </h2>
            <p style={{ fontStyle: 'italic', color: '#E6C7C2', fontSize: '0.95rem', marginTop: '6px' }}>{question.subtitle}</p>
            <GoldDivider glyph="◆" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {question.options.map((opt: any, idx: number) => {
              const isSelected = selected === opt.subgenre;
              return (
                <button
                  key={idx}
                  onClick={() => onSelect(opt.subgenre)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    background: isSelected ? 'linear-gradient(135deg, #4B5320 0%, #2c3212 100%)' : 'rgba(35, 18, 24, 0.7)',
                    border: isSelected ? '1.5px solid #D4AF37' : '1px solid rgba(212,175,55,0.3)',
                    cursor: 'pointer',
                    color: isSelected ? '#F5F3E7' : '#E6C7C2',
                    fontFamily: "Georgia, serif",
                    fontSize: '1.05rem',
                    boxShadow: isSelected ? '0 4px 15px rgba(75,83,32,0.4)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontWeight: 'bold', color: '#D4AF37' }}>{OPTION_LETTERS[idx]}.</span>
                  <span style={{ fontSize: '1.2rem' }}>{opt.icon}</span>
                  <span style={{ fontStyle: 'italic' }}>{opt.text}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <DiamondButton onClick={onNext} variant="secondary" disabled={!selected}>
              {isLast ? 'Prosseguir para Registo' : 'Próxima Pergunta'}
            </DiamondButton>
          </div>
        </ParchmentCard>
      </div>
    </main>
  );
}

function ResultSection({ result, onReset }: any) {
  return (
    <main style={{ background: 'radial-gradient(circle at center, #2c0b16 0%, #0c090a 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <ParchmentCard style={{ maxWidth: '640px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3.2rem', marginBottom: '0.2rem', filter: 'drop-shadow(0 2px 8px rgba(212,175,55,0.4))' }}>{result.emblem}</div>
        <Filigrana />
        <h2 style={{ fontFamily: "Georgia, serif", color: '#D4AF37', fontSize: '2.5rem', margin: '0.5rem 0' }}>{result.title}</h2>
        <p style={{ fontStyle: 'italic', color: '#E6C7C2', fontSize: '1.05rem', marginBottom: '1rem' }}>{result.subtitle}</p>
        
        <GoldDivider glyph="◆ ◆ ◆" />
        
        <p style={{ fontStyle: 'italic', color: '#F5F3E7', lineHeight: '1.7', textAlign: 'left', margin: '1.2rem 0', fontSize: '1.05rem' }}>
          {result.description}
        </p>

        <div style={{ margin: '2rem 0 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '10px', fontWeight: 'bold' }}>
            ✦ Obra Recomendada ✦
          </p>
          <div style={{ position: 'relative', padding: '6px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid #D4AF37', boxShadow: '0 8px 25px rgba(0,0,0,0.6)' }}>
            <img 
              src={result.bookCover} 
              alt={result.bookSuggestion} 
              style={{ width: '150px', height: '220px', objectFit: 'cover', display: 'block' }} 
            />
          </div>
          
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: '1.35rem', color: '#D4AF37', fontWeight: 'bold', marginTop: '14px', marginBottom: '8px' }}>
            {result.bookSuggestion}
          </h3>

          <p style={{ fontStyle: 'italic', color: '#E6C7C2', fontSize: '0.98rem', lineHeight: '1.6', maxWidth: '520px', margin: '0 auto', textAlign: 'center', background: 'rgba(86, 3, 25, 0.3)', padding: '12px 16px', borderLeft: '2px solid #D4AF37', borderRight: '2px solid #D4AF37' }}>
            "{result.bookSynopsis}"
          </p>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#bfa89b', fontStyle: 'italic', margin: '1.5rem 0 1rem' }}>Autores essenciais: {result.authors}</p>
        
        <Filigrana flip />
        <div style={{ marginTop: '1.8rem' }}>
          <DiamondButton onClick={onReset} variant="primary">Refazer o Quiz</DiamondButton>
        </div>
      </ParchmentCard>
    </main>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('hero');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Subgenre[]>([]);
  const [selected, setSelected] = useState<Subgenre | null>(null);
  const [result, setResult] = useState<SubgenreResult | null>(null);
  const [pendingWinner, setPendingWinner] = useState<Subgenre | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  function startQuiz() {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(err => {
        console.warn("Reprodução automática impedida pelo navegador:", err);
      });
    }

    setScreen('quiz');
    setQuestionIndex(0);
    setAnswers([]);
    setSelected(null);
    setPendingWinner(null);
  }

  function handleNext() {
    if (!selected) return;
    const updated = [...answers, selected];

    if (questionIndex < questions.length - 1) {
      setAnswers(updated);
      setQuestionIndex(i => i + 1);
      setSelected(null);
    } else {
      const winner = calculateResult(updated);
      setPendingWinner(winner);
      setScreen('diagnostic');
    }
  }

  async function handleDiagnosticSubmit(name: string) {
    if (!pendingWinner || isSubmitting) return;

    setIsSubmitting(true);
    const winnerResult = subgenreResults[pendingWinner];

    const submissionData = {
      name,
      subgenreResult: winnerResult.title,
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
    } catch (error) {
      console.error('Erro ao enviar dados para a planilha:', error);
    } finally {
      setIsSubmitting(false);
      setResult(winnerResult);
      setScreen('result');
    }
  }

  function resetQuiz() {
    setScreen('hero');
    setQuestionIndex(0);
    setAnswers([]);
    setSelected(null);
    setResult(null);
    setPendingWinner(null);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0c090a' }}>
      <audio 
        ref={audioRef} 
        src="/enya.mp3" 
        loop 
        preload="auto"
      />

      {screen === 'hero' && (
        <HeroSection 
          onStart={startQuiz} 
          onDevAccess={() => setScreen('dev-login')} 
        />
      )}

      {screen === 'dev-login' && (
        <DevLoginSection 
          onLoginSuccess={() => setScreen('dev-dashboard')} 
          onBack={() => setScreen('hero')} 
        />
      )}

      {screen === 'dev-dashboard' && (
        <DevDashboardSection 
          onBack={() => setScreen('hero')} 
        />
      )}

      {screen === 'quiz' && (
        <QuizSection
          question={questions[questionIndex]}
          questionIndex={questionIndex}
          total={questions.length}
          selected={selected}
          onSelect={setSelected}
          onNext={handleNext}
        />
      )}

      {screen === 'diagnostic' && (
        <DiagnosticSection onSubmit={handleDiagnosticSubmit} isSubmitting={isSubmitting} />
      )}

      {screen === 'result' && result && (
        <ResultSection result={result} onReset={resetQuiz} />
      )}
    </div>
  );
}
