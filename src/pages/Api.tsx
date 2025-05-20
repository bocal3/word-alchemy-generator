const ApiPage = () => (
  <div style={{ padding: 32 }}>
    <h1>API Psum</h1>
    <p>
      Utilisez l’API à l’adresse <code>/api/generate</code>.<br />
      Exemple : <code>GET http://localhost:3001/api/generate?lang=fr&dictionaries=default&paragraphCount=3</code>
    </p>
    <p>
      Les paramètres disponibles : <br />
      <ul>
        <li><b>lang</b> : en, fr, es</li>
        <li><b>dictionaries</b> : liste séparée par des tirets (ex : default-medical)</li>
        <li><b>paragraphCount</b> : nombre de paragraphes (1-50)</li>
        <li><b>wordsRange</b> : min-max (ex : 5-15)</li>
        <li><b>sentencesRange</b> : min-max (ex : 3-7)</li>
      </ul>
    </p>
  </div>
);

export default ApiPage;
