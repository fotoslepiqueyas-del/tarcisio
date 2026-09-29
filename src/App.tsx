import React, { useState, useRef } from 'react';
import backgroundMusic from './assets/-_Enya_-_Caribbean_Blue_(mp3.pm).mp3';

/* ─── Types ─────────────────────────────────────────────────────────────── */

type Screen = 'hero' | 'quiz' | 'result';
type Subgenre = 'epic' | 'dark' | 'urban' | 'romantasy' | 'historical' | 'portal';

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
  authors: string;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

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
      { text: 'Um demônio que selou um pacto contigo no passado', icon: '😈', subgenre: 'dark' },
      { text: 'Um detetive sobrenatural que decifra os segredos da cidade', icon: '🔍', subgenre: 'urban' },
      { text: 'Um príncipe ou princesa de um reino rival', icon: '👑', subgenre: 'romantasy' },
      { text: 'Um cavaleiro de uma ordem esquecida pela história', icon: '🛡️', subgenre: 'historical' },
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
      { text: 'Usando magia antiga aprendida de grimorios medievais', icon: '📖', subgenre: 'historical' },
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
      { text: 'Um mapa que conduz a reinos além das estrelas', icon: '🗺️', subgenre: 'portal' },
    ],
  },
];

const subgenreResults: Record<Subgenre, SubgenreResult> = {
  epic: {
    title: 'Alta Fantasia Épica',
    subtitle: 'Reinos Imortais & Profecias das Eras',
    description:
      'Sua alma pulsa com o ritmo das batalhas eternas. Você é feito de lendas e estrelas — do tipo que sobrevive a guerras, ergue impérios e reescreve profecias. Os grandes mapas do mundo chamam seu nome, e dragões dobram seus pescoços para ouvi-lo. A Jornada do Herói é o seu ritmo cardíaco; o sacrifício pelo bem maior, a sua religião.',
    emblem: '🏰',
    traits: ['Grandioso', 'Épico', 'Mitológico', 'Profético'],
    authors: 'Tolkien · Sanderson · George R.R. Martin',
  },
  dark: {
    title: 'Fantasia Sombria',
    subtitle: 'Fronteiras entre o Crepúsculo e o Abismo',
    description:
      'As trevas não te assustam — elas te fascinam. Você caminha nas bordas do mundo, onde a magia corrói a sanidade e os heróis pagam preços sangrentos por cada vitória. A beleza e o horror coexistem em você como gêmeos inseparáveis. Você prefere verdades cruéis a mentiras confortáveis, e isso te torna extraordinário.',
    emblem: '🌑',
    traits: ['Sombrio', 'Visceral', 'Filosófico', 'Complexo'],
    authors: 'Joe Abercrombie · V.E. Schwab · Patrick Rothfuss',
  },
  urban: {
    title: 'Fantasia Urbana',
    subtitle: 'Ruas Encantadas de Metrópoles Secretas',
    description:
      'Você enxerga o que os outros ignoram — a magia escondida nos becos da cidade, os fae disfarçados de mendigos, os vampiros nos mesmos cafés que você. Seu mundo tem duas camadas: o mundano e o sobrenatural, e você habita ambas com igual conforto e uma ironia que encanta.',
    emblem: '🌃',
    traits: ['Contemporâneo', 'Misterioso', 'Dualista', 'Perspicaz'],
    authors: 'Neil Gaiman · Cassandra Clare · Jim Butcher',
  },
  romantasy: {
    title: 'Romantasy',
    subtitle: 'Reinos onde o Amor é a Maior das Magias',
    description:
      'Para você, nenhuma batalha épica supera a tensão de dois corações destinados que resistem ao destino. Você lê nas entrelinhas entre o poder e o desejo, no olhar que diz mais do que qualquer profecia. Cortes fae, príncipes inacessíveis e amores impossíveis são o seu alimento espiritual.',
    emblem: '🌹',
    traits: ['Apaixonado', 'Intenso', 'Mágico', 'Emotivo'],
    authors: 'Sarah J. Maas · Rebecca Yarros · Holly Black',
  },
  historical: {
    title: 'Fantasia Histórica',
    subtitle: 'Eras Perdidas onde a Magia Moldou a História',
    description:
      'Você sente o cheiro de pergaminhos antigos e escuta o sussurro de civilizações esquecidas. A magia, para você, está enraizada na história — nos rituais da Roma Antiga, nas feiticeiras medievais, nos alquimistas do Renascimento. Você estuda o passado para compreender o presente encantado.',
    emblem: '🕯️',
    traits: ['Histórico', 'Ritualístico', 'Atmosférico', 'Erudito'],
    authors: 'Susanna Clarke · Naomi Novik · Guy Gavriel Kay',
  },
  portal: {
    title: 'Fantasia de Portal',
    subtitle: 'Além — nos Mundos do Outro Lado do Espelho',
    description:
      'Você sempre olhou para espelhos, armários e fontes antigas com uma pergunta nos olhos: e se? Sua fantasia favorita começa quando um ser ordinário atravessa o limiar do impossível e descobre ser extraordinário. A maravilha da descoberta e a reinvenção de si mesmo em um mundo novo alimentam a sua imaginação.',
    emblem: '🌀',
    traits: ['Maravilhoso', 'Transformador', 'Descoberta', 'Reinvenção'],
    authors: 'C.S. Lewis · Lev Grossman · Seanan McGuire',
  },
};

function calculateResult(answers: Subgenre[]): Subgenre {
  const scores: Record<Subgenre, number> = {
    epic: 0, dark: 0, urban: 0, romantasy: 0, historical: 0, portal: 0,
  };
  answers.forEach(a => scores[a]++);
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as Subgenre;
}

/* ─── SVG Ornaments ─────────────────────────────────────────────────────── */

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

function WaxSeal({ letter = 'RM', size = 60 }: { letter?: string; size?: number }) {
  const r = size / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={r} cy={r} r={r - 2} fill="#560319" stroke="#D4AF37" strokeWidth="1.5" />
      <circle cx={r} cy={r} r={r - 8} fill="none" stroke="#D4AF37" strokeWidth="0.5" />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#D4AF37"
        fontSize={size * 0.35}
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontWeight="bold"
      >
        {letter}
      </text>
    </svg>
  );
}

/* ─── Diamond Button ─────────────────────────────────────────────────────── */

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; color: string; shadow: string }> = {
  primary: { bg: '#560319', color: '#F5F3E7', shadow: '0 4px 20px rgba(86,3,25,0.4)' },
  secondary: { bg: '#4B5320', color: '#F5F3E7', shadow: '0 4px 20px rgba(75,83,32,0.4)' },
  ghost: { bg: 'transparent', color: '#D4AF37', shadow: 'none' },
};

function DiamondButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  wide = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  wide?: boolean;
}) {
  const s = VARIANT_STYLES[variant];
  return (
    <button
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
        background: 'linear-gradient(145deg, #f5edcf 0%, #ede2be 35%, #f2e8cc 65%, #e9ddb9 100%)',
        border: '1px solid rgba(212,175,55,0.6)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.2), inset 0 0 40px rgba(139,110,50,0.1)',
        padding: '2.5rem 2rem',
        ...style,
      }}
    >
      <CornerBrackets />
      {children}
    </div>
  );
}

function Header() {
  return (
    <header style={{ background: '#F5F3E7', borderBottom: '1px solid rgba(212,175,55,0.4)', padding: '1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <WaxSeal letter="RM" size={50} />
        <h1 style={{ fontFamily: "Georgia, serif", color: '#333', fontSize: '1.5rem', margin: 0 }}>O Reino Mágico</h1>
      </div>
    </header>
  );
}

function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <main style={{ background: 'linear-gradient(158deg, #130609 0%, #0e1808 45%, #140f04 100%)', minHeight: 'calc(100vh - 90px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <ParchmentCard style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <Filigrana />
        <h2 style={{ fontFamily: "Georgia, serif", color: '#560319', fontSize: '2.2rem', margin: '1rem 0' }}>Qual é o seu Subgênero de Fantasia?</h2>
        <GoldDivider />
        <p style={{ fontFamily: "Georgia, serif", fontStyle: 'italic', color: '#333', fontSize: '1.1rem', margin: '1.5rem 0' }}>
          Responda a 6 perguntas e descubra a qual mundo literário você pertence.
        </p>
        <Filigrana flip />
        <div style={{ marginTop: '1.5rem' }}>
          <DiamondButton onClick={onStart} variant="primary" wide>Iniciar Jornada</DiamondButton>
        </div>
      </ParchmentCard>
    </main>
  );
}

function QuizSection({ question, questionIndex, total, selected, onSelect, onNext }: any) {
  const isLast = questionIndex === total - 1;
  const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  return (
    <main style={{ background: '#F5F3E7', minHeight: 'calc(100vh - 90px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <p style={{ textAlign: 'center', color: '#560319', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Pergunta {questionIndex + 1} de {total}
        </p>
        <ParchmentCard>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: "Georgia, serif", color: '#333', fontSize: '1.8rem', margin: 0 }}>{question.question}</h2>
            <p style={{ fontStyle: 'italic', color: '#7a6a4e', fontSize: '0.9rem' }}>{question.subtitle}</p>
            <GoldDivider glyph="◆" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                    gap: '12px',
                    padding: '12px 16px',
                    background: isSelected ? '#4B5320' : 'rgba(255,255,255,0.4)',
                    border: '1px solid #D4AF37',
                    cursor: 'pointer',
                    color: isSelected ? '#F5F3E7' : '#333',
                    fontFamily: "Georgia, serif",
                    fontSize: '1rem',
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>{OPTION_LETTERS[idx]}.</span>
                  <span>{opt.icon}</span>
                  <span style={{ fontStyle: 'italic' }}>{opt.text}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <DiamondButton onClick={onNext} variant="secondary" disabled={!selected}>
              {isLast ? 'Revelar Destino' : 'Próxima Pergunta'}
            </DiamondButton>
          </div>
        </ParchmentCard>
      </div>
    </main>
  );
}

function ResultSection({ result, onReset }: any) {
  return (
    <main style={{ background: 'linear-gradient(158deg, #130609 0%, #0c1507 45%, #13100a 100%)', minHeight: 'calc(100vh - 90px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <ParchmentCard style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{result.emblem}</div>
        <Filigrana />
        <h2 style={{ fontFamily: "Georgia, serif", color: '#560319', fontSize: '2.5rem', margin: '0.5rem 0' }}>{result.title}</h2>
        <p style={{ fontStyle: 'italic', color: '#560319', marginBottom: '1rem' }}>{result.subtitle}</p>
        <GoldDivider glyph="◆ ◆ ◆" />
        <p style={{ fontStyle: 'italic', color: '#333', lineHeight: '1.6', textAlign: 'left', margin: '1rem 0' }}>{result.description}</p>
        <p style={{ fontSize: '0.85rem', color: '#7a6a4e', margin: '1.5rem 0' }}>Autores de referência: {result.authors}</p>
        <Filigrana flip />
        <div style={{ marginTop: '1.5rem' }}>
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  function startQuiz() {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(err => {
        console.log("Reprodução automática impedida:", err);
      });
    }

    setScreen('quiz');
    setQuestionIndex(0);
    setAnswers([]);
    setSelected(null);
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
      setResult(subgenreResults[winner]);
      setScreen('result');
    }
  }

  function resetQuiz() {
    setScreen('hero');
    setQuestionIndex(0);
    setAnswers([]);
    setSelected(null);
    setResult(null);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3E7' }}>
      <audio 
        ref={audioRef} 
        src={backgroundMusic} 
        loop 
      />

      <Header />
      {screen === 'hero' && <HeroSection onStart={startQuiz} />}
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
      {screen === 'result' && result && <ResultSection result={result} onReset={resetQuiz} />}
    </div>
  );
}
