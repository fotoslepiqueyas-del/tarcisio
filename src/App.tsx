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
          Digite a senha secreta para gerenciar e visualizar os subgêneros do app.
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
