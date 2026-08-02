function PolitiqueConfidentialite() {
  return (
    <div className="card">
      <h2>Politique de confidentialité</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Dernière mise à jour : août 2026</p>

      <h3>1. Données que nous collectons</h3>
      <p>Pour utiliser SunuKeur, nous collectons :</p>
      <ul>
        <li>Nom, prénom, numéro de téléphone et WhatsApp (comptes propriétaires)</li>
        <li>Adresse email (optionnelle)</li>
        <li>Photo de profil (optionnelle)</li>
        <li>Pour les chercheurs de logement : nom et numéro de téléphone, uniquement lors d'une demande de contact</li>
        <li>Pour les annonces : photos du logement, et le statut déclaré du publicateur (propriétaire, mandataire, ou membre de la famille autorisé)</li>
      </ul>

      <h3>2. Pourquoi nous collectons ces données</h3>
      <p>
        Ces informations servent uniquement à faire fonctionner la plateforme : afficher les annonces,
        et vous mettre en relation avec un propriétaire ou un locataire intéressé.
      </p>

      <h3>3. Vérification des annonces</h3>
      <p>
        Chaque annonce publiée repose sur une déclaration sur l'honneur du publicateur, complétée par
        une vérification manuelle effectuée par notre équipe (contrôle des informations, et le cas
        échéant, un appel téléphonique). Si une annonce présente des éléments suspects, un justificatif
        complémentaire peut exceptionnellement être demandé avant validation.
      </p>

      <h3>4. Qui peut voir vos données</h3>
      <p>
        Votre numéro de téléphone et votre WhatsApp ne sont jamais affichés publiquement sur une annonce ;
        ils sont uniquement communiqués à notre équipe pour organiser la mise en relation entre propriétaire
        et locataire.
      </p>

      <h3>5. Conservation des données</h3>
      <p>
        Vos données sont conservées tant que votre compte est actif. Vous pouvez supprimer votre compte
        à tout moment depuis "Mon espace" (section Mon compte), ce qui efface définitivement votre profil
        et vos annonces.
      </p>

      <h3>6. Cookies et stockage local</h3>
      <p>
        SunuKeur utilise le stockage local de votre navigateur pour mémoriser votre préférence de thème
        (clair/sombre) et votre session de connexion. Aucun cookie publicitaire ou de traçage tiers n'est utilisé.
      </p>

      <h3>7. Vos droits</h3>
      <p>
        Vous pouvez à tout moment consulter, modifier ou supprimer vos informations personnelles depuis
        "Mon espace", ou nous contacter via la page Contact pour toute question relative à vos données.
      </p>
    </div>
  );
}

export default PolitiqueConfidentialite;